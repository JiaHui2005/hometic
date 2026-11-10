from datetime import datetime, timedelta, timezone

import pytest
from jose import jwt

from app.api import auth as auth_api
from app.core.config import get_settings
from app.core.security import hash_otp
from app.models.entities import Review, User
from app.utils import uploads


def old_token(email: str, token_type: str = "access") -> str:
    """Token phát hành 1 phút trước (iat có độ chính xác giây, nên test thu hồi cần mốc rõ ràng)."""
    now = datetime.now(timezone.utc)
    payload = {"sub": email, "type": token_type, "iat": now - timedelta(minutes=1), "exp": now + timedelta(hours=1)}
    return jwt.encode(payload, get_settings().secret_key, algorithm="HS256")


def bearer(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def give_otp(db, email: str, otp: str = "424242"):
    user = db.query(User).filter_by(email=email).one()
    user.reset_otp = hash_otp(otp)
    user.otp_attempts = 0
    user.otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=10)
    db.commit()


# --- Đặt lại mật khẩu ---

def test_reset_requires_matching_email(client, db, seed):
    give_otp(db, "user@test.com")
    # Đúng OTP nhưng email khác: không đổi được mật khẩu người khác
    res = client.post("/api/auth/reset-password", json={"email": "admin@test.com", "token": "424242", "new_password": "matkhaumoi1"})
    assert res.status_code == 400


def test_reset_success_revokes_old_sessions(client, db, seed):
    give_otp(db, "user@test.com")
    old = old_token("user@test.com")
    res = client.post("/api/auth/reset-password", json={"email": "user@test.com", "token": "424242", "new_password": "matkhaumoi1"})
    assert res.status_code == 200
    assert client.get("/api/my-orders", headers=bearer(old)).status_code == 401
    assert client.post("/api/auth/refresh", json={"refresh_token": old_token("user@test.com", "refresh")}).status_code == 401
    login = client.post("/api/auth/login", json={"email": "user@test.com", "password": "matkhaumoi1"})
    assert login.status_code == 200


def test_otp_burned_after_five_wrong_guesses(client, db, seed):
    give_otp(db, "user@test.com")
    for guess in ("000001", "000002", "000003", "000004", "000005"):
        body = {"email": "user@test.com", "token": guess, "new_password": "matkhaumoi1"}
        assert client.post("/api/auth/reset-password", json=body).status_code == 400
    # Mã đúng cũng không dùng được nữa
    body = {"email": "user@test.com", "token": "424242", "new_password": "matkhaumoi1"}
    assert client.post("/api/auth/reset-password", json=body).status_code == 400


def test_forgot_password_same_answer_for_unknown_email(client, db, seed, monkeypatch):
    sent = []
    monkeypatch.setattr(auth_api, "send_reset_password_email", lambda email, otp: sent.append((email, otp)) or True)
    known = client.post("/api/auth/forgot-password", json={"email": "user@test.com"})
    unknown = client.post("/api/auth/forgot-password", json={"email": "nobody@test.com"})
    assert known.status_code == unknown.status_code == 200
    assert known.json() == unknown.json()
    # OTP gửi đi 6 chữ số, trong DB chỉ có bản băm
    (email, otp), = sent
    db.expire_all()
    stored = db.query(User).filter_by(email="user@test.com").one().reset_otp
    assert len(otp) == 6 and otp.isdigit() and stored == hash_otp(otp) and otp not in stored


# --- Giới hạn số lần thử ---

def test_login_rate_limited(client, seed):
    codes = [client.post("/api/auth/login", json={"email": "user@test.com", "password": "sai"}).status_code for _ in range(11)]
    assert codes[:10] == [401] * 10
    assert codes[10] == 429


def test_forgot_password_rate_limited(client, seed, monkeypatch):
    monkeypatch.setattr(auth_api, "send_reset_password_email", lambda *a: True)
    codes = [client.post("/api/auth/forgot-password", json={"email": "user@test.com"}).status_code for _ in range(4)]
    assert codes == [200, 200, 200, 429]


# --- Đổi mật khẩu ---

def test_change_password_returns_new_session_and_revokes_old(client, seed):
    old = old_token("user@test.com")
    res = client.put("/api/auth/change-password", headers=bearer(old), json={"old_password": "123456", "new_password": "matkhaumoi1"})
    assert res.status_code == 200
    assert client.get("/api/my-orders", headers=bearer(old)).status_code == 401
    assert client.get("/api/my-orders", headers=bearer(res.json()["access_token"])).status_code == 200


def test_password_minimum_length(client, seed, user_headers):
    res = client.put("/api/auth/change-password", headers=user_headers, json={"old_password": "123456", "new_password": "1234567"})
    assert res.status_code == 422


# --- Upload ---

@pytest.fixture
def upload_dir(tmp_path, monkeypatch):
    monkeypatch.setattr(uploads, "UPLOAD_DIR", tmp_path)
    return tmp_path


def test_upload_ignores_client_path(client, seed, admin_headers, upload_dir):
    res = client.post("/api/admin/upload", headers=admin_headers, files={"file": ("../../evil.png", b"\x89PNG", "image/png")})
    assert res.status_code == 200
    name = res.json()["url"].rsplit("/", 1)[1]
    assert ".." not in name and "/" not in name
    assert [p.name for p in upload_dir.iterdir()] == [name]


def test_upload_rejects_non_images(client, seed, user_headers, upload_dir):
    res = client.post("/api/auth/upload-avatar", headers=user_headers, files={"file": ("x.html", b"<script>", "text/html")})
    assert res.status_code == 400
    assert list(upload_dir.iterdir()) == []


def test_upload_size_limit(client, seed, user_headers, upload_dir, monkeypatch):
    monkeypatch.setattr(uploads, "MAX_BYTES", 10)
    res = client.post("/api/auth/upload-avatar", headers=user_headers, files={"file": ("a.jpg", b"0" * 11, "image/jpeg")})
    assert res.status_code == 413
    assert list(upload_dir.iterdir()) == []


# --- Lộ dữ liệu ---

def test_reviews_hide_reviewer_private_fields(client, db, seed):
    db.add(Review(user_id=1, product_id=1, rating=5, comment="Tốt"))
    db.commit()
    user = client.get("/api/products/1/reviews").json()[0]["user"]
    assert set(user) == {"full_name", "avatar_url"}


def test_db_errors_not_leaked(client, seed, admin_headers):
    body = {"category_id": 1, "name": "x", "slug": "x", "price": 1, "image_url": "a" * 300}
    res = client.post("/api/admin/products", headers=admin_headers, json=body)
    assert res.status_code == 422
    assert "SQL" not in res.text


def test_security_headers(client):
    headers = client.get("/api/health").headers
    assert headers["X-Content-Type-Options"] == "nosniff"
    assert headers["X-Frame-Options"] == "DENY"


def test_upload_goes_to_cloudinary_when_enabled(client, seed, admin_headers, upload_dir, monkeypatch):
    from app.core.config import get_settings
    calls = []
    monkeypatch.setattr(get_settings(), "storage_backend", "cloudinary")
    monkeypatch.setattr(uploads, "upload_to_cloudinary",
                        lambda data, public_id, folder: calls.append((len(data), public_id, folder)) or f"https://res.cloudinary.com/demo/image/upload/{public_id}.png")
    res = client.post("/api/admin/upload", headers=admin_headers, files={"file": ("../a.png", b"\x89PNG", "image/png")})
    assert res.status_code == 200
    assert res.json()["url"].startswith("https://res.cloudinary.com/")
    (size, public_id, folder), = calls
    assert size == 4 and public_id.startswith("product_") and folder == "products"
    assert list(upload_dir.iterdir()) == []  # không ghi file ra đĩa


def test_cloudinary_failure_returns_502(client, seed, user_headers, monkeypatch):
    from app.core.config import get_settings
    monkeypatch.setattr(get_settings(), "storage_backend", "cloudinary")
    def boom(*a):
        raise RuntimeError("network down")
    monkeypatch.setattr(uploads, "upload_to_cloudinary", boom)
    res = client.post("/api/auth/upload-avatar", headers=user_headers, files={"file": ("a.jpg", b"jpg", "image/jpeg")})
    assert res.status_code == 502


def test_cloudinary_rejects_fake_image_with_400(client, seed, user_headers, monkeypatch):
    from cloudinary.exceptions import BadRequest
    from app.core.config import get_settings
    monkeypatch.setattr(get_settings(), "storage_backend", "cloudinary")
    def reject(*a):
        raise BadRequest("Invalid image file")
    monkeypatch.setattr(uploads, "upload_to_cloudinary", reject)
    res = client.post("/api/auth/upload-avatar", headers=user_headers, files={"file": ("a.png", b"<script>", "image/png")})
    assert res.status_code == 400

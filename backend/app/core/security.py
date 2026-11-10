import hashlib
import hmac
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings


# 10 vòng (2^10): mức tối thiểu OWASP khuyến nghị cho bcrypt. 12 vòng mất ~1,4 s mỗi lần đăng nhập trên
# CPU 0,1 nhân của Render free; 10 vòng nhanh gấp ~4. Hash cũ 12 vòng vẫn đăng nhập được và được băm lại khi
# đăng nhập thành công (max_rounds đánh dấu chúng cần cập nhật).
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=10, bcrypt__max_rounds=10)
settings = get_settings()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def verify_and_upgrade(password: str, hashed_password: str | None) -> tuple[bool, str | None]:
    """Kiểm tra mật khẩu; nếu đúng mà hash dùng cấu hình cũ thì trả kèm hash mới để lưu lại."""
    if not hashed_password:
        return False, None
    return pwd_context.verify_and_update(password, hashed_password)


def create_access_token(subject: str) -> str:
    expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    expire = datetime.now(timezone.utc) + expires_delta
    payload = {"sub": subject, "exp": expire, "iat": datetime.now(timezone.utc), "type": "access"}
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")


def create_refresh_token(subject: str) -> str:
    expires_delta = timedelta(days=7) # Refresh token lasts 7 days
    expire = datetime.now(timezone.utc) + expires_delta
    payload = {"sub": subject, "exp": expire, "iat": datetime.now(timezone.utc), "type": "refresh"}
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")


def create_reset_token(otp_code: str) -> str:
    """Mã hóa mã OTP vào JWT để gửi đi (hoặc kiểm tra sau này)"""
    expires_delta = timedelta(minutes=15)
    expire = datetime.now(timezone.utc) + expires_delta
    payload = {"sub": otp_code, "exp": expire, "type": "reset"}
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")


def decode_payload(token: str | None, token_type: str = "access") -> dict | None:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
    except JWTError:
        return None
    return payload if payload.get("type") == token_type else None


def decode_token(token: str | None, token_type: str = "access") -> str | None:
    payload = decode_payload(token, token_type)
    return payload.get("sub") if payload else None


def utc_now_seconds() -> datetime:
    """Giờ UTC (naive, như cột DATETIME) làm tròn xuống giây, cùng độ chính xác với claim iat."""
    return datetime.now(timezone.utc).replace(tzinfo=None, microsecond=0)


def token_revoked(payload: dict, user) -> bool:
    """Token phát hành trước lần đổi / đặt lại mật khẩu gần nhất thì không còn hiệu lực."""
    changed = user.password_changed_at
    if changed is None:
        return False
    return payload.get("iat", 0) < changed.replace(tzinfo=timezone.utc).timestamp()


def hash_otp(otp: str) -> str:
    """OTP chỉ lưu dạng HMAC: lộ DB cũng không đọc được mã đang hiệu lực."""
    return hmac.new(settings.secret_key.encode(), otp.encode(), hashlib.sha256).hexdigest()


def otp_matches(otp: str, stored_hash: str | None) -> bool:
    return bool(stored_hash) and hmac.compare_digest(hash_otp(otp), stored_hash)

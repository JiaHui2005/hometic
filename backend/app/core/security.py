import hashlib
import hmac
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


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

from fastapi import APIRouter, Depends, HTTPException, Request, status, UploadFile, File
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.security import (
    create_access_token, 
    create_refresh_token, 
    decode_payload,
    hash_otp,
    hash_password,
    otp_matches,
    token_revoked,
    utc_now_seconds,
    verify_password
)
from app.core.rate_limit import client_ip, enforce, login_by_email, login_by_ip, otp_by_email, otp_by_ip
from app.db.session import get_db
from app.models.entities import User, UserRole
from app.schemas.dto import (
    TokenOut, UserCreate, UserLogin, UserOut, UserUpdate, 
    RefreshTokenIn, ChangePasswordIn, ForgotPasswordIn, ResetPasswordIn
)
from app.utils.email import send_reset_password_email
from app.utils.uploads import save_image
import secrets
from datetime import datetime, timedelta, timezone
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

OTP_MAX_ATTEMPTS = 5
OTP_TTL = timedelta(minutes=15)

@router.post("/register", response_model=TokenOut)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    """Đăng ký tài khoản mới"""
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email đã được sử dụng")
    
    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        phone=payload.phone,
        birthday=payload.birthday,
        gender=payload.gender,
        role=UserRole.customer,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info("Tài khoản mới: id=%s", user.id)

    access_token = create_access_token(user.email)
    refresh_token = create_refresh_token(user.email)
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "token_type": "bearer", 
        "user": user
    }

@router.post("/login", response_model=TokenOut)
def login(payload: UserLogin, request: Request, db: Session = Depends(get_db)):
    """Đăng nhập hệ thống"""
    enforce((login_by_ip, client_ip(request)), (login_by_email, payload.email.lower()))
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        logger.warning("Đăng nhập thất bại: %s", payload.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sai email hoặc mật khẩu"
        )
    
    access_token = create_access_token(user.email)
    refresh_token = create_refresh_token(user.email)
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "token_type": "bearer", 
        "user": user
    }

@router.post("/refresh", response_model=TokenOut)
def refresh(payload: RefreshTokenIn, db: Session = Depends(get_db)):
    """Làm mới Access Token bằng Refresh Token"""
    token = decode_payload(payload.refresh_token, token_type="refresh")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token không hợp lệ hoặc đã hết hạn"
        )
    
    user = db.query(User).filter(User.email == token.get("sub")).first()
    if not user or token_revoked(token, user):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Không tìm thấy người dùng"
        )
    
    access_token = create_access_token(user.email)
    refresh_token = create_refresh_token(user.email)
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "token_type": "bearer", 
        "user": user
    }

@router.put("/me", response_model=UserOut)
def update_me(payload: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Cập nhật thông tin cá nhân (Hồ sơ cá nhân)"""
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/upload-avatar")
def upload_avatar(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    name = save_image(file, f"avatar_user_{current_user.id}")
    return {"url": f"/static/uploads/{name}"}

@router.put("/change-password", response_model=TokenOut)
def change_password(
    payload: ChangePasswordIn, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Đổi mật khẩu. Mọi phiên đăng nhập cũ bị vô hiệu; trả token mới cho phiên hiện tại."""
    if not verify_password(payload.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mật khẩu hiện tại không chính xác"
        )
    
    if verify_password(payload.new_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mật khẩu mới không được trùng với mật khẩu cũ"
        )

    current_user.password_hash = hash_password(payload.new_password)
    current_user.password_changed_at = utc_now_seconds()
    db.commit()
    logger.info("User %s đổi mật khẩu", current_user.id)

    return {
        "access_token": create_access_token(current_user.email),
        "refresh_token": create_refresh_token(current_user.email),
        "token_type": "bearer",
        "user": current_user,
    }

FORGOT_MESSAGE = "Nếu email đã đăng ký, mã xác nhận sẽ được gửi tới hộp thư trong ít phút"

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordIn, request: Request, db: Session = Depends(get_db)):
    # Cùng một câu trả lời dù email có tồn tại hay không, để không dò được ai đã đăng ký
    enforce((otp_by_ip, client_ip(request)), (otp_by_email, payload.email.lower()))
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        return {"message": FORGOT_MESSAGE}

    otp_code = f"{secrets.randbelow(10**6):06d}"
    user.reset_otp = hash_otp(otp_code)
    user.otp_attempts = 0
    user.otp_expiry = datetime.now(timezone.utc) + OTP_TTL
    db.commit()

    if not send_reset_password_email(user.email, otp_code):
        logger.error("Gửi email đặt lại mật khẩu thất bại cho user %s", user.id)
    return {"message": FORGOT_MESSAGE}

# --- API ĐẶT LẠI MẬT KHẨU MỚI ---
@router.post("/reset-password")
def reset_password(payload: ResetPasswordIn, request: Request, db: Session = Depends(get_db)):
    """Đặt lại mật khẩu bằng email + OTP. Sai quá 5 lần thì mã bị huỷ, phải xin mã mới."""
    enforce((otp_by_ip, client_ip(request)))
    invalid = HTTPException(status_code=400, detail="Mã xác nhận không chính xác hoặc đã hết hạn")

    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.reset_otp or not user.otp_expiry:
        raise invalid
    if user.otp_expiry.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise invalid

    if not otp_matches(payload.token, user.reset_otp):
        user.otp_attempts = (user.otp_attempts or 0) + 1
        if user.otp_attempts >= OTP_MAX_ATTEMPTS:
            user.reset_otp = None
            user.otp_expiry = None
            logger.warning("Huỷ OTP của user %s sau %d lần nhập sai", user.id, OTP_MAX_ATTEMPTS)
        db.commit()
        raise invalid

    user.password_hash = hash_password(payload.new_password)
    user.password_changed_at = utc_now_seconds()
    user.reset_otp = None
    user.otp_expiry = None
    user.otp_attempts = 0
    db.commit()
    logger.info("User %s đặt lại mật khẩu bằng OTP", user.id)

    return {"message": "Mật khẩu đã được thay đổi thành công"}

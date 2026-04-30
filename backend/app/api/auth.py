from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.security import (
    create_access_token, 
    create_refresh_token, 
    create_reset_token,
    decode_token, 
    hash_password, 
    verify_password
)
from app.db.session import get_db
from app.models.entities import User, UserRole
from app.schemas.dto import (
    TokenOut, UserCreate, UserLogin, UserOut, UserUpdate, 
    RefreshTokenIn, ChangePasswordIn, ForgotPasswordIn, ResetPasswordIn
)
from app.utils.email import send_reset_password_email
import os
import shutil
import random
from datetime import datetime, timedelta, timezone

router = APIRouter(prefix="/auth", tags=["auth"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

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
    
    access_token = create_access_token(user.email)
    refresh_token = create_refresh_token(user.email)
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "token_type": "bearer", 
        "user": user
    }

@router.post("/login", response_model=TokenOut)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """Đăng nhập hệ thống"""
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
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
    email = decode_token(payload.refresh_token, token_type="refresh")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token không hợp lệ hoặc đã hết hạn"
        )
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
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

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Lấy thông tin tài khoản hiện tại"""
    return current_user

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
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"avatar_user_{current_user.id}{file_extension}"
    
    physical_path = os.path.join(UPLOAD_DIR, file_name)

    with open(physical_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"url": f"/static/uploads/{file_name}"}

@router.put("/change-password")
def change_password(
    payload: ChangePasswordIn, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Đổi mật khẩu người dùng"""
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
    
    db.add(current_user)
    db.commit()
    
    return {"message": "Đổi mật khẩu thành công"}

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email không tồn tại trong hệ thống")
    
    # 1. Tạo mã 6 số ngẫu nhiên
    otp_code = str(random.randint(100000, 999999))
    
    # 2. Lưu vào DB và set hết hạn sau 15 phút
    user.reset_otp = otp_code
    user.otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=15)
    db.commit()
    
    # 3. Gửi email chứa mã 6 số
    success = send_reset_password_email(user.email, otp_code)
    
    if not success:
        raise HTTPException(status_code=500, detail="Lỗi gửi mail, vui lòng thử lại sau")
    
    return {"message": "Mã xác nhận đã được gửi đến email của bạn"}

# --- API ĐẶT LẠI MẬT KHẨU MỚI ---
@router.post("/reset-password")
def reset_password(payload: ResetPasswordIn, db: Session = Depends(get_db)):
    # payload.token lúc này là mã 6 số mà User nhập từ giao diện
    user = db.query(User).filter(User.reset_otp == payload.token).first()
    
    # 1. Kiểm tra mã OTP có tồn tại không
    if not user:
        raise HTTPException(status_code=400, detail="Mã xác nhận không chính xác")
    
    # 2. Kiểm tra thời gian hết hạn
    # Đảm bảo so sánh cùng múi giờ UTC
    current_time = datetime.now(timezone.utc)
    if user.otp_expiry.replace(tzinfo=timezone.utc) < current_time:
        raise HTTPException(status_code=400, detail="Mã xác nhận đã hết hạn")
    
    # 3. Cập nhật mật khẩu mới và xóa dấu vết OTP
    user.password_hash = hash_password(payload.new_password)
    user.reset_otp = None
    user.otp_expiry = None
    
    db.add(user)
    db.commit()
    
    return {"message": "Mật khẩu đã được thay đổi thành công"}

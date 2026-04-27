from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models.entities import User, UserRole
from app.schemas.dto import TokenOut, UserCreate, UserLogin, UserOut


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenOut)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email đã được sử dụng")
    user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=UserRole.customer,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"access_token": create_access_token(user.email), "user": user}


@router.post("/login", response_model=TokenOut)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sai email hoặc mật khẩu")
    return {"access_token": create_access_token(user.email), "user": user}


@router.post("/oauth/mock", response_model=TokenOut)
def oauth_mock(db: Session = Depends(get_db)):
    email = "oauth.customer@hometic.vn"
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            full_name="Khách OAuth Hometic",
            email=email,
            hashed_password=hash_password("oauth-demo"),
            role=UserRole.customer,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return {"access_token": create_access_token(user.email), "user": user}


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user

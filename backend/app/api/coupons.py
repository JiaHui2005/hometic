from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.entities import User, UserCoupon, Coupon
from app.schemas.dto import UserCouponOut
from datetime import datetime
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from app.utils.commerce import coupon_in_window
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/coupons", tags=["coupons"])

@router.get("/my-coupons", response_model=list[UserCouponOut])
def get_my_coupons(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Lấy danh sách mã giảm giá còn hạn của người dùng hiện tại"""
    now = datetime.now()
    
    user_coupons = (
        db.query(UserCoupon)
        .join(UserCoupon.coupon) 
        .options(joinedload(UserCoupon.coupon))
        .filter(
            UserCoupon.user_id == current_user.id,
            Coupon.is_active == True,
            or_(Coupon.start_date <= now, Coupon.start_date == None),
            or_(Coupon.end_date >= now, Coupon.end_date == None)
        )
        .order_by(UserCoupon.assigned_at.desc())
        .all()
    )
    return user_coupons
@router.get("/check/{code}", response_model=UserCouponOut)
def check_coupon(code: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Kiểm tra một mã giảm giá có khả dụng cho người dùng hiện tại hay không"""
    coupon = db.query(Coupon).filter(Coupon.code == code, Coupon.is_active == True).first()
    
    if not coupon:
        raise HTTPException(status_code=404, detail="Mã giảm giá không tồn tại hoặc đã hết hạn")
    
    if not coupon_in_window(coupon, datetime.now()):
        raise HTTPException(status_code=400, detail="Mã giảm giá chưa đến hạn hoặc đã hết hạn")

    # Kiểm tra xem user có sở hữu mã này không (nếu là mã riêng biệt)
    user_coupon = db.query(UserCoupon).filter(
        UserCoupon.user_id == current_user.id,
        UserCoupon.coupon_id == coupon.id
    ).first()
    
    if not user_coupon:
        raise HTTPException(status_code=403, detail="Bạn không sở hữu mã giảm giá này")

    if user_coupon.is_used:
        raise HTTPException(status_code=400, detail="Bạn đã sử dụng mã giảm giá này rồi")

    return user_coupon

@router.post("/claim/{code}", response_model=UserCouponOut)
def claim_coupon(code: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Người dùng tự nhập mã để lưu vào kho đồ của mình"""
    coupon = db.query(Coupon).filter(Coupon.code == code, Coupon.is_active == True).first()
    
    if not coupon:
        raise HTTPException(status_code=404, detail="Mã giảm giá không tồn tại")

    if not coupon_in_window(coupon, datetime.now()):
        raise HTTPException(status_code=400, detail="Mã giảm giá chưa đến hạn hoặc đã hết hạn")
        
    if coupon.used_count >= coupon.usage_limit:
        raise HTTPException(status_code=400, detail="Mã giảm giá này đã hết lượt sử dụng tổng hệ thống")

    existing = db.query(UserCoupon).filter(
        UserCoupon.user_id == current_user.id,
        UserCoupon.coupon_id == coupon.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Bạn đã sở hữu mã giảm giá này rồi")
        
    new_user_coupon = UserCoupon(
        user_id=current_user.id,
        coupon_id=coupon.id,
        is_used=False
    )
    
    db.add(new_user_coupon)
    try:
        db.commit()
    except IntegrityError:
        # 2 request "Lưu mã" cùng lúc: UNIQUE(user_id, coupon_id) chặn bản ghi thứ hai
        db.rollback()
        raise HTTPException(status_code=400, detail="Bạn đã sở hữu mã giảm giá này rồi")
    db.refresh(new_user_coupon)
    logger.info("User %s lưu mã %s", current_user.id, coupon.code)
    return new_user_coupon

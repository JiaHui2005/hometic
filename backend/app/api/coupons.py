from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.entities import User, UserCoupon, Coupon
from app.schemas.dto import UserCouponOut
from datetime import datetime

router = APIRouter(prefix="/coupons", tags=["coupons"])

@router.get("/my-coupons", response_model=list[UserCouponOut])
def get_my_coupons(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Lấy danh sách mã giảm giá của người dùng hiện tại"""
    user_coupons = (
        db.query(UserCoupon)
        .options(joinedload(UserCoupon.coupon))
        .filter(UserCoupon.user_id == current_user.id)
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
    
    # Kiểm tra thời gian
    now = datetime.now()
    if (coupon.start_date and coupon.start_date > now) or (coupon.end_date and coupon.end_date < now):
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
        
    now = datetime.now()
    if (coupon.start_date and coupon.start_date > now) or (coupon.end_date and coupon.end_date < now):
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
    db.commit()
    db.refresh(new_user_coupon)
    
    return new_user_coupon

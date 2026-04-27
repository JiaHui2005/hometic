from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import require_admin, get_current_user
from app.db.session import get_db
from app.schemas.dto import DashboardOut, UserOut, UserUpdate
from app.models.entities import User, Product, Order

router = APIRouter(tags=["admin"])

@router.get("/dashboard", response_model=DashboardOut)
def get_dashboard_stats(db: Session = Depends(get_db), _=Depends(require_admin)):
    """Lấy số liệu thống kê tổng quan (Doanh thu, Đơn hàng, Khách hàng)"""
    
    total_products = db.query(func.count(Product.id)).scalar() or 0

    total_orders = db.query(func.count(Order.id)).scalar() or 0

    total_customers = db.query(func.count(User.id)).filter(User.role == "customer").scalar() or 0

    total_revenue = db.query(func.sum(Order.total_price))\
        .filter(Order.status != "cancelled")\
        .scalar() or 0.0

    recent_orders = db.query(Order)\
        .order_by(Order.created_at.desc())\
        .limit(5)\
        .all()

    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_customers": total_customers,
        "total_revenue": float(total_revenue),
        "recent_orders": recent_orders
    }

@router.get("/users", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Liệt kê danh sách người dùng"""
    users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .all()
    )
    
    return users

@router.put("/users/{user_id}", response_model=UserOut)
def admin_update_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Cập nhật thông tin người dùng (VD: thay đổi quyền admin)"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(user, key, value)

    try:
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi cập nhật thông tin người dùng"
        )

    return user

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user), _=Depends(require_admin)):
    """[Admin] Xoá người dùng"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )

    # (Tùy chọn: Để tránh trường hợp hệ thống không còn admin nào)
    if user.id == current_user.id:
       raise HTTPException(status_code=400, detail="Bạn không thể tự vô hiệu hóa tài khoản của chính mình")
    
    # Set password_hash về NULL (nếu đăng nhập local) thêm tiền tố vào email để giải phóng email gốc.
    user.password_hash = None 
    user.full_name = f"[Đã xóa] {user.full_name}"
    
    # user.is_active = False nếu sau này update DB

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi vô hiệu hóa tài khoản"
        )

    return None

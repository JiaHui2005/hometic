from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import require_admin, get_current_user
from app.db.session import get_db
from app.models.entities import User
from app.schemas.dto import CheckoutIn, OrderOut, OrderStatusUpdate, CouponBase, CouponOut

router = APIRouter(tags=["orders"])

# --- Orders (Customer) ---

@router.post("/checkout", response_model=OrderOut)
def create_order(payload: CheckoutIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Đặt hàng mới (Lưu thông tin từ CheckoutIn vào database)"""
    pass

@router.get("/my-orders", response_model=list[OrderOut])
def list_my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Lấy danh sách đơn hàng của người dùng hiện tại"""
    pass

@router.get("/my-orders/{order_id}", response_model=OrderOut)
def get_my_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Xem chi tiết một đơn hàng cụ thể của tôi"""
    pass

# --- Orders (Admin) ---

@router.get("/admin/orders", response_model=list[OrderOut])
def admin_list_orders(db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Liệt kê tất cả đơn hàng trong hệ thống"""
    pass

@router.put("/admin/orders/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Cập nhật trạng thái đơn hàng (Đang xử lý, Đang giao, v.v.)"""
    pass

# --- Coupons (Admin) ---

@router.get("/admin/coupons", response_model=list[CouponOut])
def list_coupons(db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Liệt kê tất cả mã giảm giá"""
    pass

@router.post("/admin/coupons", response_model=CouponOut)
def create_coupon(payload: CouponBase, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Tạo mã giảm giá mới"""
    pass

@router.delete("/admin/coupons/{coupon_id}")
def delete_coupon(coupon_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Xoá mã giảm giá"""
    pass

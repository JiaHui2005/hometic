from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import require_admin
from app.db.session import get_db
from app.schemas.dto import DashboardOut, UserOut, UserUpdate

router = APIRouter(tags=["admin"])

@router.get("/dashboard", response_model=DashboardOut)
def get_dashboard_stats(db: Session = Depends(get_db), _=Depends(require_admin)):
    """Lấy số liệu thống kê tổng quan (Doanh thu, Đơn hàng, Khách hàng)"""
    pass

@router.get("/users", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Liệt kê danh sách người dùng"""
    pass

@router.put("/users/{user_id}", response_model=UserOut)
def admin_update_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Cập nhật thông tin người dùng (VD: thay đổi quyền admin)"""
    pass

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Xoá người dùng"""
    pass

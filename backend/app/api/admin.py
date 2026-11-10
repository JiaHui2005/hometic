from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import require_admin
from app.db.session import get_db
from app.schemas.dto import DashboardOut, UserOut, AdminChartsOut, ChartDataPoint
from app.models.entities import User, Product, Order, Category, OrderItem
from fastapi import File, UploadFile
from app.utils.uploads import save_image

router = APIRouter(tags=["admin"])

@router.get("/dashboard", response_model=DashboardOut)
def get_dashboard_stats(db: Session = Depends(get_db), _=Depends(require_admin)):
    """Lấy số liệu thống kê tổng quan (Doanh thu, Đơn hàng, Khách hàng)"""
    
    total_products = db.query(func.count(Product.id)).scalar() or 0

    total_orders = db.query(func.count(Order.id)).scalar() or 0

    total_customers = db.query(func.count(User.id)).filter(User.role == "customer").scalar() or 0

    total_revenue = db.query(func.sum(Order.total_amount))\
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

@router.get("/charts", response_model=AdminChartsOut)
def get_chart_data(db: Session = Depends(get_db), _=Depends(require_admin)):
    """Lấy dữ liệu cho biểu đồ đường (doanh thu theo ngày) và biểu đồ tròn (doanh thu theo danh mục)"""
    
    revenue_query = db.query(
        func.date(Order.created_at).label("day"),
        func.sum(Order.total_amount).label("revenue")
    ).filter(Order.status != "cancelled")\
     .group_by(func.date(Order.created_at))\
     .order_by(func.date(Order.created_at).desc())\
     .limit(30)\
     .all()
    
    revenue_by_day = [ChartDataPoint(label=str(r.day), value=float(r.revenue)) for r in reversed(revenue_query)]

    category_revenue = db.query(
        Category.name,
        func.sum(OrderItem.quantity * OrderItem.price_at_purchase).label("revenue")
    ).join(Product, Product.category_id == Category.id)\
     .join(OrderItem, OrderItem.product_id == Product.id)\
     .join(Order, Order.id == OrderItem.order_id)\
     .filter(Order.status != "cancelled")\
     .group_by(Category.name)\
     .all()
    
    revenue_by_category = [ChartDataPoint(label=c.name, value=float(c.revenue)) for c in category_revenue]

    status_dist = db.query(
        Order.status,
        func.count(Order.id).label("count")
    ).group_by(Order.status).all()
    
    order_status_distribution = [ChartDataPoint(label=s.status.value, value=float(s.count)) for s in status_dist]

    return {
        "revenue_by_day": revenue_by_day,
        "revenue_by_category": revenue_by_category,
        "order_status_distribution": order_status_distribution
    }

@router.post("/upload")
def upload_file(file: UploadFile = File(...), _=Depends(require_admin)):
    """[Admin] Upload ảnh sản phẩm / danh mục"""
    return {"url": save_image(file, "product", folder="products")}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user, require_admin
from app.db.session import get_db
from app.models.entities import Order, OrderItem, Product, Review, User, UserRole
from app.schemas.dto import CheckoutIn, DashboardOut, OrderOut, OrderStatusUpdate, ReviewCreate, ReviewOut


router = APIRouter(tags=["orders"])


@router.post("/checkout", response_model=OrderOut)
def checkout(payload: CheckoutIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Giỏ hàng trống")
    product_ids = [item.product_id for item in payload.items]
    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    product_map = {product.id: product for product in products}
    order = Order(
        user_id=user.id,
        customer_name=payload.customer_name,
        phone=payload.phone,
        address=payload.address,
        payment_method=payload.payment_method,
    )
    total = 0.0
    for item in payload.items:
        product = product_map.get(item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Không tìm thấy sản phẩm #{item.product_id}")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"{product.name} không đủ hàng")
        unit_price = product.sale_price or product.price
        total += unit_price * item.quantity
        product.stock -= item.quantity
        order.items.append(OrderItem(product_id=product.id, quantity=item.quantity, unit_price=unit_price))
    order.total_amount = total
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/orders/me", response_model=list[OrderOut])
def my_orders(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.user_id == user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.get("/admin/orders", response_model=list[OrderOut])
def admin_orders(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(Order).options(joinedload(Order.items).joinedload(OrderItem.product)).order_by(Order.created_at.desc()).all()


@router.patch("/admin/orders/{order_id}", response_model=OrderOut)
def update_order_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")
    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order


@router.post("/reviews", response_model=ReviewOut)
def create_review(payload: ReviewCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not db.query(Product).filter(Product.id == payload.product_id).first():
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    review = Review(user_id=user.id, **payload.model_dump())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.get("/products/{product_id}/reviews", response_model=list[ReviewOut])
def product_reviews(product_id: int, db: Session = Depends(get_db)):
    return (
        db.query(Review)
        .options(joinedload(Review.user))
        .filter(Review.product_id == product_id)
        .order_by(Review.created_at.desc())
        .all()
    )


@router.get("/admin/dashboard", response_model=DashboardOut)
def dashboard(db: Session = Depends(get_db), _=Depends(require_admin)):
    return {
        "total_products": db.query(Product).count(),
        "total_orders": db.query(Order).count(),
        "total_customers": db.query(User).filter(User.role == UserRole.customer).count(),
        "total_revenue": db.query(func.coalesce(func.sum(Order.total_amount), 0)).scalar(),
    }

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.api.deps import require_admin, get_current_user
from app.db.session import get_db
from app.models.entities import User
from app.schemas.dto import CheckoutIn, OrderOut, OrderStatusUpdate, CouponBase, CouponOut
from app.models.entities import Product, Coupon, Order, OrderItem, UserCoupon
from datetime import datetime

router = APIRouter(tags=["orders"])

# --- Orders (Customer) ---

@router.post("/checkout", response_model=OrderOut)
def create_order(payload: CheckoutIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Đặt hàng mới (Lưu thông tin từ CheckoutIn vào database)"""
    subtotal = 0
    order_items_to_create = []
    
    for item in payload.items:
        product = db.query(Product).filter(Product.id == item.product_id, Product.is_active == True).first()
        
        if not product:
            raise HTTPException(status_code=404, detail=f"Sản phẩm ID {item.product_id} không tồn tại hoặc đã ngừng bán")
        
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Sản phẩm {product.name} không đủ hàng (Còn lại: {product.stock})")
        
        current_price = product.sale_price if product.sale_price else product.price
        item_total = current_price * item.quantity
        subtotal += item_total
        
        order_items_to_create.append({
            "product_id": product.id,
            "quantity": item.quantity,
            "price_at_purchase": current_price,
            "product_obj": product 
        })

    discount_amount = 0
    coupon_id = None
    now = datetime.now()
    if payload.coupon_code:

        coupon = db.query(Coupon).filter(
            Coupon.code == payload.coupon_code, 
            Coupon.is_active == True,
            Coupon.start_date <= datetime.now(),
            Coupon.end_date >= datetime.now()
        ).first()

        if coupon is None:
            raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail="Mã giảm giá không tồn tại")

        is_started = True if not coupon.start_date else (coupon.start_date <= now)
        is_not_expired = True if not coupon.end_date else (coupon.end_date >= now)

        if not (is_started and is_not_expired):
            raise HTTPException(status_code=400, detail="Mã giảm giá đã hết hạn hoặc chưa đến thời gian sử dụng")
        
        if not coupon or coupon.used_count >= coupon.usage_limit:
            raise HTTPException(status_code=400, detail="Mã giảm giá không hợp lệ hoặc đã hết lượt dùng")
        
        # Kiểm tra xem user có sở hữu mã này không
        user_coupon = db.query(UserCoupon).filter(
            UserCoupon.user_id == current_user.id,
            UserCoupon.coupon_id == coupon.id
        ).first()

        if not user_coupon:
            raise HTTPException(status_code=400, detail="Bạn không sở hữu mã giảm giá này")
            
        if user_coupon.is_used:
            raise HTTPException(status_code=400, detail="Bạn đã sử dụng mã giảm giá này rồi")

        if subtotal < coupon.min_order_value:
            raise HTTPException(status_code=400, detail=f"Đơn hàng chưa đạt giá trị tối thiểu ({coupon.min_order_value}) để dùng mã này")
        
        if coupon.discount_type == 'percent':
            discount_amount = (subtotal * coupon.discount_value) / 100
            if coupon.max_discount_value:
                discount_amount = min(discount_amount, coupon.max_discount_value)
        else:
            discount_amount = coupon.discount_value
            
        coupon_id = coupon.id
        # Đánh dấu đã sử dụng
        user_coupon.is_used = True
        user_coupon.used_at = datetime.now()

    total_amount = max(subtotal - discount_amount, 0)
    
    order_code = f"ORD-{uuid.uuid4().hex[:8].upper()}"

    new_order = Order(
        order_code=order_code,
        user_id=current_user.id,
        coupon_id=coupon_id,
        subtotal=subtotal,
        discount_amount=discount_amount,
        total_amount=total_amount,
        status="pending",
        payment_method=payload.payment_method,
        payment_status="pending",
        recipient_name=payload.recipient_name,
        phone_number=payload.phone_number,
        shipping_address=payload.shipping_address,
        notes=payload.notes
    )
    
    db.add(new_order)
    db.flush() 

    for item_data in order_items_to_create:
        new_item = OrderItem(
            order_id=new_order.id,
            product_id=item_data["product_id"],
            quantity=item_data["quantity"],
            price_at_purchase=item_data["price_at_purchase"]
        )
        db.add(new_item)
        
        item_data["product_obj"].stock -= item_data["quantity"]

    if coupon_id:
        coupon.used_count += 1

    try:
        db.commit()
        db.refresh(new_order)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Lỗi hệ thống khi tạo đơn hàng")

    return new_order

@router.get("/my-orders", response_model=list[OrderOut])
def list_my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Lấy danh sách đơn hàng của người dùng hiện tại"""
    orders = (
        db.query(Order)
        .options(
            joinedload(Order.items) 
            .joinedload(OrderItem.product) 
        )
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc()) 
        .all()
    )

    return orders

@router.get("/my-orders/{order_id}", response_model=OrderOut)
def get_my_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Xem chi tiết một đơn hàng cụ thể của tôi"""
    order = (
        db.query(Order)
        .options(
            joinedload(Order.items)
            .joinedload(OrderItem.product) 
        )
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng này"
        )

    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xem đơn hàng này"
        )

    return order

# --- Orders (Admin) ---

@router.get("/admin/orders", response_model=list[OrderOut])
def admin_list_orders(db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Liệt kê tất cả đơn hàng trong hệ thống"""
    orders = (
        db.query(Order)
        .options(
            joinedload(Order.items)
            .joinedload(OrderItem.product)
        )
        .order_by(Order.created_at.desc()) 
        .all()
    )

    return orders

@router.get("/admin/orders/{order_id}", response_model=OrderOut)
def admin_get_order_detail(order_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Lấy chi tiết một đơn hàng cụ thể"""
    order = (
        db.query(Order)
        .options(
            joinedload(Order.items)
            .joinedload(OrderItem.product)
        )
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng yêu cầu"
        )

    return order

@router.put("/admin/orders/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Cập nhật trạng thái đơn hàng (Đang xử lý, Đang giao, v.v.)"""
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng"
        )

    old_status = order.status
    new_status = payload.status

    if new_status == "cancelled" and old_status != "cancelled":
        for item in order.items:
            if item.product:
                item.product.stock += item.quantity
    
    elif old_status == "cancelled" and new_status != "cancelled":
        for item in order.items:
            if item.product:
                if item.product.stock < item.quantity:
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Không thể khôi phục đơn hàng. Sản phẩm {item.product.name} đã hết hàng."
                    )
                item.product.stock -= item.quantity

    order.status = new_status
    
    if new_status == "delivered":
        order.payment_status = "paid"

    try:
        db.commit()
        db.refresh(order)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Lỗi khi cập nhật trạng thái đơn hàng")

    return order

# --- Coupons (Admin) ---

@router.get("/admin/coupons", response_model=list[CouponOut])
def list_coupons(db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Liệt kê tất cả mã giảm giá"""
    coupons = (
        db.query(Coupon)
        .order_by(Coupon.created_at.desc())
        .all()
    )
    
    return coupons

@router.post("/admin/coupons", response_model=CouponOut)
def create_coupon(payload: CouponBase, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Tạo mã giảm giá mới"""
    coupon_code = payload.code.strip().upper()
    
    existing_coupon = db.query(Coupon).filter(Coupon.code == coupon_code).first()
    if existing_coupon:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Mã giảm giá '{coupon_code}' đã tồn tại trên hệ thống"
        )

    new_coupon = Coupon(
        **payload.model_dump(),
        used_count=0,   
        is_active=True  
    )
    
    new_coupon.code = coupon_code

    try:
        db.add(new_coupon)
        db.commit()
        db.refresh(new_coupon)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi lưu mã giảm giá vào cơ sở dữ liệu"
        )

    return new_coupon

@router.delete("/admin/coupons/{coupon_id}")
def delete_coupon(coupon_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Xoá mã giảm giá"""
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    
    if not coupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy mã giảm giá này"
        )
    
    order_exists = db.query(Order).filter(Order.coupon_id == coupon_id).first()
    
    if order_exists:
        # Cách 1: Báo lỗi không cho xoá
        # raise HTTPException(
        #     status_code=status.HTTP_400_BAD_REQUEST,
        #     detail="Không thể xoá mã này vì đã có đơn hàng sử dụng. Hãy chuyển sang trạng thái ngưng hoạt động (is_active=False)."
        # )
        
        # Cách 2: Tự động ngưng hoạt động thay vì xoá (Soft Delete giả lập)
        coupon.is_active = False
        db.commit()
        return None

    db.delete(coupon)
    db.commit()
    
    return None

@router.get("/admin/users/{user_id}/orders", response_model=list[OrderOut])
def admin_get_user_orders(user_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Lấy lịch sử mua hàng của một khách hàng cụ thể"""
    orders = (
        db.query(Order)
        .options(
            joinedload(Order.items)
            .joinedload(OrderItem.product)
        )
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders

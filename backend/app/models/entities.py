from datetime import datetime, date
from enum import Enum

from sqlalchemy import (
    Boolean, CheckConstraint, Column, Date, DateTime, Enum as SqlEnum, ForeignKey, Index, Integer, JSON,
    Numeric, String, Text, UniqueConstraint, func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from decimal import Decimal
from typing import List

# Tiền lưu DECIMAL(15,2) như schema.sql; Python nhận Decimal, không làm tròn sai như float
Money = Numeric(15, 2)


class UserRole(str, Enum):
    customer = "customer"
    admin = "admin"


class OrderStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"


class DiscountType(str, Enum):
    fixed = "fixed"
    percent = "percent"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    full_name: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    birthday: Mapped[date | None] = mapped_column(Date, nullable=True)
    gender: Mapped[str | None] = mapped_column(String(10), nullable=True)
    role: Mapped[UserRole] = mapped_column(SqlEnum(UserRole), default=UserRole.customer)
    provider: Mapped[str] = mapped_column(String(50), default="local")
    avatar_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    reset_otp = Column(String(64), nullable=True)  # HMAC-SHA256 của OTP, không lưu mã gốc
    otp_expiry = Column(DateTime, nullable=True)
    otp_attempts: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    # Token phát hành trước mốc này bị từ chối (đổi / đặt lại mật khẩu là đăng xuất mọi phiên cũ)
    password_changed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    orders: Mapped[list["Order"]] = relationship(back_populates="user")
    reviews: Mapped[list["Review"]] = relationship(back_populates="user")
    coupons: Mapped[List["UserCoupon"]] = relationship("UserCoupon", back_populates="user")


# class Category(Base):
#     __tablename__ = "categories"

#     id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
#     name: Mapped[str] = mapped_column(String(255))
#     slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
#     description: Mapped[str | None] = mapped_column(Text, nullable=True)
#     image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
#     parent_id: Mapped[int | None] = mapped_column(ForeignKey("categories.id"), nullable=True)

#     products: Mapped[list["Product"]] = relationship(back_populates="category")

class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    parent_id: Mapped[int | None] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    products: Mapped[list["Product"]] = relationship(back_populates="category")
    
class Product(Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("price >= 0", name="chk_products_price"),
        CheckConstraint("sale_price IS NULL OR (sale_price >= 0 AND sale_price <= price)", name="chk_products_sale_price"),
        CheckConstraint("stock >= 0", name="chk_products_stock"),
        Index("idx_products_active_created", "is_active", "created_at"),
        Index("idx_products_category_active", "category_id", "is_active"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id", ondelete="RESTRICT"))
    name: Mapped[str] = mapped_column(String(255), index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    brand: Mapped[str] = mapped_column(String(100), default="Hometic")
    price: Mapped[Decimal] = mapped_column(Money, default=0)
    sale_price: Mapped[Decimal | None] = mapped_column(Money, nullable=True)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    category: Mapped["Category"] = relationship(back_populates="products")
    detail: Mapped["ProductDetail"] = relationship(back_populates="product", uselist=False)
    reviews: Mapped[list["Review"]] = relationship(back_populates="product")
    order_items: Mapped[list["OrderItem"]] = relationship(back_populates="product")


class ProductDetail(Base):
    __tablename__ = "product_details"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    content: Mapped[str | None] = mapped_column(Text, nullable=True) # LONGTEXT in SQL
    specifications: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    gallery_urls: Mapped[list | None] = mapped_column(JSON, nullable=True)
    warranty_info: Mapped[str] = mapped_column(String(255), default="12 tháng")
    origin: Mapped[str] = mapped_column(String(100), default="Việt Nam")

    product: Mapped["Product"] = relationship(back_populates="detail")

class UserCoupon(Base):
    __tablename__ = "user_coupons"
    __table_args__ = (UniqueConstraint("user_id", "coupon_id", name="uq_user_coupon"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    coupon_id: Mapped[int] = mapped_column(Integer, ForeignKey("coupons.id", ondelete="CASCADE"), index=True)
    
    # Trạng thái riêng của từng user đối với mã này
    is_used: Mapped[bool] = mapped_column(Boolean, default=False)
    used_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    assigned_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="coupons")
    coupon: Mapped["Coupon"] = relationship("Coupon", back_populates="users")

class Coupon(Base):
    __tablename__ = "coupons"
    __table_args__ = (
        CheckConstraint("discount_value > 0 AND (discount_type <> 'percent' OR discount_value <= 100)", name="chk_coupons_value"),
        CheckConstraint("used_count >= 0 AND used_count <= usage_limit", name="chk_coupons_usage"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True)
    discount_type: Mapped[DiscountType] = mapped_column(SqlEnum(DiscountType), default=DiscountType.percent)
    discount_value: Mapped[Decimal] = mapped_column(Money)
    min_order_value: Mapped[Decimal] = mapped_column(Money, default=0)
    max_discount_value: Mapped[Decimal | None] = mapped_column(Money, nullable=True)
    start_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    end_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    usage_limit: Mapped[int] = mapped_column(Integer, default=100)
    used_count: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    users: Mapped[List["UserCoupon"]] = relationship("UserCoupon", back_populates="coupon")

class Order(Base):
    __tablename__ = "orders"
    __table_args__ = (
        CheckConstraint("subtotal >= 0 AND discount_amount >= 0 AND total_amount >= 0", name="chk_orders_amounts"),
        Index("idx_orders_user_created", "user_id", "created_at"),
        Index("idx_orders_created", "created_at"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"))
    coupon_id: Mapped[int | None] = mapped_column(ForeignKey("coupons.id", ondelete="SET NULL"), nullable=True)
    subtotal: Mapped[Decimal] = mapped_column(Money)
    discount_amount: Mapped[Decimal] = mapped_column(Money, default=0)
    total_amount: Mapped[Decimal] = mapped_column(Money)
    status: Mapped[OrderStatus] = mapped_column(SqlEnum(OrderStatus), default=OrderStatus.pending)
    payment_method: Mapped[str] = mapped_column(String(50), default="cod")
    payment_status: Mapped[str] = mapped_column(String(20), default="pending")
    recipient_name: Mapped[str] = mapped_column(String(255))
    phone_number: Mapped[str] = mapped_column(String(20))
    shipping_address: Mapped[str] = mapped_column(Text)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    user: Mapped["User"] = relationship(back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"
    __table_args__ = (
        CheckConstraint("quantity > 0", name="chk_order_items_quantity"),
        CheckConstraint("price_at_purchase >= 0", name="chk_order_items_price"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="RESTRICT"))
    product_name: Mapped[str | None] = mapped_column(String(255), nullable=True)  # tên lúc mua
    quantity: Mapped[int] = mapped_column(Integer)
    price_at_purchase: Mapped[Decimal] = mapped_column(Money)

    order: Mapped["Order"] = relationship(back_populates="items")
    product: Mapped["Product"] = relationship(back_populates="order_items")


class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = (
        UniqueConstraint("user_id", "product_id", name="uq_review_user_product"),
        CheckConstraint("rating >= 1 AND rating <= 5", name="reviews_chk_1"),
        Index("idx_reviews_product_created", "product_id", "created_at"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="reviews")
    product: Mapped["Product"] = relationship(back_populates="reviews")

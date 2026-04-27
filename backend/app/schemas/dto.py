from datetime import datetime, date
from pydantic import BaseModel, EmailStr, Field
from app.models.entities import OrderStatus, UserRole, DiscountType

# --- User Schemas ---
class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    birthday: date | None = None
    gender: str | None = None
    avatar_url: str | None = None

class UserCreate(UserBase):
    password: str = Field(min_length=6)

class UserUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    birthday: date | None = None
    gender: str | None = None
    avatar_url: str | None = None

class UserOut(UserBase):
    id: int
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut

class RefreshTokenIn(BaseModel):
    refresh_token: str

# --- Coupon Schemas ---
class CouponBase(BaseModel):
    code: str
    discount_type: DiscountType
    discount_value: float
    min_order_value: float = 0
    max_discount_value: float | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    usage_limit: int = 100

class CouponOut(CouponBase):
    id: int
    used_count: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Category Schemas ---
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: str | None = None
    image_url: str | None = None
    parent_id: int | None = None

class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True

# --- Product Detail Schemas ---
class ProductDetailBase(BaseModel):
    description: str | None = None
    content: str | None = None
    specifications: dict | None = None
    gallery_urls: list[str] | None = None
    warranty_info: str = "12 tháng"
    origin: str = "Việt Nam"

class ProductDetailOut(ProductDetailBase):
    id: int
    
    class Config:
        from_attributes = True

# --- Product Schemas ---
class ProductBase(BaseModel):
    category_id: int
    name: str
    slug: str
    brand: str = "Hometic"
    price: float = Field(ge=0)
    sale_price: float | None = None
    stock: int = Field(ge=0)
    image_url: str | None = None
    is_active: bool = True

class ProductCreate(ProductBase):
    detail: ProductDetailBase | None = None

class ProductUpdate(BaseModel):
    category_id: int | None = None
    name: str | None = None
    slug: str | None = None
    brand: str | None = None
    price: float | None = None
    sale_price: float | None = None
    stock: int | None = None
    image_url: str | None = None
    is_active: bool | None = None
    detail: ProductDetailBase | None = None

class ProductOut(ProductBase):
    id: int
    category: CategoryOut | None = None
    detail: ProductDetailOut | None = None

    class Config:
        from_attributes = True

# --- Order Schemas ---
class CartItemIn(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)

class CheckoutIn(BaseModel):
    coupon_code: str | None = None
    payment_method: str = "cod"
    recipient_name: str
    phone_number: str
    shipping_address: str
    notes: str | None = None
    items: list[CartItemIn]

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_at_purchase: float
    product: ProductOut | None = None

    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    order_code: str
    user_id: int
    subtotal: float
    discount_amount: float
    total_amount: float
    status: OrderStatus
    payment_method: str
    payment_status: str
    recipient_name: str
    phone_number: str
    shipping_address: str
    notes: str | None = None
    created_at: datetime
    items: list[OrderItemOut]

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: OrderStatus

# --- Review Schemas ---
class ReviewCreate(BaseModel):
    product_id: int
    rating: int = Field(ge=1, le=5)
    comment: str | None = None

class ReviewOut(BaseModel):
    id: int
    user_id: int
    product_id: int
    rating: int
    comment: str | None
    created_at: datetime
    user: UserOut | None = None

    class Config:
        from_attributes = True

# --- Admin Stats ---
class DashboardOut(BaseModel):
    total_products: int
    total_orders: int
    total_customers: int
    total_revenue: float
    recent_orders: list[OrderOut]

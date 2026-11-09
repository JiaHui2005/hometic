from datetime import datetime, date
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from app.models.entities import OrderStatus, UserRole, DiscountType

# Cột users.gender là ENUM('Nam','Nữ','Khác'); nhận thêm giá trị tiếng Anh cũ của FE
GENDERS = {"nam": "Nam", "male": "Nam", "nữ": "Nữ", "female": "Nữ", "khác": "Khác", "other": "Khác"}


def normalize_gender(value):
    if value is None or (isinstance(value, str) and not value.strip()):
        return None
    gender = GENDERS.get(str(value).strip().lower())
    if gender is None:
        raise ValueError("Giới tính phải là Nam, Nữ hoặc Khác")
    return gender


def empty_to_none(value):
    """Form gửi "" cho ô bỏ trống; DB cần NULL."""
    return None if isinstance(value, str) and not value.strip() else value


class ProfileFields(BaseModel):
    @field_validator("phone", "birthday", mode="before", check_fields=False)
    @classmethod
    def _blank_is_null(cls, value):
        return empty_to_none(value)

    @field_validator("gender", mode="before", check_fields=False)
    @classmethod
    def _gender(cls, value):
        return normalize_gender(value)


# --- User Schemas ---
class UserBase(BaseModel):
    full_name: str = Field(max_length=255)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=20)
    birthday: date | None = None
    gender: str | None = None
    avatar_url: str | None = None

PASSWORD_MIN = 8


class UserCreate(UserBase, ProfileFields):
    password: str = Field(min_length=PASSWORD_MIN, max_length=128)

class UserUpdate(ProfileFields):
    full_name: str | None = Field(default=None, max_length=255)
    phone: str | None = Field(default=None, max_length=20)
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

class ChangePasswordIn(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=PASSWORD_MIN, max_length=128)

class ForgotPasswordIn(BaseModel):
    email: EmailStr

class ResetPasswordIn(BaseModel):
    email: EmailStr
    token: str = Field(min_length=6, max_length=6)
    new_password: str = Field(..., min_length=PASSWORD_MIN, max_length=128)

# --- Coupon Schemas ---
class CouponBase(BaseModel):
    code: str
    discount_type: DiscountType
    discount_value: float = Field(gt=0)
    min_order_value: float = Field(default=0, ge=0)
    max_discount_value: float | None = Field(default=None, gt=0)
    start_date: datetime | None = None
    end_date: datetime | None = None
    usage_limit: int = Field(default=100, ge=1)

    @model_validator(mode="after")
    def _percent_max_100(self):
        if self.discount_type == DiscountType.percent and self.discount_value > 100:
            raise ValueError("Giảm theo phần trăm tối đa 100")
        return self

class CouponOut(CouponBase):
    id: int
    used_count: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserCouponOut(BaseModel):
    id: int
    user_id: int
    coupon_id: int
    is_used: bool
    used_at: datetime | None = None
    assigned_at: datetime
    coupon: CouponOut | None = None

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
    is_active: bool

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
    name: str = Field(max_length=255)
    slug: str = Field(max_length=255)
    brand: str = Field(default="Hometic", max_length=100)
    price: float = Field(default=0, ge=0)
    sale_price: float | None = Field(default=None, ge=0)
    stock: int = Field(default=0, ge=0)
    image_url: str | None = Field(default=None, max_length=255)
    is_active: bool = True

    @model_validator(mode="after")
    def _sale_not_above_price(self):
        if self.sale_price is not None and self.sale_price > self.price:
            raise ValueError("Giá khuyến mãi không được lớn hơn giá gốc")
        return self

class ProductCreate(ProductBase):
    detail: ProductDetailBase | None = None

class ProductUpdate(BaseModel):
    category_id: int | None = None
    name: str | None = Field(default=None, max_length=255)
    slug: str | None = Field(default=None, max_length=255)
    brand: str | None = Field(default=None, max_length=100)
    price: float | None = Field(default=None, ge=0)
    sale_price: float | None = Field(default=None, ge=0)
    stock: int | None = Field(default=None, ge=0)
    image_url: str | None = Field(default=None, max_length=255)
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
    coupon_code: str | None = Field(default=None, max_length=50)
    payment_method: str = Field(default="cod", max_length=50)
    recipient_name: str = Field(min_length=1, max_length=255)
    phone_number: str = Field(min_length=1, max_length=20)
    shipping_address: str = Field(min_length=1, max_length=1000)
    notes: str | None = Field(default=None, max_length=2000)
    items: list[CartItemIn]

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str | None = None
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

class ReviewerOut(BaseModel):
    """Thông tin công khai của người đánh giá (không lộ email, SĐT, ngày sinh)."""
    full_name: str
    avatar_url: str | None = None

    class Config:
        from_attributes = True

class ReviewOut(BaseModel):
    id: int
    product_id: int
    rating: int
    comment: str | None
    created_at: datetime
    user: ReviewerOut | None = None

    class Config:
        from_attributes = True

# --- Admin Stats ---
class DashboardOut(BaseModel):
    total_products: int
    total_orders: int
    total_customers: int
    total_revenue: float
    recent_orders: list[OrderOut]

# --- Admin Chart Schemas ---
class ChartDataPoint(BaseModel):
    label: str
    value: float

class AdminChartsOut(BaseModel):
    revenue_by_day: list[ChartDataPoint]
    revenue_by_category: list[ChartDataPoint]
    order_status_distribution: list[ChartDataPoint]

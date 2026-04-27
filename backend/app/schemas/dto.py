from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.models.entities import OrderStatus, UserRole


class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: UserRole

    class Config:
        from_attributes = True


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class CategoryBase(BaseModel):
    name: str
    slug: str
    description: str | None = None


class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    category_id: int
    name: str
    slug: str
    description: str
    price: float = Field(gt=0)
    sale_price: float | None = None
    stock: int = Field(ge=0)
    image_url: str | None = None
    smart_features: str | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    category_id: int | None = None
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    price: float | None = Field(default=None, gt=0)
    sale_price: float | None = None
    stock: int | None = Field(default=None, ge=0)
    image_url: str | None = None
    smart_features: str | None = None


class ProductOut(ProductBase):
    id: int
    category: CategoryOut | None = None

    class Config:
        from_attributes = True


class CartItemIn(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)


class CheckoutIn(BaseModel):
    customer_name: str
    phone: str
    address: str
    payment_method: str = "mock"
    items: list[CartItemIn]


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    product: ProductOut | None = None

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    customer_name: str
    phone: str
    address: str
    payment_method: str
    status: OrderStatus
    total_amount: float
    created_at: datetime
    items: list[OrderItemOut] = []

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class ReviewCreate(BaseModel):
    product_id: int
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewOut(BaseModel):
    id: int
    product_id: int
    rating: int
    comment: str | None
    created_at: datetime
    user: UserOut | None = None

    class Config:
        from_attributes = True


class DashboardOut(BaseModel):
    total_products: int
    total_orders: int
    total_customers: int
    total_revenue: float

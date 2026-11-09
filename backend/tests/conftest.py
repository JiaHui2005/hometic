import os

# Settings bắt buộc có SMTP_*; đặt giá trị giả trước khi import app để test chạy được không cần .env
for key in ("SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM"):
    os.environ.setdefault(key, "test@example.com")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.rate_limit import ALL_LIMITERS
from app.core.security import create_access_token, hash_password
from app.db.session import Base, get_db
from app.main import app
from app.models.entities import Category, Coupon, Product, User, UserRole


@pytest.fixture(autouse=True)
def reset_rate_limits():
    for limiter in ALL_LIMITERS:
        limiter.reset()


@pytest.fixture
def db():
    # SQLite trong RAM, tạo mới cho từng test; StaticPool để mọi session dùng chung 1 kết nối
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    # SQLite mặc định tắt khoá ngoại; bật để test được ON DELETE RESTRICT như MySQL
    event.listen(engine, "connect", lambda conn, _: conn.execute("PRAGMA foreign_keys=ON"))
    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine, autoflush=False)()
    yield session
    session.close()
    engine.dispose()


@pytest.fixture
def client(db):
    app.dependency_overrides[get_db] = lambda: db
    # Không dùng "with TestClient" để khỏi chạy startup init_db (cần MySQL thật)
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def seed(db):
    """Cây danh mục 4 cấp, 2 sản phẩm đang bán + 1 đã ẩn, 1 khách, 1 admin, 2 mã giảm giá."""
    cats = [
        Category(id=1, name="Nhà bếp", slug="nha-bep"),
        Category(id=2, name="Nấu nướng", slug="nau-nuong", parent_id=1),
        Category(id=3, name="Nồi", slug="noi", parent_id=2),
        Category(id=4, name="Nồi chiên", slug="noi-chien", parent_id=3),
        Category(id=5, name="Phòng khách", slug="phong-khach"),
    ]
    products = [
        Product(id=1, category_id=4, name="Nồi chiên A", slug="noi-chien-a", price=1_000_000, sale_price=900_000, stock=5),
        Product(id=2, category_id=5, name="Đèn B", slug="den-b", price=500_000, stock=2),
        Product(id=3, category_id=2, name="Bếp cũ", slug="bep-cu", price=300_000, stock=9, is_active=False),
    ]
    users = [
        User(id=1, email="user@test.com", full_name="Khách", password_hash=hash_password("123456")),
        User(id=2, email="admin@test.com", full_name="Admin", password_hash="x", role=UserRole.admin),
    ]
    coupons = [
        Coupon(id=1, code="PCT10", discount_type="percent", discount_value=10, max_discount_value=150_000),
        Coupon(id=2, code="BIG", discount_type="fixed", discount_value=100_000, min_order_value=5_000_000),
    ]
    db.add_all(cats + products + users + coupons)
    db.commit()


def auth(email: str) -> dict:
    return {"Authorization": f"Bearer {create_access_token(email)}"}


@pytest.fixture
def user_headers():
    return auth("user@test.com")


@pytest.fixture
def admin_headers():
    return auth("admin@test.com")

import pytest
from sqlalchemy.exc import IntegrityError

from app.models.entities import Order, OrderItem, Product, Review, UserCoupon
from app.schemas.dto import CouponBase, ProductCreate, UserCreate, UserUpdate
from tests.test_api import checkout


def commit_fails(db, *objs):
    db.add_all(objs)
    with pytest.raises(IntegrityError):
        db.commit()
    db.rollback()


# --- Ràng buộc trong DB ---

def test_user_coupon_unique(db, seed):
    db.add(UserCoupon(user_id=1, coupon_id=1))
    db.commit()
    commit_fails(db, UserCoupon(user_id=1, coupon_id=1))


def test_review_unique_per_user_product(db, seed):
    db.add(Review(user_id=1, product_id=1, rating=5))
    db.commit()
    commit_fails(db, Review(user_id=1, product_id=1, rating=4))


def test_stock_and_sale_price_checks(db, seed):
    commit_fails(db, Product(category_id=1, name="X", slug="x", price=100, stock=-1))
    commit_fails(db, Product(category_id=1, name="Y", slug="y", price=100, sale_price=200))


def test_cannot_delete_product_with_order_history(client, db, seed, user_headers):
    assert checkout(client, user_headers, [{"product_id": 1, "quantity": 1}]).status_code == 200
    db.expire_all()
    db.delete(db.get(Product, 1))
    with pytest.raises(IntegrityError):
        db.commit()
    db.rollback()


def test_order_item_keeps_name_at_purchase(client, db, seed, user_headers):
    res = checkout(client, user_headers, [{"product_id": 1, "quantity": 1}])
    assert res.json()["items"][0]["product_name"] == "Nồi chiên A"
    db.get(Product, 1).name = "Tên mới"
    db.commit()
    db.expire_all()
    assert db.query(OrderItem).one().product_name == "Nồi chiên A"


def test_discount_rounded_to_whole_dong(client, db, seed, user_headers):
    client.post("/api/coupons/claim/PCT10", headers=user_headers)
    db.get(Product, 2).price = 333_335
    db.commit()
    order = checkout(client, user_headers, [{"product_id": 2, "quantity": 1}], coupon_code="PCT10").json()
    assert order["discount_amount"] == round(order["discount_amount"])


# --- Kiểm tra đầu vào (trả 422 thay vì lỗi 500 từ DB) ---

@pytest.mark.parametrize("raw, expected", [("", None), (None, None), ("Other", "Khác"), ("female", "Nữ"), ("Nam", "Nam")])
def test_gender_normalized(raw, expected):
    assert UserUpdate(gender=raw).gender == expected


def test_gender_invalid_rejected():
    with pytest.raises(ValueError):
        UserUpdate(gender="xyz")


def test_register_accepts_blank_optional_fields():
    user = UserCreate(email="a@b.com", password="12345678", full_name="A", phone="", birthday="", gender="")
    assert (user.phone, user.birthday, user.gender) == (None, None, None)


def test_coupon_percent_over_100_rejected():
    with pytest.raises(ValueError):
        CouponBase(code="X", discount_type="percent", discount_value=150)
    with pytest.raises(ValueError):
        CouponBase(code="X", discount_type="fixed", discount_value=0)


def test_product_sale_price_above_price_rejected():
    with pytest.raises(ValueError):
        ProductCreate(category_id=1, name="A", slug="a", price=100, sale_price=120)


def test_register_api_with_blank_gender(client, db):
    res = client.post("/api/auth/register", json={
        "email": "new@test.com", "password": "12345678", "full_name": "Mới", "phone": "", "birthday": "", "gender": ""})
    assert res.status_code == 200, res.text
    assert res.json()["user"]["gender"] is None

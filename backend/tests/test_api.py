from app.models.entities import Coupon, Product, UserCoupon

CHECKOUT = {"recipient_name": "Khách", "phone_number": "0900000000", "shipping_address": "Q1, TP.HCM"}


def checkout(client, headers, items, coupon_code=None):
    return client.post("/api/checkout", headers=headers, json={**CHECKOUT, "items": items, "coupon_code": coupon_code})


def test_health_has_timing_header(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert "X-Process-Time-Ms" in res.headers


# --- Catalog ---

def test_products_hide_inactive_for_guests(client, seed):
    ids = {p["id"] for p in client.get("/api/products").json()}
    assert ids == {1, 2}


def test_products_show_inactive_for_admin(client, seed, admin_headers):
    ids = {p["id"] for p in client.get("/api/products", headers=admin_headers).json()}
    assert ids == {1, 2, 3}


def test_category_products_include_all_descendant_levels(client, seed):
    # Sản phẩm 1 nằm ở cấp 4 (chắt) của "nha-bep"; bản cũ chỉ lấy tới cấp cháu
    res = client.get("/api/products/category/nha-bep")
    assert res.status_code == 200
    assert [p["id"] for p in res.json()] == [1]


def test_category_not_found(client, seed):
    assert client.get("/api/products/category/khong-co").status_code == 404


# --- Auth ---

def test_login_success_and_failure(client, seed):
    ok = client.post("/api/auth/login", json={"email": "user@test.com", "password": "123456"})
    assert ok.status_code == 200 and ok.json()["access_token"]
    bad = client.post("/api/auth/login", json={"email": "user@test.com", "password": "sai-mat-khau"})
    assert bad.status_code == 401


def test_admin_route_rejects_customer(client, seed, user_headers):
    assert client.get("/api/admin/coupons", headers=user_headers).status_code == 403


def test_checkout_requires_login(client, seed):
    assert checkout(client, {}, [{"product_id": 1, "quantity": 1}]).status_code == 401


# --- Checkout ---

def test_checkout_uses_sale_price_and_decrements_stock(client, db, seed, user_headers):
    res = checkout(client, user_headers, [{"product_id": 1, "quantity": 2}, {"product_id": 2, "quantity": 1}])
    assert res.status_code == 200, res.text
    order = res.json()
    assert order["subtotal"] == 2 * 900_000 + 500_000
    assert order["total_amount"] == order["subtotal"]
    db.expire_all()
    assert db.get(Product, 1).stock == 3
    assert db.get(Product, 2).stock == 1


def test_checkout_merges_duplicate_lines_before_stock_check(client, db, seed, user_headers):
    # 3 + 3 = 6 > tồn kho 5: từng dòng riêng lẻ thì hợp lệ, gộp lại thì không
    res = checkout(client, user_headers, [{"product_id": 1, "quantity": 3}, {"product_id": 1, "quantity": 3}])
    assert res.status_code == 400
    db.expire_all()
    assert db.get(Product, 1).stock == 5


def test_checkout_rejects_inactive_or_missing_product(client, seed, user_headers):
    assert checkout(client, user_headers, [{"product_id": 3, "quantity": 1}]).status_code == 404
    assert checkout(client, user_headers, [{"product_id": 999, "quantity": 1}]).status_code == 404


def test_checkout_rejects_empty_cart(client, seed, user_headers):
    assert checkout(client, user_headers, []).status_code == 400


# --- Coupons ---

def test_claim_then_checkout_with_coupon(client, db, seed, user_headers):
    assert client.get("/api/coupons/check/PCT10", headers=user_headers).status_code == 403
    assert client.post("/api/coupons/claim/PCT10", headers=user_headers).status_code == 200
    assert client.post("/api/coupons/claim/PCT10", headers=user_headers).status_code == 400

    res = checkout(client, user_headers, [{"product_id": 1, "quantity": 2}], coupon_code="PCT10")
    assert res.status_code == 200, res.text
    order = res.json()
    assert order["discount_amount"] == 150_000  # 10% của 1.800.000 = 180.000, chặn ở mức tối đa
    assert order["total_amount"] == 1_650_000

    db.expire_all()
    assert db.get(Coupon, 1).used_count == 1
    assert db.query(UserCoupon).filter_by(user_id=1, coupon_id=1).one().is_used

    again = checkout(client, user_headers, [{"product_id": 2, "quantity": 1}], coupon_code="PCT10")
    assert again.status_code == 400


def test_coupon_min_order_value(client, seed, user_headers):
    client.post("/api/coupons/claim/BIG", headers=user_headers)
    res = checkout(client, user_headers, [{"product_id": 2, "quantity": 1}], coupon_code="BIG")
    assert res.status_code == 400


def test_unowned_coupon_rejected_at_checkout(client, seed, user_headers):
    res = checkout(client, user_headers, [{"product_id": 1, "quantity": 1}], coupon_code="PCT10")
    assert res.status_code == 400

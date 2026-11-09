from datetime import datetime, timedelta
from types import SimpleNamespace as NS

from app.utils.commerce import coupon_in_window, compute_discount, descendant_ids, merge_cart_lines, unit_price

NOW = datetime(2026, 11, 9, 12, 0)


def test_merge_cart_lines_sums_duplicates():
    items = [NS(product_id=1, quantity=2), NS(product_id=2, quantity=1), NS(product_id=1, quantity=3)]
    assert merge_cart_lines(items) == {1: 5, 2: 1}


def test_merge_cart_lines_empty():
    assert merge_cart_lines([]) == {}


def test_unit_price_prefers_sale_price():
    assert unit_price(NS(price=100, sale_price=80)) == 80
    assert unit_price(NS(price=100, sale_price=None)) == 100


def test_coupon_window_open_ended():
    assert coupon_in_window(NS(start_date=None, end_date=None), NOW)


def test_coupon_window_bounds():
    day = timedelta(days=1)
    assert coupon_in_window(NS(start_date=NOW - day, end_date=NOW + day), NOW)
    assert not coupon_in_window(NS(start_date=NOW + day, end_date=None), NOW)
    assert not coupon_in_window(NS(start_date=None, end_date=NOW - day), NOW)


def test_percent_discount_capped_by_max():
    coupon = NS(discount_type="percent", discount_value=10, max_discount_value=50_000)
    assert compute_discount(coupon, 300_000) == 30_000
    assert compute_discount(coupon, 1_000_000) == 50_000


def test_percent_discount_without_cap():
    coupon = NS(discount_type="percent", discount_value=20, max_discount_value=None)
    assert compute_discount(coupon, 1_000_000) == 200_000


def test_fixed_discount_never_exceeds_subtotal():
    coupon = NS(discount_type="fixed", discount_value=100_000, max_discount_value=None)
    assert compute_discount(coupon, 250_000) == 100_000
    assert compute_discount(coupon, 60_000) == 60_000


def test_descendant_ids_any_depth():
    edges = [(1, None), (2, 1), (3, 2), (4, 3), (5, None), (6, 1)]
    assert sorted(descendant_ids(edges, 1)) == [1, 2, 3, 4, 6]
    assert descendant_ids(edges, 5) == [5]


def test_descendant_ids_survives_cycle():
    assert sorted(descendant_ids([(1, 2), (2, 1)], 1)) == [1, 2]

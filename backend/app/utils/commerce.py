"""Các phép tính nghiệp vụ thuần (không chạm DB) để tái dùng ở router và dễ unit test."""
from collections import defaultdict, deque
from datetime import datetime
from typing import Iterable


def merge_cart_lines(items: Iterable) -> dict[int, int]:
    """Gộp các dòng trùng sản phẩm bằng hash map: O(n).
    Nếu không gộp, 2 dòng cùng sản phẩm sẽ qua mặt bước kiểm tra tồn kho từng dòng."""
    merged: dict[int, int] = defaultdict(int)
    for item in items:
        merged[item.product_id] += item.quantity
    return dict(merged)


def unit_price(product) -> float:
    return product.sale_price if product.sale_price else product.price


def coupon_in_window(coupon, now: datetime) -> bool:
    """start_date / end_date để trống nghĩa là không giới hạn phía đó."""
    started = coupon.start_date is None or coupon.start_date <= now
    not_expired = coupon.end_date is None or coupon.end_date >= now
    return started and not_expired


def compute_discount(coupon, subtotal):
    """Số tiền giảm, làm tròn tới đồng (VND không có số lẻ) và không bao giờ vượt quá giá trị đơn."""
    if coupon.discount_type == "percent":
        discount = subtotal * coupon.discount_value / 100
        if coupon.max_discount_value:
            discount = min(discount, coupon.max_discount_value)
    else:
        discount = coupon.discount_value
    return min(round(discount), subtotal)


def descendant_ids(edges: Iterable[tuple[int, int | None]], root_id: int) -> list[int]:
    """BFS trên cây danh mục (danh sách kề từ các cặp (id, parent_id)): O(V + E), mọi độ sâu.
    Có tập visited nên dữ liệu lỗi tạo vòng cha-con cũng không lặp vô hạn."""
    children: dict[int | None, list[int]] = defaultdict(list)
    for cid, parent_id in edges:
        children[parent_id].append(cid)

    result, visited, queue = [], {root_id}, deque([root_id])
    while queue:
        current = queue.popleft()
        result.append(current)
        for child in children[current]:
            if child not in visited:
                visited.add(child)
                queue.append(child)
    return result

// Tính mã giảm giá theo đúng công thức backend (api/orders.py → create_order) để số hiển thị khớp số bị trừ;
// riêng mã giảm cố định không hiển thị vượt quá tạm tính.
import { formatVnd } from "./format.js";

export function couponDiscount(coupon, subtotal) {
  if (!coupon || subtotal < (coupon.min_order_value || 0)) return 0;
  if (coupon.discount_type === "percent") {
    const raw = (subtotal * coupon.discount_value) / 100;
    return coupon.max_discount_value ? Math.min(raw, coupon.max_discount_value) : raw;
  }
  return Math.min(coupon.discount_value, subtotal);
}

// Lý do chưa dùng được cho đơn hiện tại (null = dùng được)
export function couponProblem(coupon, subtotal) {
  if (!coupon) return null;
  const min = coupon.min_order_value || 0;
  if (subtotal < min) return `Cần mua thêm ${formatVnd(min - subtotal)} để dùng mã ${coupon.code}`;
  return null;
}

// "Giảm 10%, tối đa 200.000 ₫, cho đơn từ 500.000 ₫"
export function describeCoupon(coupon) {
  const parts = [
    coupon.discount_type === "percent" ? `Giảm ${coupon.discount_value}%` : `Giảm ${formatVnd(coupon.discount_value)}`,
  ];
  if (coupon.discount_type === "percent" && coupon.max_discount_value) parts.push(`tối đa ${formatVnd(coupon.max_discount_value)}`);
  if (coupon.min_order_value) parts.push(`cho đơn từ ${formatVnd(coupon.min_order_value)}`);
  return parts.join(", ");
}

export function couponExpiry(coupon) {
  if (!coupon.end_date) return "Không giới hạn thời gian";
  return `Hạn dùng đến ${new Date(coupon.end_date).toLocaleDateString("vi-VN")}`;
}

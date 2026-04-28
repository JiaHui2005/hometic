import React, { useState, useEffect } from "react";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, X, CheckCircle } from "lucide-react";
import { formatVnd } from "../constants";
import { orderService } from "../services/api";

export default function Cart({ cart, user, updateQuantity, removeFromCart, setActiveTab, clearCart }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [shippingInfo, setShippingInfo] = useState({
    recipient_name: "",
    phone_number: "",
    shipping_address: "",
    notes: "Giao hàng giờ hành chính"
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (user && showCheckoutModal) {
      setShippingInfo({
        recipient_name: user.full_name || "",
        phone_number: user.phone || "",
        shipping_address: user.address || "",
        notes: "Giao hàng giờ hành chính"
      });
    }
  }, [user, showCheckoutModal]);

  // Tính tạm tính dựa trên sale_price hoặc price
  const subtotal = cart.reduce((sum, item) => {
    const activePrice = item.sale_price || item.price;
    return sum + activePrice * (item.quantity || 1);
  }, 0);

  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    if (promo.toUpperCase() === "HOMETIC10") {
      setDiscount(subtotal * 0.1);
      setAppliedCoupon("HOMETIC10");
      alert("Áp dụng mã giảm giá 10% thành công! ✨");
    } else {
      alert("Mã giảm giá không hợp lệ.");
    }
  };

  const confirmOrder = async () => {
    if (!shippingInfo.shipping_address || !shippingInfo.phone_number) {
      alert("Vui lòng cung cấp đầy đủ thông tin giao hàng.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity || 1 })),
        coupon_code: appliedCoupon,
        payment_method: "cod",
        ...shippingInfo
      };
      await orderService.checkout(payload);
      alert("Đặt hàng thành công! Hometic sẽ sớm liên hệ với bạn.");
      clearCart();
      setShowCheckoutModal(false);
      setActiveTab("shop");
    } catch (err) {
      alert(err.message || "Lỗi khi đặt hàng.");
    } finally {
      setLoading(false);
    }
  };

  const brand = {
    primary: "#234a4a",
    secondary: "#ed7f1a",
    bg: "#f9f5ed",
    white: "#ffffff",
    border: "#dcd7cc",
    text: "#1a1a1a",
    muted: "#71717a"
  };

  const styles = {
    container: { padding: isMobile ? "20px" : "60px 5%", backgroundColor: brand.bg, minHeight: "100vh", fontFamily: '"Inter", sans-serif' },
    wrapper: { maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", gap: "30px", alignItems: "flex-start" },
    cartSection: { flex: 1.8, backgroundColor: brand.white, padding: isMobile ? "20px" : "35px", borderRadius: "30px", boxShadow: "0 10px 40px rgba(35, 74, 74, 0.04)", border: `1px solid ${brand.border}` },
    summarySection: { flex: 1, backgroundColor: brand.white, padding: "30px", borderRadius: "30px", border: `1px solid ${brand.border}`, position: isMobile ? "static" : "sticky", top: "100px", boxShadow: "0 10px 40px rgba(35, 74, 74, 0.04)" },
    itemRow: { display: "flex", gap: "20px", padding: "20px 0", borderBottom: `1px solid #f2f0eb`, alignItems: "center" },
    qtyContainer: { display: "flex", alignItems: "center", gap: "12px", border: `1px solid ${brand.border}`, padding: "6px 12px", borderRadius: "14px" },
    qtyBtn: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: brand.primary, padding: "4px" },
    input: { width: "100%", padding: "14px", borderRadius: "12px", border: `1px solid ${brand.border}`, outline: "none", fontSize: "15px", marginTop: "8px" }
  };

  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <ShoppingBag size={80} color={brand.border} strokeWidth={1} />
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: brand.primary, marginTop: "24px" }}>Giỏ hàng trống</h2>
          <button onClick={() => setActiveTab("shop")} style={{ marginTop: "20px", padding: "16px 40px", backgroundColor: brand.primary, color: "white", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}>TIẾP TỤC MUA SẮM</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* LEFT: CART ITEMS */}
        <div style={styles.cartSection}>
          <h1 style={{ fontSize: "26px", fontWeight: "900", color: brand.primary, marginBottom: "30px", marginTop: 0 }}>Giỏ hàng của bạn</h1>
          {cart.map((item) => (
            <div key={item.id} style={styles.itemRow}>
              <img src={item.image_url || item.image} alt={item.name} style={{ width: "90px", height: "90px", borderRadius: "18px", objectFit: "cover", backgroundColor: "#f8f8f8" }} />

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px", color: brand.primary }}>{item.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span style={{ fontSize: "18px", fontWeight: "800", color: brand.secondary }}>
                    {formatVnd(item.sale_price || item.price)}
                  </span>
                  {item.sale_price && (
                    <span style={{ fontSize: "12px", color: brand.muted, textDecoration: "line-through" }}>
                      {formatVnd(item.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* BỘ ĐIỀU CHỈNH SỐ LƯỢNG - ĐÃ SỬA LẠI */}
              <div style={styles.qtyContainer}>
                <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)}>
                  <Minus size={18} />
                </button>
                <span style={{ fontWeight: "800", fontSize: "16px", minWidth: "20px", textAlign: "center", color: brand.primary }}>
                  {item.quantity || 1}
                </span>
                <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)}>
                  <Plus size={18} />
                </button>
              </div>

              <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer", padding: "8px" }}>
                <Trash2 size={22} />
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT: SUMMARY */}
        <div style={styles.summarySection}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: brand.primary, marginBottom: "25px", marginTop: 0 }}>Tổng đơn hàng</h2>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", color: brand.muted }}>
            <span>Tạm tính</span>
            <span style={{ fontWeight: "600", color: brand.text }}>{formatVnd(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", color: brand.muted }}>
            <span>Phí vận chuyển</span>
            <span style={{ color: "#27ae60", fontWeight: "700" }}>Miễn phí</span>
          </div>

          <div style={{ display: "flex", marginBottom: "25px" }}>
            <input style={{ flex: 1, padding: "12px", border: `1px solid ${brand.border}`, borderRadius: "12px 0 0 12px", outline: "none" }} placeholder="Mã giảm giá" value={promo} onChange={(e) => setPromo(e.target.value)} />
            <button onClick={handleApplyCoupon} style={{ backgroundColor: brand.primary, color: "#fff", border: "none", padding: "0 20px", cursor: "pointer", borderRadius: "0 12px 12px 0", fontWeight: "700" }}>Áp dụng</button>
          </div>

          <div style={{ borderTop: `1px solid ${brand.border}`, paddingTop: "20px", marginBottom: "30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "800", color: brand.primary, fontSize: "18px" }}>Tổng cộng</span>
              <div style={{ textAlign: "right" }}>
                {discount > 0 && <div style={{ fontSize: "14px", color: "#e74c3c", fontWeight: "700" }}>-{formatVnd(discount)}</div>}
                <div style={{ fontSize: "28px", fontWeight: "900", color: brand.secondary }}>{formatVnd(total)}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (!user) { alert("Vui lòng đăng nhập để thanh toán."); setActiveTab("auth"); return; }
              setShowCheckoutModal(true);
            }}
            style={{ width: "100%", padding: "20px", backgroundColor: brand.primary, color: "white", border: "none", borderRadius: "18px", fontWeight: "800", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
          >
            THANH TOÁN NGAY <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {showCheckoutModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(35, 74, 74, 0.6)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000, padding: "20px" }}>
          <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "35px", width: "100%", maxWidth: "550px", position: "relative" }}>
            <button onClick={() => setShowCheckoutModal(false)} style={{ position: "absolute", top: "25px", right: "25px", border: "none", background: "none", cursor: "pointer", color: brand.muted }}><X size={24} /></button>

            <h2 style={{ fontSize: "24px", fontWeight: "900", color: brand.primary, marginBottom: "30px", display: "flex", alignItems: "center", gap: "12px" }}>
              <CheckCircle size={28} color={brand.secondary} /> Xác nhận đặt hàng
            </h2>

            <div style={{ display: "grid", gap: "20px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "800", color: brand.primary, textTransform: "uppercase" }}>Người nhận hàng</label>
                <input style={styles.input} value={shippingInfo.recipient_name} onChange={e => setShippingInfo({ ...shippingInfo, recipient_name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "800", color: brand.primary, textTransform: "uppercase" }}>Số điện thoại</label>
                <input style={styles.input} value={shippingInfo.phone_number} onChange={e => setShippingInfo({ ...shippingInfo, phone_number: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "800", color: brand.primary, textTransform: "uppercase" }}>Địa chỉ giao hàng</label>
                <textarea style={{ ...styles.input, height: "100px", resize: "none" }} value={shippingInfo.shipping_address} onChange={e => setShippingInfo({ ...shippingInfo, shipping_address: e.target.value })} />
              </div>
            </div>

            <div style={{ backgroundColor: brand.bg, padding: "20px", borderRadius: "20px", marginTop: "30px", marginBottom: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "700", color: brand.primary }}>Tổng thanh toán:</span>
                <span style={{ fontWeight: "900", color: brand.secondary, fontSize: "22px" }}>{formatVnd(total)}</span>
              </div>
            </div>

            <button disabled={loading} onClick={confirmOrder} style={{ width: "100%", padding: "20px", backgroundColor: brand.secondary, color: "white", border: "none", borderRadius: "18px", fontWeight: "800", fontSize: "16px", cursor: "pointer" }}>
              {loading ? "ĐANG XỬ LÝ..." : "HOÀN TẤT ĐẶT HÀNG"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
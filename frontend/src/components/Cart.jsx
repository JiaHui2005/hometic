import React, { useState, useEffect } from "react";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, MapPin, Phone, User as UserIcon, X, CheckCircle } from "lucide-react";
import { formatVnd } from "../constants";
import { orderService } from "../services/api";

export default function Cart({ cart, user, updateQuantity, removeFromCart, setActiveTab, clearCart }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // State cho thông tin giao hàng trong Modal
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

  // Tự động điền thông tin từ user khi mở Modal
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

  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    if (promo.toUpperCase() === "HOMETIC10") {
      setDiscount(subtotal * 0.1);
      setAppliedCoupon("HOMETIC10");
      alert("Áp dụng mã giảm giá 10% thành công!");
    } else if (promo.toUpperCase() === "WELCOME50") {
      setDiscount(50000);
      setAppliedCoupon("WELCOME50");
      alert("Áp dụng mã giảm giá 50.000đ thành công!");
    } else {
      alert("Mã giảm giá không hợp lệ.");
    }
  };

  const confirmOrder = async () => {
    if (!shippingInfo.shipping_address || !shippingInfo.phone_number) {
      alert("Vui lòng cung cấp đầy đủ địa chỉ và số điện thoại giao hàng.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity || 1
        })),
        coupon_code: appliedCoupon,
        payment_method: "cod",
        ...shippingInfo
      };

      await orderService.checkout(payload);
      alert("Đặt hàng thành công! Chúc quý khách tiếp tục mua sắm vui vẻ tại Hometic.");
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
    muted: "#666"
  };

  const styles = {
    container: { padding: isMobile ? "20px" : "60px 40px", backgroundColor: brand.bg, minHeight: "100vh", fontFamily: '"Inter", sans-serif' },
    wrapper: { maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", gap: "40px" },
    cartSection: { flex: isMobile ? "none" : "1.8", backgroundColor: brand.white, padding: isMobile ? "20px" : "30px", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: `1px solid ${brand.border}` },
    summarySection: { flex: isMobile ? "none" : "1", backgroundColor: brand.white, padding: "30px", borderRadius: "24px", height: "fit-content", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: `1px solid ${brand.border}`, position: isMobile ? "static" : "sticky", top: "100px" },
    item: { display: "flex", gap: "20px", padding: "25px 0", borderBottom: `1px solid #f0ede8`, alignItems: "center" },
    qtyBtn: { width: "32px", height: "32px", borderRadius: "8px", border: `2px solid ${brand.primary}`, backgroundColor: brand.white, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", color: brand.primary, transition: "0.2s", padding: 0, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
    // Styles Modal
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000, padding: "20px" },
    modalContent: { backgroundColor: "white", padding: "40px", borderRadius: "30px", width: "100%", maxWidth: "550px", position: "relative", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" },
    input: { width: "100%", padding: "14px", borderRadius: "12px", border: `1px solid ${brand.border}`, outline: "none", fontSize: "15px", marginTop: "5px", boxSizing: "border-box" }
  };

  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <ShoppingBag size={80} color={brand.border} strokeWidth={1} />
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: brand.primary, marginTop: "20px" }}>Giỏ hàng trống</h2>
          <button onClick={() => setActiveTab("shop")} style={{ marginTop: "20px", padding: "16px 40px", backgroundColor: brand.secondary, color: "white", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}>MUA SẮM NGAY</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* PHẦN GIỎ HÀNG BÊN TRÁI */}
        <div style={styles.cartSection}>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: brand.primary, marginBottom: "30px" }}>Giỏ hàng của bạn</h1>
          {cart.map((item) => (
            <div key={item.id} style={styles.item}>
              <img src={item.image_url || item.image} alt={item.name} style={{ width: "100px", height: "100px", borderRadius: "15px", objectFit: "cover", backgroundColor: "#f8f8f8" }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px", color: brand.primary }}>{item.name}</h3>
                <div style={{ fontSize: "18px", fontWeight: "800", color: brand.secondary }}>{formatVnd(item.price)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)}><Minus size={16} /></button>
                <span style={{ fontWeight: "700", width: "20px", textAlign: "center" }}>{item.quantity || 1}</span>
                <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer", padding: "10px" }}><Trash2 size={20} /></button>
            </div>
          ))}
        </div>

        {/* PHẦN TỔNG KẾT BÊN PHẢI */}
        <div style={styles.summarySection}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: brand.primary, marginBottom: "25px" }}>Tổng đơn hàng</h2>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: brand.muted }}><span>Tạm tính</span><span>{formatVnd(subtotal)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", color: brand.muted }}><span>Phí vận chuyển</span><span style={{ color: "#27ae60", fontWeight: "700" }}>Miễn phí</span></div>

          <div style={{ display: "flex", margin: "25px 0" }}>
            <input style={{ flex: 1, padding: "12px", border: `1px solid ${brand.border}`, borderRadius: "10px 0 0 10px", outline: "none" }} placeholder="Mã giảm giá" value={promo} onChange={(e) => setPromo(e.target.value)} />
            <button onClick={handleApplyCoupon} style={{ backgroundColor: brand.primary, color: "#fff", border: "none", padding: "0 20px", cursor: "pointer", borderRadius: "0 10px 10px 0" }}>Áp dụng</button>
          </div>

          <div style={{ borderTop: `1px solid ${brand.border}`, paddingTop: "20px", marginBottom: "30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <span style={{ fontWeight: "700", color: brand.primary }}>Tổng cộng</span>
              <div style={{ textAlign: "right" }}>
                {discount > 0 && <div style={{ fontSize: "14px", color: "#e74c3c", fontWeight: "700" }}>-{formatVnd(discount)}</div>}
                <div style={{ fontSize: "24px", fontWeight: "900", color: brand.secondary }}>{formatVnd(total)}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (!user) { alert("Vui lòng đăng nhập để thanh toán."); setActiveTab("auth"); return; }
              setShowCheckoutModal(true);
            }}
            style={{ width: "100%", padding: "18px", backgroundColor: brand.primary, color: "white", border: "none", borderRadius: "15px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
          >
            THANH TOÁN NGAY <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* MODAL XÁC NHẬN THÔNG TIN GIAO HÀNG */}
      {showCheckoutModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button onClick={() => setShowCheckoutModal(false)} style={{ position: "absolute", top: "25px", right: "25px", border: "none", background: "none", cursor: "pointer", color: brand.muted }}><X size={24} /></button>

            <h2 style={{ fontSize: "24px", fontWeight: "900", color: brand.primary, marginBottom: "30px", display: "flex", alignItems: "center", gap: "12px" }}>
              <CheckCircle size={28} color={brand.secondary} /> Xác nhận đặt hàng
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: brand.muted, textTransform: "uppercase" }}>Người nhận hàng</label>
              <input style={styles.input} value={shippingInfo.recipient_name} onChange={e => setShippingInfo({ ...shippingInfo, recipient_name: e.target.value })} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: brand.muted, textTransform: "uppercase" }}>Số điện thoại</label>
              <input style={styles.input} value={shippingInfo.phone_number} onChange={e => setShippingInfo({ ...shippingInfo, phone_number: e.target.value })} />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: brand.muted, textTransform: "uppercase" }}>Địa chỉ giao hàng</label>
              <textarea style={{ ...styles.input, height: "100px", resize: "none" }} value={shippingInfo.shipping_address} onChange={e => setShippingInfo({ ...shippingInfo, shipping_address: e.target.value })} />
            </div>

            <div style={{ backgroundColor: brand.bg, padding: "20px", borderRadius: "20px", marginBottom: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ color: brand.muted }}>Tổng thanh toán:</span>
                <span style={{ fontWeight: "900", color: brand.secondary, fontSize: "20px" }}>{formatVnd(total)}</span>
              </div>
              <div style={{ fontSize: "12px", color: brand.muted }}>Hình thức: Thanh toán khi nhận hàng (COD)</div>
            </div>

            <button
              disabled={loading}
              onClick={confirmOrder}
              style={{ width: "100%", padding: "18px", backgroundColor: brand.secondary, color: "white", border: "none", borderRadius: "15px", fontWeight: "800", cursor: "pointer", fontSize: "16px" }}
            >
              {loading ? "ĐANG XỬ LÝ..." : "HOÀN TẤT ĐẶT HÀNG"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
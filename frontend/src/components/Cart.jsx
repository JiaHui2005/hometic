import React, { useState, useEffect } from "react";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { formatVnd } from "../constants";

export default function Cart({ cart, updateQuantity, removeFromCart, setActiveTab }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleApplyCoupon = () => {
    // Demo coupon logic
    if (promo.toUpperCase() === "HOMETIC10") {
      const amt = subtotal * 0.1;
      setDiscount(amt);
      setAppliedCoupon("HOMETIC10 (-10%)");
      alert("Áp dụng mã giảm giá 10% thành công!");
    } else if (promo.toUpperCase() === "WELCOME50") {
      setDiscount(50000);
      setAppliedCoupon("WELCOME50 (-50.000đ)");
      alert("Áp dụng mã giảm giá 50.000đ thành công!");
    } else {
      alert("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
    }
  };

  const total = subtotal - discount;

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
    container: {
      padding: isMobile ? "20px" : "60px 40px",
      backgroundColor: brand.bg,
      minHeight: "100vh",
      fontFamily: '"Inter", sans-serif'
    },
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: "40px"
    },
    cartSection: {
      flex: isMobile ? "none" : "1.8",
      backgroundColor: brand.white,
      padding: isMobile ? "20px" : "30px",
      borderRadius: "24px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
      border: `1px solid ${brand.border}`
    },
    summarySection: {
      flex: isMobile ? "none" : "1",
      backgroundColor: brand.white,
      padding: "30px",
      borderRadius: "24px",
      height: "fit-content",
      boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
      border: `1px solid ${brand.border}`,
      position: isMobile ? "static" : "sticky",
      top: "100px"
    },
    item: {
      display: "flex",
      gap: "20px",
      padding: "25px 0",
      borderBottom: `1px solid #f0ede8`,
      alignItems: "center"
    },
    qtyBtn: {
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      border: `2px solid ${brand.primary}`, // Make border thicker and use primary color
      backgroundColor: brand.white,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      color: brand.primary,
      transition: "0.2s",
      padding: 0,
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
    },
    emptyState: {
      textAlign: "center",
      padding: "100px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px"
    }
  };

  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <ShoppingBag size={80} color={brand.border} strokeWidth={1} />
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: brand.primary }}>Giỏ hàng trống</h2>
          <p style={{ color: brand.muted }}>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
          <button
            onClick={() => setActiveTab("shop")}
            style={{
              padding: "16px 40px",
              backgroundColor: brand.secondary,
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            MUA SẮM NGAY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.cartSection}>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: brand.primary, marginBottom: "30px" }}>Giỏ hàng của bạn</h1>

          {cart.map((item) => (
            <div key={item.id} style={styles.item}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "100px", height: "100px", borderRadius: "15px", objectFit: "cover", backgroundColor: "#f8f8f8" }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: "16px", 
                  fontWeight: "700", 
                  marginBottom: "8px", 
                  color: brand.primary,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: "1.2"
                }}>
                  {item.name}
                </h3>
                <div style={{ fontSize: "18px", fontWeight: "800", color: brand.secondary }}>{formatVnd(item.price)}</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)}><Minus size={16} /></button>
                <span style={{ fontWeight: "700", width: "20px", textAlign: "center" }}>{item.quantity || 1}</span>
                <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
              </div>

              {!isMobile && (
                <div style={{ width: "120px", textAlign: "right", fontWeight: "800", color: brand.primary }}>
                  {formatVnd(item.price * (item.quantity || 1))}
                </div>
              )}

              <button
                onClick={() => removeFromCart(item.id)}
                style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer", padding: "10px" }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div style={styles.summarySection}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: brand.primary, marginBottom: "25px" }}>Tổng đơn hàng</h2>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: brand.muted }}>
            <span>Tạm tính</span>
            <span>{formatVnd(subtotal)}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", color: brand.muted }}>
            <span>Phí vận chuyển</span>
            <span style={{ color: "#27ae60", fontWeight: "700" }}>Miễn phí</span>
          </div>

          <div style={{ display: "flex", margin: "25px 0" }}>
            <input
              style={{
                flex: 1, padding: "12px", border: `1px solid ${brand.border}`,
                borderRadius: "10px 0 0 10px", outline: "none", fontSize: "14px"
              }}
              placeholder="Nhập mã giảm giá"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <button
              onClick={handleApplyCoupon}
              style={{
                backgroundColor: brand.primary, color: "#fff", border: "none",
                padding: "0 20px", cursor: "pointer", fontWeight: "600",
                borderRadius: "0 10px 10px 0"
              }}
            >
              Áp dụng
            </button>
          </div>

          <div style={{ borderTop: `1px solid ${brand.border}`, paddingTop: "20px", marginBottom: "30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <span style={{ fontWeight: "700", color: brand.primary }}>Tổng cộng</span>
              <div style={{ textAlign: "right" }}>
                {discount > 0 && (
                  <div style={{ fontSize: "14px", color: "#e74c3c", fontWeight: "700", marginBottom: "5px" }}>
                    Giảm giá: -{formatVnd(discount)}
                  </div>
                )}
                <div style={{ fontSize: "24px", fontWeight: "900", color: brand.secondary }}>{formatVnd(total)}</div>
                <div style={{ fontSize: "12px", color: brand.muted }}>(Đã bao gồm VAT)</div>
              </div>
            </div>
          </div>

          <button style={{
            width: "100%",
            padding: "18px",
            backgroundColor: brand.primary,
            color: "white",
            border: "none",
            borderRadius: "15px",
            fontWeight: "800",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "15px"
          }}>
            THANH TOÁN NGAY <ArrowRight size={20} />
          </button>

          <button
            onClick={() => setActiveTab("shop")}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: "transparent",
              color: brand.primary,
              border: `2px solid ${brand.primary}`,
              borderRadius: "15px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
}
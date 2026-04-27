import React, { useState } from "react";

const mockCart = [
  {
    id: 1,
    name: "Hometic Hộp đựng thực phẩm",
    price: 166000,
    quantity: 1,
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Hometic Hộp nhựa",
    price: 166000,
    quantity: 1,
    image_url: "https://images.unsplash.com/photo-1590422443831-768569888998?q=80&w=300&auto=format&fit=crop"
  }
];

export default function Cart() {
  const [cart, setCart] = useState(mockCart);
  const [promo, setPromo] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const brand = {
    bg: "#f9f5ed",
    panel: "#ebebeb",
    orange: "#da8f48",
    border: "#d1cec7",
    text: "#1a1a1a",
    muted: "#666"
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const styles = {
    container: {
      backgroundColor: brand.bg,
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      padding: "60px 20px",
      fontFamily: "sans-serif"
    },
    wrapper: {
      width: "100%",
      maxWidth: "1100px",
      display: "flex",
      gap: "50px"
    },
    cartSection: { flex: 2 },
    summarySection: {
      flex: 1,
      backgroundColor: brand.panel,
      padding: "35px",
      borderRadius: "4px",
      height: "fit-content"
    },
    title: { fontSize: "32px", margin: "0 0 5px 0" },
    itemCount: { color: brand.muted, marginBottom: "30px", borderBottom: `1px solid ${brand.border}`, paddingBottom: "15px" },
    productRow: {
      display: "flex",
      gap: "25px",
      paddingBottom: "30px",
      marginBottom: "30px",
      borderBottom: `1px solid ${brand.border}`
    },
    image: { width: "180px", height: "180px", objectFit: "cover", backgroundColor: "#fff" },
    productName: { fontSize: "22px", fontWeight: "700", margin: "0 0 10px 0" },
    price: { color: brand.orange, fontSize: "18px", fontWeight: "600", marginBottom: "20px" },
    qtyGroup: { display: "flex", alignItems: "center" },
    qtyBtn: {
      width: "40px", height: "40px", border: "none", backgroundColor: "#dcdcdc",
      fontSize: "20px", cursor: "pointer", color: "#666"
    },
    qtyInput: {
      width: "60px", height: "38px", border: `1px solid ${brand.border}`,
      textAlign: "center", fontSize: "16px", backgroundColor: "#fff"
    },
    summaryTitle: { fontSize: "20px", fontWeight: "700", marginBottom: "25px" },
    summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "15px" },
    promoInput: {
      flex: 1, padding: "12px", border: `1px solid ${brand.border}`,
      outline: "none", fontSize: "14px"
    },
    promoBtn: {
      backgroundColor: brand.orange, color: "#fff", border: "none",
      padding: "0 20px", cursor: "pointer", fontWeight: "600"
    },
    totalLabel: { fontSize: "18px", fontWeight: "700" },
    totalPrice: { fontSize: "22px", fontWeight: "700", textAlign: "right" },
    btnMain: {
      width: "100%", padding: "18px", backgroundColor: brand.orange,
      color: "#fff", border: "none", borderRadius: "4px", fontWeight: "700",
      fontSize: "16px", cursor: "pointer", marginBottom: "12px"
    },
    btnQuick: {
      width: "100%", padding: "18px", backgroundColor: "#fff",
      color: "#2c4e4e", border: `1px solid ${brand.border}`, borderRadius: "4px",
      fontWeight: "600", fontSize: "16px", cursor: "pointer"
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.wrapper}>
        {/* BÊN TRÁI: DANH SÁCH GIỎ HÀNG */}
        <div style={styles.cartSection}>
          <h1 style={styles.title}>Giỏ hàng</h1>
          <div style={styles.itemCount}>Tổng mặt hàng: {cart.length}</div>

          {cart.map((item) => (
            <div key={item.id} style={styles.productRow}>
              <img src={item.image_url} alt={item.name} style={styles.image} />
              <div>
                <h2 style={styles.productName}>{item.name}</h2>
                <div style={styles.price}>{item.price.toLocaleString()}VND</div>

                <div style={styles.qtyGroup}>
                  <button style={{ ...styles.qtyBtn, borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }} onClick={() => updateQty(item.id, -1)}>-</button>
                  <input style={styles.qtyInput} value={item.quantity} readOnly />
                  <button style={{ ...styles.qtyBtn, borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }} onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BÊN PHẢI: THÔNG TIN THANH TOÁN */}
        <div style={styles.summarySection}>
          <div style={styles.summaryTitle}>Thông tin đơn hàng ({cart.length})</div>

          <div style={styles.summaryRow}>
            <span style={{ color: brand.muted }}>Tạm tính ({cart.length} mặt hàng)</span>
            <span>{subtotal.toLocaleString()} VND</span>
          </div>

          <div style={styles.summaryRow}>
            <span style={{ color: brand.muted }}>Phí vận chuyển</span>
            <span style={{ color: brand.muted }}>Chưa tính toán</span>
          </div>

          <div style={{ ...styles.summaryRow, borderBottom: `1px solid ${brand.border}`, paddingBottom: '20px' }}>
            <span style={{ color: brand.muted }}>Tổng khuyến mãi</span>
            <span>-</span>
          </div>

          <div style={{ display: "flex", margin: "25px 0" }}>
            <input
              style={styles.promoInput}
              placeholder="Nhập mã giảm giá"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <button style={styles.promoBtn}>Áp dụng</button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
            <span style={styles.totalLabel}>Tổng tiền</span>
            <div>
              <div style={styles.totalPrice}>{total.toLocaleString()} VND</div>
              <div style={{ fontSize: "12px", color: brand.muted, textAlign: "right" }}>(Đã bao gồm VAT)</div>
            </div>
          </div>

          <button style={styles.btnMain}>Thanh toán</button>
          <button style={styles.btnQuick}>Mua nhanh</button>
        </div>
      </div>
    </main>
  );
}
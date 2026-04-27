import React, { useState, useEffect } from "react";
import { User, Package, ChevronRight, MapPin, Phone, Mail, Calendar, CreditCard, MessageSquare } from "lucide-react";
import { formatVnd } from "../constants";

export default function Profile({ user, setActiveTab }) { // Thêm setActiveTab để chuyển hướng nếu cần
  const [activeSubTab, setActiveSubTab] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Giả lập dữ liệu đơn hàng
  const mockOrders = [
    {
      id: "ORD-2026-001",
      date: "26/04/2026",
      status: "Đang giao",
      total: 3500000,
      paymentMethod: "Chuyển khoản ngân hàng",
      items: [
        { id: 1, name: "Robot hút bụi Hometic Pro", price: 2500000, qty: 1, image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=200&q=80" },
        { id: 2, name: "Máy lọc không khí PureAir", price: 1000000, qty: 1, image: "https://images.unsplash.com/photo-1626430451221-0f3f12289c43?auto=format&fit=crop&w=200&q=80" }
      ],
      address: "123 Đường Tôn Đức Thắng, Quận 1, TP. Hồ Chí Minh"
    },
    {
      id: "ORD-2026-002",
      date: "15/04/2026",
      status: "Đã giao",
      total: 1200000,
      paymentMethod: "Thanh toán khi nhận hàng (COD)",
      items: [
        { id: 3, name: "Nồi cơm điện SmartCook", price: 1200000, qty: 1, image: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=200&q=80" }
      ],
      address: "456 Đường Lê Lợi, Quận Hải Châu, TP. Đà Nẵng"
    }
  ];

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
    container: { padding: isMobile ? "20px" : "40px 60px", backgroundColor: brand.bg, minHeight: "100vh", fontFamily: '"Inter", sans-serif' },
    layout: { display: "flex", flexDirection: isMobile ? "column" : "row", gap: "30px", maxWidth: "1200px", margin: "0 auto" },
    sidebar: { flex: "0 0 300px", display: "flex", flexDirection: "column", gap: "15px" },
    mainContent: { flex: 1, backgroundColor: brand.white, borderRadius: "24px", padding: isMobile ? "20px" : "30px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: `1px solid ${brand.border}` },
    profileCard: { backgroundColor: brand.primary, borderRadius: "24px", padding: "30px", color: "white", textAlign: "center" },
    avatar: { width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 15px", fontSize: "32px", fontWeight: "bold" },
    navItem: (active) => ({ padding: "15px 20px", borderRadius: "12px", backgroundColor: active ? brand.primary : brand.white, color: active ? brand.white : brand.text, display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", fontWeight: "700", transition: "0.2s", border: `1px solid ${brand.border}` }),
    orderCard: { padding: "20px", borderRadius: "16px", border: `1px solid ${brand.border}`, marginBottom: "15px", cursor: "pointer", transition: "0.2s" },
    statusBadge: (status) => ({ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", backgroundColor: status === "Đang giao" ? "#fff3e0" : "#e8f5e9", color: status === "Đang giao" ? "#ef6c00" : "#2e7d32" }),
    orderDetailHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: `1px solid ${brand.border}`, paddingBottom: "15px" },
    btnReview: {
      padding: "8px 16px",
      backgroundColor: brand.white,
      color: brand.secondary,
      border: `1px solid ${brand.secondary}`,
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "700",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "0.2s"
    }
  };

  const renderOrderList = () => (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: "800", color: brand.primary, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <Package size={24} /> Lịch sử mua hàng
      </h2>
      {mockOrders.map((order) => (
        <div
          key={order.id}
          style={styles.orderCard}
          onClick={() => setSelectedOrder(order)}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)"}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontWeight: "700", color: brand.primary }}>{order.id}</span>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {order.status === "Đã giao" && (
                <button
                  style={styles.btnReview}
                  onClick={(e) => { e.stopPropagation(); /* Logic mở tab đánh giá */ }}
                >
                  <MessageSquare size={14} /> Đánh giá
                </button>
              )}
              <span style={styles.statusBadge(order.status)}>{order.status}</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "14px", color: brand.muted }}>Ngày đặt: {order.date}</div>
              <div style={{ fontWeight: "800", marginTop: "5px", color: brand.secondary }}>{formatVnd(order.total)}</div>
            </div>
            <ChevronRight size={20} color={brand.muted} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderOrderDetail = (order) => (
    <div>
      <div style={styles.orderDetailHeader}>
        <button
          onClick={() => setSelectedOrder(null)}
          style={{ background: "none", border: "none", color: brand.primary, fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
        >
          ← Quay lại
        </button>
        <span style={{ fontWeight: "800", color: brand.primary }}>Chi tiết đơn hàng: {order.id}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
        <div style={{ padding: "20px", background: "#f8f8f8", borderRadius: "16px" }}>
          <h4 style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}><MapPin size={18} /> Địa chỉ nhận hàng</h4>
          <p style={{ fontSize: "14px", lineHeight: "1.6" }}>{user?.full_name || "Khách hàng"}<br />{order.address}</p>
        </div>
        <div style={{ padding: "20px", background: "#f8f8f8", borderRadius: "16px" }}>
          <h4 style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}><CreditCard size={18} /> Phương thức thanh toán</h4>
          <p style={{ fontSize: "14px" }}>{order.paymentMethod}</p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h4 style={{ margin: 0, fontWeight: "800" }}>Sản phẩm ({order.items.length})</h4>
        {order.status === "Đã giao" && (
          <button style={styles.btnReview} onClick={() => { /* Logic mở đánh giá */ }}>
            <MessageSquare size={16} /> Đánh giá tất cả
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {order.items.map((item) => (
          <div key={item.id} style={{ display: "flex", gap: "15px", alignItems: "center", paddingBottom: "15px", borderBottom: "1px solid #eee" }}>
            <img src={item.image} style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "700" }}>{item.name}</div>
              <div style={{ fontSize: "13px", color: brand.muted }}>Số lượng: {item.qty}</div>
            </div>
            <div style={{ fontWeight: "700", textAlign: "right" }}>
              <div>{formatVnd(item.price * item.qty)}</div>
              {order.status === "Đã giao" && (
                <div style={{ color: brand.secondary, fontSize: "11px", cursor: "pointer", marginTop: "4px" }}>Viết nhận xét</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <div style={{ fontSize: "14px", color: brand.muted, marginBottom: "5px" }}>Tổng tiền thanh toán</div>
        <div style={{ fontSize: "24px", fontWeight: "900", color: brand.secondary }}>{formatVnd(order.total)}</div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.layout}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.profileCard}>
            <div style={styles.avatar}>{user?.full_name?.charAt(0) || "U"}</div>
            <h3 style={{ margin: "0 0 5px", fontWeight: "800" }}>{user?.full_name || "Khách hàng"}</h3>
            <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>{user?.email || "customer@hometic.com"}</p>
          </div>

          <div
            style={styles.navItem(activeSubTab === "profile")}
            onClick={() => { setActiveSubTab("profile"); setSelectedOrder(null); }}
          >
            <User size={20} /> Thông tin cá nhân
          </div>
          <div
            style={styles.navItem(activeSubTab === "orders")}
            onClick={() => { setActiveSubTab("orders"); }}
          >
            <Package size={20} /> Đơn hàng của tôi
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {activeSubTab === "profile" ? (
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "800", color: brand.primary, marginBottom: "30px" }}>Thông tin tài khoản</h2>
              <div style={{ display: "grid", gap: "20px" }}>
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                  <div style={{ width: "40px", height: "40px", background: brand.bg, borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", color: brand.primary }}><Mail size={20} /></div>
                  <div>
                    <div style={{ fontSize: "12px", color: brand.muted }}>Email</div>
                    <div style={{ fontWeight: "600" }}>{user?.email || "customer@hometic.com"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                  <div style={{ width: "40px", height: "40px", background: brand.bg, borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", color: brand.primary }}><Phone size={20} /></div>
                  <div>
                    <div style={{ fontSize: "12px", color: brand.muted }}>Số điện thoại</div>
                    <div style={{ fontWeight: "600" }}>090 123 4567</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                  <div style={{ width: "40px", height: "40px", background: brand.bg, borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", color: brand.primary }}><Calendar size={20} /></div>
                  <div>
                    <div style={{ fontSize: "12px", color: brand.muted }}>Ngày tham gia</div>
                    <div style={{ fontWeight: "600" }}>01/01/2026</div>
                  </div>
                </div>
              </div>
              <button style={{ marginTop: "40px", padding: "12px 25px", border: `2px solid ${brand.primary}`, background: "none", color: brand.primary, borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>
                Chỉnh sửa thông tin
              </button>
            </div>
          ) : (
            selectedOrder ? renderOrderDetail(selectedOrder) : renderOrderList()
          )}
        </div>
      </div>
    </div>
  );
}
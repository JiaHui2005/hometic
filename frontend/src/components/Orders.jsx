import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { formatVnd } from "../constants";
import { Package, Clock, MapPin, ChevronRight, ShoppingBag } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    api("/orders/me").then(setOrders).catch(() => {
      // Mock data if API fails
      setOrders([
        { id: "ORD-001", status: "Đang giao", address: "123 Tôn Đức Thắng, Q1, HCM", total_amount: 1500000, date: "26/04/2026" },
        { id: "ORD-002", status: "Đã giao", address: "456 Lê Lợi, Đà Nẵng", total_amount: 850000, date: "20/04/2026" }
      ]);
    });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      maxWidth: "900px",
      margin: "0 auto"
    },
    card: {
      backgroundColor: brand.white,
      borderRadius: "20px",
      padding: isMobile ? "20px" : "25px",
      marginBottom: "20px",
      border: `1px solid ${brand.border}`,
      boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      gap: "20px",
      cursor: "pointer",
      transition: "0.2s"
    },
    status: (status) => ({
      padding: "6px 14px",
      borderRadius: "10px",
      fontSize: "12px",
      fontWeight: "800",
      backgroundColor: status === "Đang giao" ? "#fff3e0" : "#e8f5e9",
      color: status === "Đang giao" ? "#ef6c00" : "#2e7d32",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    })
  };

  if (orders.length === 0) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <ShoppingBag size={60} color={brand.border} style={{ marginBottom: '20px' }} />
          <h2 style={{ color: brand.primary }}>Bạn chưa có đơn hàng nào</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h1 style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: "900", color: brand.primary, marginBottom: "40px", display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Package size={32} /> Lịch sử đơn hàng
        </h1>

        {orders.map((order) => (
          <div 
            key={order.id} 
            style={styles.card}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <span style={{ fontWeight: '800', color: brand.primary, fontSize: '18px' }}>#{order.id}</span>
                <span style={styles.status(order.status)}>{order.status}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: brand.muted, fontSize: '14px' }}>
                  <Clock size={16} /> {order.date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: brand.muted, fontSize: '14px' }}>
                  <MapPin size={16} /> {order.address}
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: isMobile ? 'left' : 'right', minWidth: '150px' }}>
              <div style={{ fontSize: '13px', color: brand.muted, marginBottom: '4px' }}>Tổng thanh toán</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: brand.secondary }}>{formatVnd(order.total_amount)}</div>
            </div>

            {!isMobile && <ChevronRight size={20} color={brand.border} />}
          </div>
        ))}
      </div>
    </div>
  );
}

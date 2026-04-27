import React, { useState, useEffect } from "react";

export default function ProductDetail({ product, addToCart, setActiveTab }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hệ màu đồng bộ Hometic
  const brand = {
    bg: "#f9f5ed",      // Beige nền chính
    panelBg: "#e5e5e5", // Xám nhạt panel
    primary: "#234a4a", // Teal đậm
    orange: "#da8f48",  // Cam Hometic
    white: "#ffffff",
    text: "#1a1a1a",
    muted: "#666",
    border: "#d1cec7"
  };

  const defaultProduct = {
    name: "Hometic Hộp đựng thực phẩm",
    sku: "019583262",
    price: 166000,
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1590422443831-768569888998?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&w=600&q=80"
    ],
    details: [
      { label: "Kích thước", value: "≈188 x 75 x 142 mm" },
      { label: "Sức chứa", value: "980ml" },
      { label: "Chất liệu", value: "Polyme của polyethylene và methyl methacrylate." },
      { label: "Lưu ý", value: "Không dùng trong lò vi sóng, không rửa bằng máy rửa chén." },
    ]
  };

  const p = product || defaultProduct;
  const [mainImage, setMainImage] = useState(p.images[0]);

  const styles = {
    page: {
      backgroundColor: brand.bg,
      minHeight: '100vh',
      padding: '60px 10%',
      fontFamily: '"Inter", sans-serif',
      color: brand.text,
      boxSizing: 'border-box'
    },
    mainInfo: {
      display: 'flex',
      gap: '50px',
      marginBottom: '60px',
      alignItems: 'flex-start'
    },
    gallery: {
      flex: 1.2,
      display: 'flex',
      gap: '20px'
    },
    thumbList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    thumbImg: (active) => ({
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '8px',
      cursor: 'pointer',
      border: active ? `2px solid ${brand.orange}` : `1px solid ${brand.border}`,
      opacity: active ? 1 : 0.7,
      transition: '0.3s'
    }),
    mainImgBox: {
      flex: 1,
      backgroundColor: brand.white,
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      border: `1px solid ${brand.border}`
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      fontSize: '36px',
      fontWeight: '800',
      margin: '0 0 10px 0',
      letterSpacing: '-1px'
    },
    sku: {
      color: brand.muted,
      fontSize: '14px',
      marginBottom: '25px',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    price: {
      fontSize: '32px',
      fontWeight: '700',
      color: brand.orange,
      marginBottom: '40px'
    },
    qtySelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '0',
      marginBottom: '30px'
    },
    qtyBtn: {
      width: '45px',
      height: '45px',
      border: `1px solid ${brand.border}`,
      backgroundColor: '#eee',
      fontSize: '20px',
      cursor: 'pointer',
      transition: '0.2s'
    },
    qtyInput: {
      width: '60px',
      height: '43px',
      borderTop: `1px solid ${brand.border}`,
      borderBottom: `1px solid ${brand.border}`,
      borderLeft: 'none',
      borderRight: 'none',
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: '600',
      outline: 'none'
    },
    btnAdd: {
      padding: '18px 35px',
      backgroundColor: brand.primary,
      color: brand.white,
      border: 'none',
      borderRadius: '8px',
      fontWeight: '700',
      fontSize: '16px',
      cursor: 'pointer',
      marginRight: '15px',
      flex: 1,
      transition: '0.3s'
    },
    btnBuy: {
      padding: '18px 35px',
      backgroundColor: brand.orange,
      color: brand.white,
      border: 'none',
      borderRadius: '8px',
      fontWeight: '700',
      fontSize: '16px',
      cursor: 'pointer',
      flex: 1,
      transition: '0.3s'
    },
    specsBox: {
      marginTop: '40px',
      backgroundColor: brand.panelBg,
      padding: '40px',
      borderRadius: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '15px'
    },
    specRow: {
      borderBottom: `1px solid ${brand.border}`
    },
    specLabel: {
      padding: '15px 20px',
      fontWeight: '700',
      width: '250px',
      color: brand.primary,
      textTransform: 'uppercase',
      fontSize: '13px',
      letterSpacing: '1px'
    },
    specValue: {
      padding: '15px 20px',
      color: brand.text,
      lineHeight: '1.6'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.mainInfo}>
        {/* Gallery */}
        <div style={styles.gallery}>
          <div style={styles.thumbList}>
            {p.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                style={styles.thumbImg(mainImage === img)}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          <div style={styles.mainImgBox}>
            <img src={mainImage} alt={p.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          <h1 style={styles.title}>{p.name}</h1>
          <p style={styles.sku}>SKU: {p.sku}</p>
          <div style={styles.price}>{p.price.toLocaleString()} VND</div>

          <div style={styles.qtySelector}>
            <button
              style={{ ...styles.qtyBtn, borderRadius: '8px 0 0 8px' }}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >-</button>
            <input style={styles.qtyInput} type="text" value={quantity} readOnly />
            <button
              style={{ ...styles.qtyBtn, borderRadius: '0 8px 8px 0' }}
              onClick={() => setQuantity(quantity + 1)}
            >+</button>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              style={styles.btnAdd}
              onClick={() => addToCart({ ...p, quantity })}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              THÊM VÀO GIỎ HÀNG
            </button>
            <button
              style={styles.btnBuy}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              MUA NGAY
            </button>
          </div>
        </div>
      </div>

      {/* Specification Table */}
      <div style={styles.specsBox}>
        <h2 style={{ fontSize: '20px', marginBottom: '30px', borderLeft: `5px solid ${brand.orange}`, paddingLeft: '15px' }}>
          THÔNG SỐ KỸ THUẬT
        </h2>
        <table style={styles.table}>
          <tbody>
            {p.details.map((detail, idx) => (
              <tr key={idx} style={styles.specRow}>
                <td style={styles.specLabel}>{detail.label}</td>
                <td style={styles.specValue}>{detail.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
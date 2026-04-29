import React, { useState } from "react";
import { Star, AlertCircle } from "lucide-react"; // Thêm AlertCircle để làm icon xác nhận
import { formatVnd } from "../constants";

export default function ProductStrip({ title, items, addToCart, setActiveTab, setSelectedProduct }) {
  const [hoveredBtn, setHoveredBtn] = useState(null);

  // 1. Thêm State để quản lý việc hiển thị Modal xác nhận
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setActiveTab("product_detail");
  };

  // 2. Hàm xử lý khi bấm nút "Mua ngay"
  const handleBuyClick = (product) => {
    setPendingProduct(product);
    setShowConfirm(true);
  };

  // 3. Hàm xử lý khi người dùng xác nhận "Đồng ý"
  const confirmAction = () => {
    if (pendingProduct) {
      addToCart(pendingProduct);
      setShowConfirm(false);
      setPendingProduct(null);
      setActiveTab("cart");
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Thêm 'smooth' nếu muốn hiệu ứng cuộn mượt, hoặc 'instant' để lên ngay lập tức
      });
    }
  };

  const brand = {
    bg: "#f9f5ed",
    panel: "#e5e5e5",
    primary: "#234a4a",
    orange: "#da8f48",
    white: "#ffffff",
    text: "#1a1a1a",
    muted: "#666",
    overlay: "rgba(0, 0, 0, 0.6)" // Màu nền mờ
  };

  const styles = {
    // ... (Các styles cũ giữ nguyên)
    section: { padding: '40px 0', fontFamily: '"Inter", sans-serif' },
    heading: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '25px', borderLeft: `5px solid ${brand.orange}`, paddingLeft: '15px'
    },
    title: { fontSize: '24px', fontWeight: '800', margin: 0, color: brand.primary, textTransform: 'uppercase' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' },
    card: {
      backgroundColor: brand.white, borderRadius: '16px', overflow: 'hidden', position: 'relative',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease'
    },
    img: { width: '100%', height: '220px', objectFit: 'cover', cursor: 'pointer' },
    ribbon: {
      position: 'absolute', top: '12px', left: '12px', backgroundColor: brand.orange,
      color: brand.white, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', zIndex: 1
    },
    body: { padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' },
    prodName: {
      fontSize: '16px', fontWeight: '700', margin: 0, color: brand.text, cursor: 'pointer',
      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      lineHeight: '1.4', height: '45px'
    },
    desc: { fontSize: '13px', color: brand.muted },
    priceContainer: { display: 'flex', flexDirection: 'column', gap: '2px', margin: '5px 0' },
    activePrice: { fontSize: '18px', fontWeight: '800', color: brand.primary },
    oldPrice: { fontSize: '13px', color: brand.muted, textDecoration: 'line-through', fontWeight: '500' },

    buyBtn: (isHovered) => ({
      width: '100%',
      padding: '12px',
      backgroundColor: isHovered ? '#3A3939' : brand.orange,
      color: brand.white,
      border: `2px solid ${isHovered ? brand.white : brand.orange}`,
      borderRadius: '8px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px',
      outline: 'none'
    }),

    // 4. Styles cho Modal xác nhận
    modalOverlay: {
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: brand.overlay, display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
    },
    modalContent: {
      backgroundColor: brand.white, padding: '30px', borderRadius: '20px',
      width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
    },
    modalTitle: { fontSize: '18px', fontWeight: '700', color: brand.primary, marginBottom: '10px' },
    modalText: { fontSize: '14px', color: brand.muted, marginBottom: '20px', lineHeight: '1.5' },
    modalActions: { display: 'flex', gap: '12px', justifyContent: 'center' },
    cancelBtn: {
      padding: '10px 20px', borderRadius: '8px', border: `1px solid ${brand.panel}`,
      backgroundColor: 'white', color: brand.muted, fontWeight: '600', cursor: 'pointer'
    },
    confirmBtn: {
      padding: '10px 20px', borderRadius: '8px', border: 'none',
      backgroundColor: brand.orange, color: 'white', fontWeight: '600', cursor: 'pointer'
    }
  };

  return (
    <section style={styles.section}>
      <div style={styles.heading}>
        <h2 style={styles.title}>{title}</h2>
      </div>

      <div style={styles.grid}>
        {items.map((product, index) => {
          const productKey = product.viewKey || `${product.id}-${index}`;
          const hasSale = !!product.sale_price;

          return (
            <article
              style={styles.card}
              key={productKey}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {hasSale && <div style={styles.ribbon}>GIẢM GIÁ</div>}

              <img
                src={product.image_url}
                alt={product.name}
                onClick={() => handleProductClick(product)}
                style={styles.img}
              />

              <div style={styles.body}>
                <h3 onClick={() => handleProductClick(product)} style={styles.prodName}>
                  {product.name}
                </h3>
                <span style={styles.desc}>{product.description || "Thiết bị gia dụng cao cấp"}</span>

                <div style={styles.priceContainer}>
                  <strong style={styles.activePrice}>
                    {formatVnd(product.sale_price || product.price)}
                  </strong>
                  {hasSale && (
                    <span style={styles.oldPrice}>
                      {formatVnd(product.price)}
                    </span>
                  )}
                </div>

                <button
                  style={styles.buyBtn(hoveredBtn === productKey)}
                  onMouseEnter={() => setHoveredBtn(productKey)}
                  onMouseLeave={() => setHoveredBtn(null)}
                  // Thay đổi onClick tại đây
                  onClick={() => handleBuyClick(product)}
                >
                  Mua ngay
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* 5. Giao diện Modal xác nhận */}
      {showConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <AlertCircle size={48} color={brand.orange} style={{ marginBottom: '15px' }} />
            <h4 style={styles.modalTitle}>Xác nhận mua hàng</h4>
            <p style={styles.modalText}>
              Bạn có chắc chắn muốn thêm <strong>{pendingProduct?.name}</strong> vào giỏ hàng không?
            </p>
            <div style={styles.modalActions}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowConfirm(false)}
              >
                Hủy bỏ
              </button>
              <button
                style={styles.confirmBtn}
                onClick={confirmAction}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
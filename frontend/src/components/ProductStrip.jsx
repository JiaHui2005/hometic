import React, { useState } from "react";
import { formatVnd } from "../constants";
import alertService from "../services/alertService";
import { getImgUrl } from "../services/api";

export default function ProductStrip({ title, items, addToCart, setActiveTab, setSelectedProduct }) {
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setActiveTab("product_detail");
  };

  const handleBuyNow = (product, e) => {
    // Ngăn chặn sự kiện click lan ra thẻ article cha
    e.stopPropagation();

    addToCart(product);
    setActiveTab("cart");
    alertService.success(`Đã thêm thành công "${product.name}" vào giỏ hàng!`);
  };

  const brand = {
    bg: "#f9f5ed",
    panel: "#e5e5e5",
    primary: "#234a4a",
    orange: "#da8f48",
    white: "#ffffff",
    text: "#1a1a1a",
    muted: "#666",
  };

  const styles = {
    section: { padding: '40px 0', fontFamily: '"Inter", sans-serif' },
    heading: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '25px', borderLeft: `5px solid ${brand.orange}`, paddingLeft: '15px'
    },
    title: { fontSize: '24px', fontWeight: '800', margin: 0, color: brand.primary, textTransform: 'uppercase' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' },
    card: {
      backgroundColor: brand.white, borderRadius: '16px', overflow: 'hidden', position: 'relative',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease',
      cursor: 'pointer' // Thêm con trỏ tay cho toàn bộ card
    },
    img: { width: '100%', height: '220px', objectFit: 'cover' },
    ribbon: {
      position: 'absolute', top: '12px', left: '12px', backgroundColor: brand.orange,
      color: brand.white, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', zIndex: 1
    },
    body: { padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' },
    prodName: {
      fontSize: '16px', fontWeight: '700', margin: 0, color: brand.text,
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
    })
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
              // Chuyển sự kiện click ra ngoài cùng
              onClick={() => handleProductClick(product)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {hasSale && <div style={styles.ribbon}>GIẢM GIÁ</div>}

              <img
                src={getImgUrl(product.image_url)}
                alt={product.name}
                style={styles.img}
              />

              <div style={styles.body}>
                <h3 style={styles.prodName}>
                  {product.name}
                </h3>
                <span style={styles.desc}>{product.description || "Thiết thiết bị cao cấp"}</span>

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
                  // Thêm e vào tham số và stopPropagation bên trong hàm
                  onClick={(e) => handleBuyNow(product, e)}
                >
                  Mua ngay
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
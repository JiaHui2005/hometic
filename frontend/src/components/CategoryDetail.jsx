import React, { useState } from "react";
import { formatVnd } from "../constants";

export default function CategoryDetail({ products, addToCart, setActiveTab, setSelectedProduct }) {
  const [hoveredId, setHoveredId] = useState(null);

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

  const productImg = "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80";

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setActiveTab("product_detail");
  };

  const displayProducts = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    name: "Robot hút bụi Hometic",
    price: 7990000,
    image: productImg
  }));

  const styles = {
    container: {
      backgroundColor: brand.bg,
      minHeight: '100vh',
      padding: '60px 5%',
      fontFamily: '"Inter", sans-serif',
      color: brand.text,
      boxSizing: 'border-box'
    },
    title: {
      fontSize: '42px',
      fontWeight: '900',
      color: brand.primary,
      marginBottom: '40px',
      textAlign: 'center',
      letterSpacing: '-1.5px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '30px',
      marginBottom: '60px'
    },
    card: {
      backgroundColor: brand.white,
      borderRadius: '16px',
      padding: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
      border: `1px solid ${brand.border}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
    },
    imageContainer: {
      width: '100%',
      aspectRatio: '1/1',
      borderRadius: '10px',
      overflow: 'hidden',
      marginBottom: '15px',
      backgroundColor: '#f5f5f5'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    info: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      marginBottom: '15px',
      flex: 1
    },
    productName: {
      fontSize: '15px',
      fontWeight: '600',
      color: brand.text
    },
    priceLabel: {
      fontSize: '12px',
      color: brand.muted
    },
    priceValue: {
      fontSize: '18px',
      fontWeight: '800',
      color: brand.orange
    },
    btn: (isFilled, isHovered) => ({
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      fontWeight: '700',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: `2px solid ${brand.orange}`,
      backgroundColor: isHovered || isFilled ? brand.orange : 'transparent',
      color: isHovered || isFilled ? brand.white : brand.orange,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }),
    subtitle: {
      color: brand.primary,
      fontSize: '28px',
      fontWeight: '800',
      padding: '20px 0',
      textAlign: 'center',
      borderTop: `1px solid ${brand.border}`,
      marginTop: '40px'
    }
  };

  const ProductCard = ({ product, index }) => {
    const cardKey = `card-${index}`;
    const isHovered = hoveredId === cardKey;

    return (
      <div
        style={{
          ...styles.card,
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          boxShadow: isHovered ? '0 12px 30px rgba(0,0,0,0.1)' : styles.card.boxShadow
        }}
        onMouseEnter={() => setHoveredId(cardKey)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div style={styles.imageContainer} onClick={() => handleProductClick(product)}>
          <img src={product.image} alt={product.name} style={styles.image} />
        </div>
        <div style={styles.info} onClick={() => handleProductClick(product)}>
          <span style={styles.productName}>{product.name}</span>
          <span style={styles.priceLabel}>Giá niêm yết</span>
          <strong style={styles.priceValue}>{formatVnd(product.price)}</strong>
        </div>
        <button
          style={styles.btn(isHovered)}
          onClick={() => addToCart(product)}
        >
          Mua ngay
        </button>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gia dụng thông minh</h1>

      <div style={styles.grid}>
        {displayProducts.map((p, i) => (
          <ProductCard key={i} index={`grid1-${i}`} product={p} />
        ))}
      </div>

      <h2 style={styles.subtitle}>Tất cả sản phẩm</h2>

      <div style={styles.grid}>
        {displayProducts.slice(0, 5).map((p, i) => (
          <ProductCard key={i} index={`grid2-${i}`} product={p} />
        ))}
      </div>
    </div>
  );
}
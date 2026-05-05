import React, { useState, useEffect } from "react";
import ProductStrip from "./ProductStrip";
import { formatVnd } from "../constants";

export default function Shop({ categories, products, addToCart, setActiveTab, setSelectedProduct }) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Breakpoints
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  const displayProducts = products
    .slice(0, 10)
    .map((product, index) => ({ ...product, viewKey: `${product.id}-${index}` }));

  const sections = [
    ["Bộ sưu tập mới", displayProducts.slice(0, 5)],
    ["Bán chạy nhất", displayProducts.slice(5, 10)],
  ];

  const brand = {
    primary: "#234a4a",
    secondary: "#ed7f1a",
    bg: "#f9f5ed",
    surface: "#ffffff",
    border: "#dcd7cc",
    accent: "#ff0050"
  };

  const styles = {
    main: {
      backgroundColor: brand.bg,
      minHeight: '100vh',
      width: '100%',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    heroSection: {
      display: 'grid',
      // Mobile: 1 cột, PC: Grid 1.5fr và 1fr
      gridTemplateColumns: (isMobile || isTablet) ? '1fr' : '1.5fr 1fr',
      gap: isMobile ? '16px' : '24px',
      padding: isMobile ? '15px' : '40px',
      borderTop: `10px solid ${brand.primary}`
    },
    heroMain: {
      background: brand.primary,
      borderRadius: '24px',
      padding: isMobile ? '30px 20px' : '50px',
      display: 'flex',
      // Mobile: Ảnh dưới chữ, PC: Ảnh cạnh chữ
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: 'white',
      gap: '30px',
      position: 'relative',
      overflow: 'hidden'
    },
    heroCopy: {
      flex: 1,
      textAlign: isMobile ? 'center' : 'left',
      zIndex: 2
    },
    heroTitle: {
      fontSize: isMobile ? '28px' : isTablet ? '36px' : '48px',
      fontWeight: '900',
      margin: '12px 0',
      lineHeight: 1.2,
      textTransform: 'uppercase'
    },
    heroImage: {
      width: isMobile ? '70%' : '40%',
      maxWidth: '350px',
      filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))',
      borderRadius: '15px'
    },
    heroSide: {
      display: 'grid',
      // Tablet: 2 cột ngang, Mobile/PC: Cột dọc
      gridTemplateColumns: isTablet ? '1fr 1fr' : '1fr',
      gridTemplateRows: isTablet ? '1fr' : 'auto auto',
      gap: isMobile ? '16px' : '24px'
    },
    sideCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: `1px solid ${brand.border}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      transition: 'all 0.3s ease'
    },
    categorySection: {
      padding: isMobile ? '30px 15px' : '40px'
    },
    categoryGrid: {
      display: 'grid',
      // Mobile: 1, Tablet: 2, PC: 3 cột
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3, 1fr)',
      gap: '20px'
    },
    categoryTile: {
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      height: '200px',
      cursor: 'pointer',
      transition: 'transform 0.3s ease'
    }
  };

  return (
    <main style={styles.main}>
      {/* CSS Animations */}
      <style>{`
        @keyframes pulse-live {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
          100% { opacity: 1; transform: scale(1); }
        }
        .hover-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
      `}</style>

      {/* HERO SECTION */}
      <section style={styles.heroSection}>
        <article style={styles.heroMain}>
          <div style={styles.heroCopy}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700', fontSize: '12px', opacity: 0.8 }}>Hometic x PewPew Special</span>
            <h1 style={styles.heroTitle}>SIÊU TIỆC CÔNG NGHỆ GIA ĐÌNH</h1>
            <p style={{ fontSize: isMobile ? '14px' : '16px', opacity: 0.9, marginBottom: '25px', lineHeight: 1.5 }}>
              Săn ngay các thiết bị thông minh với ưu đãi chưa từng có cùng anh PewPew.
            </p>
            <button
              style={{ backgroundColor: brand.secondary, color: 'white', padding: '12px 28px', borderRadius: '50px', fontSize: '16px', fontWeight: '800', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(237, 127, 26, 0.4)' }}
              onClick={() => setActiveTab("category_detail")}
            >
              Mua sắm ngay
            </button>
          </div>
          <img style={styles.heroImage} src="/pewpew_banner_1.png" alt="PewPew Hero" />
        </article>

        <div style={styles.heroSide}>
          <article className="hover-card" style={styles.sideCard}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', margin: '0 0 5px 0', color: brand.primary, fontWeight: '700' }}>Gội là mê - Mượt là ghiền</h3>
              <p style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0' }}>Tóc đẹp chuẩn salon cùng PewPew</p>
              <strong style={{ fontSize: '18px', color: brand.secondary }}>{formatVnd(99000)}</strong>
            </div>
            <img style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', marginLeft: '10px' }} src="/pewpew_banner_3.png" alt="Sản phẩm" />
          </article>

          <article
            className="hover-card"
            style={{ ...styles.sideCard, border: `2px solid ${brand.accent}`, cursor: 'pointer' }}
            onClick={() => window.open("https://www.tiktok.com/@realpewpew", "_blank")}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: brand.accent, borderRadius: '50%', animation: 'pulse-live 1.5s infinite' }}></div>
                <span style={{ fontSize: '11px', fontWeight: '900', color: brand.accent }}>LIVE NOW</span>
              </div>
              <h3 style={{ fontSize: '16px', margin: '0 0 5px 0', color: brand.primary, fontWeight: '700' }}>Mega Live x PewPew</h3>
              <span style={{ color: brand.accent, fontWeight: '700', fontSize: '13px' }}>Vào xem ngay →</span>
            </div>
            <img style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '12px' }} src="/pewpew_banner_2.png" alt="Live Stream" />
          </article>
        </div>
      </section>

      {/* PRODUCT STRIPS */}
      {sections.map(([title, items]) => (
        <ProductStrip
          key={title}
          title={title}
          items={items}
          addToCart={addToCart}
          setActiveTab={setActiveTab}
          setSelectedProduct={setSelectedProduct}
        />
      ))}

      {/* CATEGORIES */}
      <section style={styles.categorySection}>
        <div style={{ borderLeft: `4px solid ${brand.secondary}`, paddingLeft: '12px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: brand.primary, textTransform: 'uppercase', margin: 0 }}>Danh mục nổi bật</h2>
        </div>
        <div style={styles.categoryGrid}>
          {[
            ["Gia dụng Nhà bếp", "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80"],
            ["Thiết bị vệ sinh", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"],
            ["Tiện ích phòng ngủ", "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"]
          ].map(([label, img]) => (
            <article
              key={label}
              style={styles.categoryTile}
              className="hover-card"
              onClick={() => setActiveTab("category_detail")}
            >
              <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={img} alt={label} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white' }}>
                <span style={{ fontSize: '18px', fontWeight: '700' }}>{label}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
import React, { useState, useEffect } from "react";
import ProductStrip from "./ProductStrip";
import { formatVnd } from "../constants";

export default function Shop({ categories, products, addToCart, setActiveTab, setSelectedProduct }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayProducts = Array.from({ length: 10 }, (_, index) => products[index % Math.max(products.length, 1)])
    .filter(Boolean)
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
    border: "#dcd7cc"
  };

  const styles = {
    main: {
      backgroundColor: brand.bg,
      minHeight: '100vh',
      width: '100%'
    },
    hero: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr',
      gap: '24px',
      padding: isMobile ? '20px' : '40px',
      borderTop: `15px solid ${brand.primary}`
    },
    heroMain: {
      background: brand.primary,
      borderRadius: '20px',
      padding: isMobile ? '40px 30px' : '60px',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      gap: '30px'
    },
    heroCopy: {
      zIndex: 1,
      maxWidth: isMobile ? '100%' : '60%'
    },
    heroSide: {
      display: 'grid',
      gridTemplateRows: isMobile ? 'auto auto' : '1fr 1fr',
      gap: '24px'
    },
    sideCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '25px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: `1px solid ${brand.border}`,
      boxShadow: '0 10px 20px rgba(0,0,0,0.02)'
    },
    categorySection: {
      padding: isMobile ? '20px' : '40px'
    },
    categoryGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: '25px'
    },
    categoryTile: {
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden',
      height: '240px',
      cursor: 'pointer',
      transition: 'transform 0.3s ease'
    }
  };

  return (
    <main style={styles.main}>
      <section style={styles.hero}>
        <article style={styles.heroMain}>
          <div style={styles.heroCopy}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800', fontSize: '13px', opacity: 0.8 }}>Hometic x PewPew Special</span>
            <h1 style={{ fontSize: isMobile ? '36px' : '48px', fontWeight: '900', margin: '15px 0', lineHeight: 1.1 }}>SIÊU TIỆC CÔNG NGHỆ GIA ĐÌNH</h1>
            <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '30px' }}>Săn ngay các thiết bị thông minh với ưu đãi chưa từng có cùng anh PewPew. Nâng tầm cuộc sống hiện đại chỉ với một chạm.</p>
            <button
              style={{ backgroundColor: brand.secondary, color: 'white', padding: '15px 30px', borderRadius: '10px', fontSize: '16px', fontWeight: '800', border: 'none', cursor: 'pointer' }}
              onClick={() => setActiveTab("category_detail")}
            >
              Mua sắm ngay
            </button>
          </div>
          <img
            style={{ width: isMobile ? '80%' : '45%', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))', borderRadius: '20px' }}
            src="/pewpew_banner_1.png"
            alt="PewPew Banner 1"
          />
        </article>

        <div style={styles.heroSide}>
          <article style={styles.sideCard}>
            <div>
              <h3 style={{ fontSize: '18px', margin: '0 0 5px 0', color: brand.primary }}>Gội là mê - Mượt là ghiền x Pewpew</h3>
              <p style={{ fontSize: '13px', color: '#666', margin: '0 0 15px 0' }}>Không cần quảng cáo nhiều - tóc bạn sẽ tự nói lên tất cả!</p>
              <strong style={{ fontSize: '20px', color: brand.secondary }}>Chỉ từ {formatVnd(99000)}</strong>
            </div>
            <img style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px' }} src="/pewpew_banner_3.png" alt="Cooker" />
          </article>
          <article
            style={{
              ...styles.sideCard,
              cursor: 'pointer',
              border: `2px solid #ff0050`,
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => window.open("https://www.tiktok.com/@realpewpew", "_blank")}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff0f3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <div style={{ zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#ff0050', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                <span style={{ fontSize: '12px', fontWeight: '900', color: '#ff0050', letterSpacing: '1px' }}>LIVE NOW</span>
              </div>
              <h3 style={{ fontSize: '18px', margin: '0 0 5px 0', color: brand.primary }}>Mega Live x PewPew</h3>
              <p style={{ fontSize: '13px', color: '#666', margin: '0 0 10px 0' }}>Săn deal độc quyền tại TikTok</p>
              <span style={{ color: '#ff0050', fontWeight: '800', fontSize: '14px', textDecoration: 'underline' }}>Xem ngay →</span>
            </div>
            <img
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }}
              src="/pewpew_banner_2.png"
              alt="PewPew Live"
            />
            <style>{`
              @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.4; transform: scale(1.2); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}</style>
          </article>
        </div>
      </section>

      {sections.map(([title, items]) => (
        <ProductStrip title={title} items={items} addToCart={addToCart} setActiveTab={setActiveTab} setSelectedProduct={setSelectedProduct} key={title} />
      ))}

      <section style={styles.categorySection}>
        <div style={{ borderLeft: `5px solid ${brand.secondary}`, paddingLeft: '15px', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: brand.primary, textTransform: 'uppercase' }}>Danh mục nổi bật</h2>
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
              onClick={() => setActiveTab("category_detail")}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={img} alt={label} />
              <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '25px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white', fontSize: '20px', fontWeight: '800' }}>
                {label}
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

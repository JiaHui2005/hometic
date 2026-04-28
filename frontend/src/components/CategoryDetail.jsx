import React, { useState, useEffect } from "react";
import { formatVnd } from "../constants";
import { catalogService } from "../services/api";

export default function CategoryDetail({ filters, addToCart, setActiveTab, setSelectedProduct }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("Cửa hàng");

  // Hệ màu đồng bộ Hometic
  const brand = {
    bg: "#f9f5ed",
    primary: "#234a4a",
    orange: "#da8f48",
    white: "#ffffff",
    text: "#1a1a1a",
    muted: "#71717a",
    border: "#e5e1d8"
  };

  useEffect(() => {
    if (!filters?.category_slug) {
      setProducts([]);
      setCategoryName("Cửa hàng");
      return;
    }

    const fetchProductsByCategory = async () => {
      setLoading(true);
      try {
        const data = await catalogService.getProducts(`/category/${filters.category_slug}`);
        setProducts(data || []);

        if (data && data.length > 0 && data[0].category) {
          setCategoryName(data[0].category.name);
        } else {
          setCategoryName("Danh mục sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [filters?.category_slug]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setActiveTab("product_detail");
  };

  const styles = {
    container: {
      backgroundColor: brand.bg,
      minHeight: '100vh',
      padding: '60px 5%',
      color: brand.text,
      fontFamily: '"Inter", sans-serif'
    },
    title: {
      fontSize: '32px',
      fontWeight: '900',
      color: brand.primary,
      marginBottom: '40px',
      textAlign: 'center',
      textTransform: 'uppercase'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '25px',
      marginBottom: '60px'
    },
    card: {
      backgroundColor: brand.white,
      borderRadius: '20px',
      padding: '20px',
      border: `1px solid ${brand.border}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      boxShadow: '0 4px 15px rgba(35, 74, 74, 0.03)'
    },
    ribbon: {
      position: 'absolute',
      top: '25px',
      left: '25px',
      backgroundColor: brand.orange,
      color: brand.white,
      padding: '4px 10px',
      borderRadius: '8px',
      fontSize: '11px',
      fontWeight: '800',
      zIndex: 1
    },
    imageContainer: {
      width: '100%',
      aspectRatio: '1/1',
      borderRadius: '14px',
      overflow: 'hidden',
      marginBottom: '15px',
      backgroundColor: '#f8f8f8'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease'
    },
    productName: {
      fontSize: '16px',
      fontWeight: '700',
      color: brand.text,
      marginBottom: '8px',
      lineHeight: '1.4',
      height: '45px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    // STYLE GIÁ ĐỒNG BỘ
    priceContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      marginBottom: '20px'
    },
    activePrice: {
      fontSize: '20px',
      fontWeight: '900',
      color: brand.primary
    },
    oldPrice: {
      fontSize: '13px',
      color: brand.muted,
      textDecoration: 'line-through'
    },
    btn: (isHovered) => ({
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      fontWeight: '800',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: `2px solid ${brand.orange}`,
      backgroundColor: isHovered ? brand.orange : 'transparent',
      color: isHovered ? brand.white : brand.orange,
      textTransform: 'uppercase'
    }),
    emptyState: {
      textAlign: 'center',
      padding: '100px 20px',
      color: brand.muted
    }
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ border: `4px solid ${brand.border}`, borderTop: `4px solid ${brand.orange}`, borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p style={{ fontWeight: '600', color: brand.primary }}>Đang tìm sản phẩm cho bạn...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!filters?.category_slug) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <h2 style={{ color: brand.primary }}>Chào mừng bạn đến với Hometic</h2>
          <p>Vui lòng chọn một danh mục để xem các thiết bị thông minh.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{categoryName}</h1>

      {products.length > 0 ? (
        <div style={styles.grid}>
          {products.map((product) => {
            const isHovered = hoveredId === product.id;
            const hasSale = !!product.sale_price;

            return (
              <div
                key={product.id}
                style={{
                  ...styles.card,
                  transform: isHovered ? 'translateY(-10px)' : 'none',
                  boxShadow: isHovered ? '0 20px 40px rgba(35, 74, 74, 0.1)' : '0 4px 15px rgba(35, 74, 74, 0.03)'
                }}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleProductClick(product)}
              >
                {hasSale && <div style={styles.ribbon}>SALE</div>}

                <div style={styles.imageContainer}>
                  <img
                    src={product.image_url || "https://via.placeholder.com/300?text=Hometic"}
                    alt={product.name}
                    style={{
                      ...styles.image,
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)'
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={styles.productName}>{product.name}</div>

                  {/* PHẦN GIÁ ĐỒNG BỘ: HIỆN CẢ 2 GIÁ NẾU CÓ SALE */}
                  <div style={styles.priceContainer}>
                    <div style={styles.activePrice}>
                      {formatVnd(product.sale_price || product.price)}
                    </div>
                    {hasSale && (
                      <div style={styles.oldPrice}>
                        {formatVnd(product.price)}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  style={styles.btn(isHovered)}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  Mua ngay
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <h3>Danh mục này hiện chưa có sản phẩm.</h3>
          <button
            onClick={() => setActiveTab("shop")}
            style={{
              marginTop: '20px', padding: '15px 30px',
              backgroundColor: brand.primary, color: 'white',
              border: 'none', borderRadius: '12px',
              fontWeight: '700', cursor: 'pointer'
            }}
          >
            QUAY LẠI CỬA HÀNG
          </button>
        </div>
      )}
    </div>
  );
}
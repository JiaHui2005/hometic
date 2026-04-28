import React, { useState, useEffect } from "react";
import { formatVnd } from "../constants";
import { catalogService } from "../services/api";

export default function CategoryDetail({ categories, filters, addToCart, setActiveTab, setSelectedProduct }) {
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

    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // Lấy danh sách sản phẩm (đã bao gồm cả sp của danh mục con từ backend)
        const data = await catalogService.getProductsByCategory(filters.category_slug);
        setProducts(data || []);

        // Ưu tiên lấy tên từ danh sách categories (có dấu) dựa trên slug
        const targetCategory = categories?.find(c => c.slug === filters.category_slug);
        if (targetCategory) {
          setCategoryName(targetCategory.name);
        } else if (data && data.length > 0) {
          // Fallback: Nếu không tìm thấy trong list categories, lấy từ sản phẩm
          const currentCat = data.find(p => p.category.slug === filters.category_slug);
          if (currentCat) {
            setCategoryName(currentCat.category.name);
          } else {
            setCategoryName(filters.category_slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
          }
        } else {
          setCategoryName("Danh mục sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu danh mục:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [filters?.category_slug]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setActiveTab("product_detail");
  };

  // Logic nhóm sản phẩm theo danh mục
  const groupedProducts = products.reduce((acc, product) => {
    const catName = product.category.name;
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

  const styles = {
    container: {
      backgroundColor: brand.bg,
      minHeight: '100vh',
      padding: '40px 5% 100px',
      color: brand.text,
      fontFamily: '"Outfit", "Inter", sans-serif'
    },
    title: {
      fontSize: '42px',
      fontWeight: '900',
      color: brand.primary,
      marginBottom: '60px',
      textAlign: 'center',
      letterSpacing: '-1px'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '800',
      color: brand.primary,
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    sectionDivider: {
      flex: 1,
      height: '2px',
      backgroundColor: brand.border,
      borderRadius: '2px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '30px',
      marginBottom: '80px' // Khoảng cách giữa các danh mục con
    },
    card: {
      backgroundColor: brand.white,
      borderRadius: '24px',
      padding: '24px',
      border: `1px solid ${brand.border}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      boxShadow: '0 4px 20px rgba(35, 74, 74, 0.04)'
    },
    ribbon: {
      position: 'absolute',
      top: '25px',
      left: '25px',
      backgroundColor: brand.orange,
      color: brand.white,
      padding: '5px 12px',
      borderRadius: '10px',
      fontSize: '11px',
      fontWeight: '900',
      zIndex: 1,
      boxShadow: '0 4px 10px rgba(218, 143, 72, 0.3)'
    },
    imageContainer: {
      width: '100%',
      aspectRatio: '1/1',
      borderRadius: '18px',
      overflow: 'hidden',
      marginBottom: '20px',
      backgroundColor: '#f8f8f8'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.6s ease'
    },
    productName: {
      fontSize: '17px',
      fontWeight: '700',
      color: brand.text,
      marginBottom: '10px',
      lineHeight: '1.4',
      height: '48px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    priceContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      marginBottom: '20px'
    },
    activePrice: {
      fontSize: '22px',
      fontWeight: '900',
      color: brand.primary
    },
    oldPrice: {
      fontSize: '14px',
      color: brand.muted,
      textDecoration: 'line-through'
    },
    btn: (isHovered) => ({
      width: '100%',
      padding: '16px',
      borderRadius: '14px',
      fontWeight: '900',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: `2px solid ${brand.orange}`,
      backgroundColor: isHovered ? brand.orange : 'transparent',
      color: isHovered ? brand.white : brand.orange,
      textTransform: 'uppercase',
      letterSpacing: '1px'
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
          <div style={{ border: `4px solid ${brand.border}`, borderTop: `4px solid ${brand.orange}`, borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite', margin: '0 auto 25px' }}></div>
          <p style={{ fontWeight: '800', color: brand.primary, fontSize: '18px' }}>Đang sắp xếp kệ hàng...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const categoryEntries = Object.entries(groupedProducts);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{categoryName}</h1>

      {categoryEntries.length > 0 ? (
        categoryEntries.map(([catName, catProducts]) => (
          <div key={catName} style={{ marginBottom: '20px' }}>
            {/* Hiển thị tiêu đề danh mục con nếu có nhiều hơn 1 danh mục hoặc tên khác tiêu đề chính */}
            {(categoryEntries.length > 1 || catName !== categoryName) && (
              <div style={styles.sectionTitle}>
                <span>{catName}</span>
                <div style={styles.sectionDivider}></div>
              </div>
            )}

            <div style={styles.grid}>
              {catProducts.map((product) => {
                const isHovered = hoveredId === product.id;
                const hasSale = !!product.sale_price;

                return (
                  <div
                    key={product.id}
                    style={{
                      ...styles.card,
                      transform: isHovered ? 'translateY(-12px)' : 'none',
                      boxShadow: isHovered ? '0 25px 50px rgba(35, 74, 74, 0.12)' : '0 4px 20px rgba(35, 74, 74, 0.04)',
                      borderColor: isHovered ? brand.orange : brand.border
                    }}
                    onMouseEnter={() => setHoveredId(product.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleProductClick(product)}
                  >
                    {hasSale && <div style={styles.ribbon}>-{Math.round((1 - product.sale_price / product.price) * 100)}%</div>}

                    <div style={styles.imageContainer}>
                      <img
                        src={product.image_url || "https://via.placeholder.com/400?text=Hometic"}
                        alt={product.name}
                        style={{
                          ...styles.image,
                          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                        }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={styles.productName}>{product.name}</div>
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
                      Thêm vào giỏ
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div style={styles.emptyState}>
          <h3 style={{ fontSize: '24px', fontWeight: '800' }}>Danh mục này hiện chưa có sản phẩm.</h3>
          <p style={{ marginTop: '10px', marginBottom: '30px' }}>Chúng tôi sẽ cập nhật các thiết bị mới sớm nhất có thể.</p>
          <button
            onClick={() => setActiveTab("shop")}
            style={{
              padding: '18px 40px',
              backgroundColor: brand.primary, color: 'white',
              border: 'none', borderRadius: '16px',
              fontWeight: '900', cursor: 'pointer',
              fontSize: '15px', textTransform: 'uppercase', letterSpacing: '1px'
            }}
          >
            QUAY LẠI CỬA HÀNG
          </button>
        </div>
      )}
    </div>
  );
}
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
    muted: "#666",
    border: "#d1cec7"
  };

  // Hiệu ứng gọi API khi slug thay đổi
  useEffect(() => {
    // Nếu không có slug thì không gọi API và reset danh sách
    if (!filters?.category_slug) {
      setProducts([]);
      setCategoryName("Cửa hàng");
      return;
    }

    const fetchProductsByCategory = async () => {
      setLoading(true);
      try {
        // Gọi API dựa trên category_slug truyền từ Header
        // Endpoint: /products/category/{slug}
        const data = await catalogService.getProducts(`/category/${filters.category_slug}`);

        setProducts(data || []);

        // Cập nhật tên danh mục hiển thị từ dữ liệu trả về
        if (data && data.length > 0 && data[0].category) {
          setCategoryName(data[0].category.name);
        } else {
          // Nếu mảng rỗng, có thể lấy tên từ chính slug (format lại) hoặc giữ mặc định
          setCategoryName("Danh mục sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
        setProducts([]);
      } finally {
        // Quan trọng: Luôn tắt loading kể cả khi lỗi
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
      fontSize: '36px',
      fontWeight: '900',
      color: brand.primary,
      marginBottom: '40px',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '25px',
      marginBottom: '60px'
    },
    card: {
      backgroundColor: brand.white,
      borderRadius: '16px',
      padding: '15px',
      border: `1px solid ${brand.border}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative'
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
      objectFit: 'cover',
      transition: 'transform 0.5s ease'
    },
    productName: {
      fontSize: '15px',
      fontWeight: '600',
      color: brand.text,
      marginBottom: '8px',
      lineHeight: '1.4',
      height: '42px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    priceValue: {
      fontSize: '18px',
      fontWeight: '800',
      color: brand.orange,
      marginBottom: '15px'
    },
    btn: (isHovered) => ({
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      fontWeight: '700',
      fontSize: '13px',
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

  // 1. Trạng thái đang tải
  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ border: `4px solid ${brand.border}`, borderTop: `4px solid ${brand.orange}`, borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p style={{ fontWeight: '600', color: brand.primary }}>Đang tìm sản phẩm tốt nhất cho bạn...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 2. Trạng thái chưa chọn danh mục
  if (!filters?.category_slug) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <h2>Chào mừng bạn đến với Hometic</h2>
          <p>Vui lòng chọn một danh mục phía trên để xem các sản phẩm gia dụng thông minh.</p>
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
            return (
              <div
                key={product.id}
                style={{
                  ...styles.card,
                  transform: isHovered ? 'translateY(-10px)' : 'none',
                  boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.08)' : 'none'
                }}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleProductClick(product)}
              >
                <div style={styles.imageContainer}>
                  <img
                    src={product.image_url || "https://via.placeholder.com/300?text=Hometic"}
                    alt={product.name}
                    style={{
                      ...styles.image,
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={styles.productName}>{product.name}</div>
                  <div style={styles.priceValue}>{formatVnd(product.price)}</div>
                </div>

                <button
                  style={styles.btn(isHovered)}
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn việc nhảy vào trang chi tiết khi bấm nút mua
                    addToCart(product);
                  }}
                >
                  Thêm vào giỏ
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <h3>Ôi! Danh mục này hiện chưa có sản phẩm.</h3>
          <p>Bạn hãy thử quay lại sau hoặc xem các danh mục khác nhé.</p>
          <button
            onClick={() => setActiveTab("shop")}
            style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: brand.primary, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Quay lại cửa hàng
          </button>
        </div>
      )}
    </div>
  );
}
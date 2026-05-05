import React, { useState, useEffect, useMemo } from "react";
import { formatVnd } from "../constants";
import { catalogService, getImgUrl } from "../services/api";
import alertService from "../services/alertService";
import { Filter, X, ChevronDown, Check, RotateCcw, Tag } from "lucide-react";

export default function CategoryDetail({ categories, filters, addToCart, setActiveTab, setSelectedProduct }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("Cửa hàng");

  // State để theo dõi kích thước màn hình
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  // States cho bộ lọc
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Breakpoints xác định thiết bị
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth <= 1024;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hệ màu đồng bộ Hometic (Giữ nguyên)
  const brand = {
    bg: "#f9f5ed",
    primary: "#234a4a",
    orange: "#da8f48",
    white: "#ffffff",
    text: "#1a1a1a",
    muted: "#71717a",
    border: "#e5e1d8",
    glass: "rgba(255, 255, 255, 0.8)",
    btnHover: "#3A3939"
  };

  // Logic Fetch Data (Giữ nguyên)
  useEffect(() => {
    if (!filters?.category_slug) {
      setProducts([]);
      setCategoryName("Cửa hàng");
      return;
    }

    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const data = await catalogService.getProductsByCategory(filters.category_slug);
        setProducts(data || []);

        const targetCategory = categories?.find(c => c.slug === filters.category_slug);
        if (targetCategory) {
          setCategoryName(targetCategory.name);
        } else if (data && data.length > 0) {
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
  }, [filters?.category_slug, categories]);

  // Logic Filtering & Grouping (Giữ nguyên)
  const availableBrands = useMemo(() => {
    const brands = products.map(p => p.brand || "Hometic");
    return [...new Set(brands)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const price = p.sale_price || p.price;
      const matchPrice = price >= priceRange.min && price <= priceRange.max;
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand || "Hometic");
      return matchPrice && matchBrand;
    });
  }, [products, priceRange, selectedBrands]);

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const catName = product.category.name;
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setActiveTab("product_detail");
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    setActiveTab("cart");
    alertService.success(`Đã thêm thành công "${product.name}" vào giỏ hàng!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBrandToggle = (brandName) => {
    setSelectedBrands(prev =>
      prev.includes(brandName)
        ? prev.filter(b => b !== brandName)
        : [...prev, brandName]
    );
  };

  // Render Sidebar Content để dùng chung cho Desktop và Mobile
  const renderFilters = () => (
    <>
      <div style={styles.filterCard}>
        <div style={styles.filterHeader}>
          <div style={styles.filterIconCircle}><Tag size={18} /></div>
          <span style={styles.filterTitle}>Khoảng giá</span>
        </div>

        <div style={styles.priceInputWrapper}>
          <div className="price-field-focus" style={styles.priceField}>
            <span style={styles.priceLabel}>Từ</span>
            <input
              style={styles.priceInput}
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value === "" ? "" : Number(e.target.value) }))}
            />
            <span style={styles.priceUnit}>đ</span>
          </div>
          <div className="price-field-focus" style={styles.priceField}>
            <span style={styles.priceLabel}>Đến</span>
            <input
              style={styles.priceInput}
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value === "" ? "" : Number(e.target.value) }))}
            />
            <span style={styles.priceUnit}>đ</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          {[5000000, 15000000, 30000000].map(val => (
            <div
              key={val}
              onClick={() => setPriceRange({ min: 0, max: val })}
              style={styles.quickPriceTag(priceRange.max === val)}
            >
              &lt; {val / 1000000}Tr
            </div>
          ))}
        </div>
      </div>

      <div style={styles.filterCard}>
        <div style={styles.filterHeader}>
          <div style={styles.filterIconCircle}><Check size={18} /></div>
          <span style={styles.filterTitle}>Thương hiệu</span>
        </div>
        <div style={styles.brandList} className="custom-scrollbar">
          {availableBrands.map(b => (
            <div key={b} style={styles.brandItem(selectedBrands.includes(b))} onClick={() => handleBrandToggle(b)}>
              <span style={{
                color: selectedBrands.includes(b) ? brand.primary : brand.muted,
                fontWeight: selectedBrands.includes(b) ? '800' : '500',
                fontSize: '15px'
              }}>{b}</span>
              <div style={styles.checkbox(selectedBrands.includes(b))}>
                {selectedBrands.includes(b) && <Check size={14} color="white" strokeWidth={3} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => { setPriceRange({ min: 0, max: 50000000 }); setSelectedBrands([]); setShowMobileFilters(false); }}
        style={styles.resetBtn}
      >
        <RotateCcw size={18} />
        LÀM MỚI BỘ LỌC
      </button>
    </>
  );

  const styles = {
    container: {
      backgroundColor: brand.bg,
      minHeight: '100vh',
      padding: isMobile ? '20px 15px 80px' : '40px 5% 100px',
      color: brand.text,
      fontFamily: '"Outfit", "Inter", sans-serif'
    },
    layout: {
      display: 'flex',
      flexDirection: isTablet ? 'column' : 'row',
      gap: isTablet ? '20px' : '40px',
      position: 'relative'
    },
    mobileFilterTrigger: {
      display: isTablet ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '15px',
      backgroundColor: brand.white,
      borderRadius: '16px',
      border: `1px solid ${brand.border}`,
      marginBottom: '20px',
      fontWeight: '800',
      cursor: 'pointer'
    },
    sidebar: {
      width: isTablet ? '100%' : '300px',
      flexShrink: 0,
      display: isTablet ? 'none' : 'block'
    },
    mobileDrawer: {
      position: 'fixed',
      top: 0,
      left: showMobileFilters ? 0 : '-100%',
      width: '100%',
      height: '100%',
      backgroundColor: brand.bg,
      zIndex: 1000,
      padding: '20px',
      transition: 'left 0.3s ease',
      overflowY: 'auto'
    },
    content: { flex: 1 },
    filterCard: {
      backgroundColor: brand.white,
      borderRadius: '24px',
      padding: '28px',
      marginBottom: '24px',
      border: `1px solid ${brand.border}`,
      boxShadow: '0 10px 30px rgba(35, 74, 74, 0.02)',
    },
    filterHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
    filterIconCircle: {
      width: '36px', height: '36px', borderRadius: '12px',
      backgroundColor: `${brand.primary}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: brand.primary
    },
    filterTitle: { fontSize: '14px', fontWeight: '800', color: brand.text, textTransform: 'uppercase', letterSpacing: '1px' },
    priceInputWrapper: { display: 'flex', flexDirection: 'column', gap: '12px' },
    priceField: {
      display: 'flex', alignItems: 'center', backgroundColor: "#f2efe6", borderRadius: '16px',
      padding: '0 16px', border: `1px solid transparent`, transition: '0.3s ease', height: '52px'
    },
    priceLabel: { fontSize: '13px', fontWeight: '700', color: brand.text, marginRight: '8px' },
    priceInput: { flex: 1, background: 'none', border: 'none', fontSize: '15px', fontWeight: '800', outline: 'none', width: '100%' },
    priceUnit: { fontSize: '13px', fontWeight: '700', color: brand.muted },
    quickPriceTag: (active) => ({
      padding: '10px 12px', fontSize: '12px', fontWeight: '800', borderRadius: '12px', cursor: 'pointer',
      backgroundColor: active ? brand.orange : brand.white, color: active ? brand.white : brand.text,
      border: `1px solid ${active ? brand.orange : brand.border}`, flex: '1 1 calc(33% - 8px)', textAlign: 'center'
    }),
    brandList: { maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' },
    brandItem: (active) => ({
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px',
      borderRadius: '14px', cursor: 'pointer', backgroundColor: active ? `${brand.orange}10` : 'transparent',
    }),
    checkbox: (active) => ({
      width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${active ? brand.orange : brand.border}`,
      backgroundColor: active ? brand.orange : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }),
    resetBtn: {
      width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
      backgroundColor: 'transparent', border: `2px dashed ${brand.border}`, color: brand.muted, borderRadius: '20px',
      fontWeight: '800', fontSize: '14px', cursor: 'pointer'
    },
    title: {
      fontSize: isMobile ? '24px' : '32px', fontWeight: '900', color: brand.text,
      marginBottom: isMobile ? '20px' : '40px', letterSpacing: '-0.5px', textAlign: isMobile ? 'center' : 'left'
    },
    grid: {
      display: 'grid',
      // Responsive Grid: 1 cột cho mobile, 2 cột cho tablet/laptop nhỏ, 3-4 cho PC
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(230px, 1fr))',
      gap: isMobile ? '16px' : '25px',
      marginBottom: '60px'
    },
    card: {
      backgroundColor: brand.white, borderRadius: '16px', border: `1px solid ${brand.border}`,
      display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', cursor: 'pointer',
      position: 'relative', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    cardImage: { width: '100%', height: isMobile ? '180px' : '220px', objectFit: 'cover' },
    cardBody: { padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
    cardName: {
      fontSize: '15px', fontWeight: '700', color: brand.text, display: '-webkit-box',
      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4', height: '42px'
    },
    cardDesc: { fontSize: '12px', color: brand.muted },
    activePrice: { fontSize: '17px', fontWeight: '800', color: brand.text },
    oldPrice: { fontSize: '12px', color: brand.muted, textDecoration: 'line-through' },
    ribbon: {
      position: 'absolute', top: '10px', left: '10px', backgroundColor: brand.orange,
      color: brand.white, padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', zIndex: 1
    },
    btn: (isHovered) => ({
      width: '100%', padding: '12px', borderRadius: '10px', fontWeight: '700', fontSize: '14px',
      cursor: 'pointer', transition: 'all 0.3s ease',
      backgroundColor: isHovered ? brand.btnHover : brand.orange,
      color: brand.white, marginTop: '10px', border: 'none'
    }),
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ border: `4px solid ${brand.border}`, borderTop: `4px solid ${brand.orange}`, borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p style={{ fontWeight: '800', color: brand.text }}>Đang chuẩn bị sản phẩm...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const categoryEntries = Object.entries(groupedProducts);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{categoryName}</h1>

      {/* Mobile Filter Trigger */}
      <div style={styles.mobileFilterTrigger} onClick={() => setShowMobileFilters(true)}>
        <Filter size={18} />
        BỘ LỌC SẢN PHẨM
      </div>

      {/* Mobile Filter Drawer */}
      <div style={styles.mobileDrawer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontWeight: '900', fontSize: '18px' }}>BỘ LỌC</span>
          <X onClick={() => setShowMobileFilters(false)} style={{ cursor: 'pointer' }} />
        </div>
        {renderFilters()}
        <button
          style={{ ...styles.btn(false), padding: '18px', marginTop: '20px', borderRadius: '16px' }}
          onClick={() => setShowMobileFilters(false)}
        >
          ÁP DỤNG
        </button>
      </div>

      <div style={styles.layout}>
        {/* Desktop Sidebar */}
        <aside style={styles.sidebar}>
          {renderFilters()}
        </aside>

        {/* Nội dung sản phẩm */}
        <main style={styles.content}>
          {categoryEntries.length > 0 ? (
            categoryEntries.map(([catName, catProducts]) => (
              <div key={catName}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                  <span style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', color: brand.text }}>{catName}</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: brand.border }}></div>
                </div>

                <div style={styles.grid}>
                  {catProducts.map((product) => {
                    const isHovered = hoveredId === product.id;
                    return (
                      <article
                        key={product.id}
                        style={{
                          ...styles.card,
                          transform: (!isMobile && isHovered) ? 'translateY(-5px)' : 'none'
                        }}
                        onMouseEnter={() => setHoveredId(product.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => handleProductClick(product)}
                      >
                        {product.sale_price && <div style={styles.ribbon}>GIẢM GIÁ</div>}
                        <img
                          src={getImgUrl(product.image_url) || "https://via.placeholder.com/400"}
                          alt={product.name}
                          style={styles.cardImage}
                        />
                        <div style={styles.cardBody}>
                          <h3 style={styles.cardName}>{product.name}</h3>
                          <span style={styles.cardDesc}>{product.brand || "Hometic"}</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', margin: '5px 0' }}>
                            <strong style={styles.activePrice}>{formatVnd(product.sale_price || product.price)}</strong>
                            {product.sale_price && <span style={styles.oldPrice}>{formatVnd(product.price)}</span>}
                          </div>
                          <button
                            style={styles.btn(isHovered)}
                            onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}
                          >
                            Mua ngay
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: brand.primary }}>Không tìm thấy sản phẩm</h3>
              <p style={{ color: brand.muted }}>Thử thay đổi bộ lọc hoặc xem danh mục khác bạn nhé.</p>
            </div>
          )}
        </main>
      </div>

      <style>{`
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        .price-field-focus:focus-within { border-color: #da8f48 !important; background-color: #ffffff !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e1d8; border-radius: 10px; }
      `}</style>
    </div>
  );
}
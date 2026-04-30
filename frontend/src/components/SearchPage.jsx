import React, { useState, useMemo } from "react";
import { formatVnd } from "../constants";
import alertService from "../services/alertService";
import { Search, Tag, Check, RotateCcw, Package, ArrowRight } from "lucide-react";

export default function SearchPage({ products, filters, setFilters, addToCart, setActiveTab, setSelectedProduct }) {
  const [hoveredId, setHoveredId] = useState(null);
  
  // States cho bộ lọc
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Hệ màu đồng bộ Hometic
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

  const styles = {
    container: {
      backgroundColor: brand.bg,
      minHeight: '100vh',
      padding: '40px 5% 100px',
      color: brand.text,
      fontFamily: '"Outfit", "Inter", sans-serif'
    },
    header: {
      marginBottom: '40px'
    },
    title: {
      fontSize: '36px',
      fontWeight: '900',
      color: brand.primary,
      margin: '0 0 10px 0',
      letterSpacing: '-1px'
    },
    subtitle: {
      fontSize: '16px',
      color: brand.muted,
      fontWeight: '500'
    },
    layout: {
      display: 'flex',
      gap: '40px',
    },
    sidebar: {
      width: '300px',
      flexShrink: 0,
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
    filterHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
    },
    filterIconCircle: {
      width: '36px',
      height: '36px',
      borderRadius: '12px',
      backgroundColor: `${brand.primary}08`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: brand.primary
    },
    filterTitle: {
      fontSize: '16px',
      fontWeight: '800',
      color: brand.text,
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    priceField: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: "#f2efe6",
      borderRadius: '16px',
      padding: '0 16px',
      height: '56px',
      marginBottom: '12px'
    },
    priceInput: {
      flex: 1,
      background: 'none',
      border: 'none',
      fontSize: '15px',
      fontWeight: '800',
      color: brand.text,
      outline: 'none'
    },
    brandItem: (active) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      borderRadius: '14px',
      cursor: 'pointer',
      backgroundColor: active ? `${brand.orange}10` : 'transparent',
      marginBottom: '4px'
    }),
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '25px',
    },
    card: {
      backgroundColor: brand.white,
      borderRadius: '24px',
      padding: '15px',
      border: `1px solid ${brand.border}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
    },
    cardImage: {
      width: '100%',
      height: '240px',
      objectFit: 'cover',
      borderRadius: '18px',
      marginBottom: '15px'
    },
    cardBody: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    cardName: {
      fontSize: '18px',
      fontWeight: '800',
      color: brand.text,
      margin: 0,
      lineHeight: '1.3'
    },
    activePrice: {
      fontSize: '20px',
      fontWeight: '900',
      color: brand.orange
    },
    emptyState: {
      textAlign: 'center',
      padding: '100px 20px',
      backgroundColor: brand.white,
      borderRadius: '32px',
      border: `1px solid ${brand.border}`
    },
    searchBox: {
      display: 'flex',
      backgroundColor: brand.white,
      borderRadius: '20px',
      padding: '10px 20px',
      border: `2px solid ${brand.primary}`,
      marginBottom: '40px',
      alignItems: 'center',
      gap: '15px',
      boxShadow: '0 10px 25px rgba(35, 74, 74, 0.1)'
    },
    searchInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: '18px',
      fontWeight: '600',
      color: brand.primary,
      background: 'transparent'
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.searchBox}>
          <Search size={24} color={brand.primary} />
          <input 
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm thông minh..."
            value={filters?.q || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
          />
          {filters?.q && (
            <div style={{ color: brand.muted, fontSize: '14px', fontWeight: '700' }}>
              Tìm thấy {filteredProducts.length} kết quả
            </div>
          )}
        </div>
        
        <h1 style={styles.title}>
          {filters?.q ? `Kết quả cho "${filters.q}"` : "Tất cả sản phẩm"}
        </h1>
        <p style={styles.subtitle}>Khám phá hệ sinh thái thiết bị Hometic cao cấp nhất.</p>
      </header>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.filterCard}>
            <div style={styles.filterHeader}>
              <div style={styles.filterIconCircle}><Tag size={18} /></div>
              <span style={styles.filterTitle}>Lọc theo giá</span>
            </div>
            <div style={styles.priceField}>
              <input 
                style={styles.priceInput} 
                type="number" 
                value={priceRange.min} 
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
              />
              <span style={{ fontWeight: '800', color: brand.muted }}>đ</span>
            </div>
            <div style={styles.priceField}>
              <input 
                style={styles.priceInput} 
                type="number" 
                value={priceRange.max} 
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
              />
              <span style={{ fontWeight: '800', color: brand.muted }}>đ</span>
            </div>
          </div>

          <div style={styles.filterCard}>
            <div style={styles.filterHeader}>
              <div style={styles.filterIconCircle}><Check size={18} /></div>
              <span style={styles.filterTitle}>Thương hiệu</span>
            </div>
            {availableBrands.map(b => (
              <div key={b} style={styles.brandItem(selectedBrands.includes(b))} onClick={() => handleBrandToggle(b)}>
                <span style={{ fontWeight: '700' }}>{b}</span>
                {selectedBrands.includes(b) && <Check size={16} color={brand.orange} />}
              </div>
            ))}
          </div>

          <button 
            style={{ ...styles.filterCard, width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: brand.muted, fontWeight: '800' }}
            onClick={() => { setPriceRange({ min: 0, max: 50000000 }); setSelectedBrands([]); }}
          >
            <RotateCcw size={18} /> LÀM MỚI BỘ LỌC
          </button>
        </aside>

        <main style={styles.content}>
          {filteredProducts.length > 0 ? (
            <div style={styles.grid}>
              {filteredProducts.map(product => (
                <article 
                  key={product.id} 
                  style={{
                    ...styles.card,
                    transform: hoveredId === product.id ? 'translateY(-10px)' : 'none'
                  }}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleProductClick(product)}
                >
                  <img src={product.image_url} alt={product.name} style={styles.cardImage} />
                  <div style={styles.cardBody}>
                    <h3 style={styles.cardName}>{product.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                      <strong style={styles.activePrice}>{formatVnd(product.sale_price || product.price)}</strong>
                      {product.sale_price && (
                        <span style={{ textDecoration: 'line-through', color: brand.muted, fontSize: '14px' }}>
                          {formatVnd(product.price)}
                        </span>
                      )}
                    </div>
                    <button 
                      style={{
                        marginTop: '15px', padding: '12px', borderRadius: '14px', border: 'none',
                        backgroundColor: hoveredId === product.id ? brand.primary : brand.orange,
                        color: 'white', fontWeight: '800', cursor: 'pointer', transition: '0.3s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                      }}
                      onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}
                    >
                      MUA NGAY <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <Package size={64} color={brand.border} style={{ marginBottom: '20px' }} />
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: brand.primary }}>Không tìm thấy sản phẩm nào</h2>
              <p style={{ color: brand.muted, maxWidth: '400px', margin: '10px auto 30px' }}>
                Chúng tôi không tìm thấy sản phẩm nào khớp với tìm kiếm của bạn. Vui lòng thử từ khóa khác hoặc xóa bộ lọc.
              </p>
              <button 
                style={{ padding: '15px 30px', borderRadius: '15px', backgroundColor: brand.primary, color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer' }}
                onClick={() => setFilters({ q: "", category_slug: "" })}
              >
                XEM TẤT CẢ SẢN PHẨM
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

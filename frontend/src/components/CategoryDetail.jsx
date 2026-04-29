import React, { useState, useEffect, useMemo } from "react";
import { formatVnd } from "../constants";
import { catalogService } from "../services/api";
import { Filter, X, ChevronDown, Check, RotateCcw, Tag } from "lucide-react";

export default function CategoryDetail({ categories, filters, addToCart, setActiveTab, setSelectedProduct }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("Cửa hàng");

  // States cho bộ lọc
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
  }, [filters?.category_slug]);

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
    layout: {
      display: 'flex',
      gap: '40px',
      position: 'relative'
    },
    sidebar: {
      width: '300px',
      flexShrink: 0,
      display: window.innerWidth <= 1024 ? 'none' : 'block'
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
    priceInputWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    priceField: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: "#f2efe6", // Màu nền nhẹ hơn cho input
      borderRadius: '16px',
      padding: '0 16px',
      border: `1px solid transparent`,
      transition: '0.3s ease',
      height: '56px'
    },
    priceLabel: {
      fontSize: '13px',
      fontWeight: '700',
      color: brand.text,
      marginRight: '8px',
      whiteSpace: 'nowrap'
    },
    priceInput: {
      flex: 1,
      background: 'none',
      border: 'none',
      fontSize: '15px',
      fontWeight: '800',
      color: brand.text,
      outline: 'none',
      width: '100%',
      fontFamily: 'inherit',
      textAlign: 'left'
    },
    priceUnit: {
      fontSize: '13px',
      fontWeight: '700',
      color: brand.muted,
      marginLeft: '8px'
    },
    quickPriceTag: (active) => ({
      padding: '10px 12px',
      fontSize: '13px',
      fontWeight: '800',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: '0.2s',
      backgroundColor: active ? brand.orange : brand.white,
      color: active ? brand.white : brand.text,
      border: `1px solid ${active ? brand.orange : brand.border}`,
      flex: 1,
      textAlign: 'center'
    }),
    brandList: {
      maxHeight: '260px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    brandItem: (active) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      borderRadius: '14px',
      cursor: 'pointer',
      transition: '0.2s',
      backgroundColor: active ? `${brand.orange}10` : 'transparent',
    }),
    checkbox: (active) => ({
      width: '20px',
      height: '20px',
      borderRadius: '6px',
      border: `2px solid ${active ? brand.orange : brand.border}`,
      backgroundColor: active ? brand.orange : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: '0.2s'
    }),
    resetBtn: {
      width: '100%',
      padding: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      backgroundColor: 'transparent',
      border: `2px dashed ${brand.border}`,
      color: brand.muted,
      borderRadius: '20px',
      fontWeight: '800',
      fontSize: '14px',
      cursor: 'pointer',
      transition: '0.3s'
    },
    title: {
      fontSize: '32px',
      fontWeight: '900',
      color: brand.text,
      marginBottom: '40px',
      letterSpacing: '-0.5px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '25px',
      marginBottom: '60px'
    },
    card: {
      backgroundColor: brand.white,
      borderRadius: '16px',
      padding: '0',
      border: `1px solid ${brand.border}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    cardImage: {
      width: '100%',
      height: '220px',
      objectFit: 'cover',
      cursor: 'pointer'
    },
    cardBody: {
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      flex: 1
    },
    cardName: {
      fontSize: '16px',
      fontWeight: '700',
      color: brand.text,
      cursor: 'pointer',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      lineHeight: '1.4',
      height: '45px',
      margin: 0
    },
    cardDesc: {
      fontSize: '13px',
      color: brand.muted
    },
    cardPrice: {
      fontSize: '18px',
      fontWeight: '800',
      color: brand.text,
      marginTop: '5px'
    },
    priceContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      margin: '5px 0'
    },
    activePrice: {
      fontSize: '18px',
      fontWeight: '800',
      color: brand.text
    },
    oldPrice: {
      fontSize: '13px',
      color: brand.muted,
      textDecoration: 'line-through',
      fontWeight: '500'
    },
    ribbon: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      backgroundColor: brand.orange,
      color: brand.white,
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '700',
      zIndex: 1
    },
    btn: (isHovered) => ({
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      fontWeight: '700',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: isHovered ? brand.btnHover : brand.orange,
      color: brand.white,
      marginTop: '10px',
      border: 'none',
      outline: 'none'
    }),
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ border: `4px solid ${brand.border}`, borderTop: `4px solid ${brand.orange}`, borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite', margin: '0 auto 25px' }}></div>
          <p style={{ fontWeight: '800', color: brand.text, fontSize: '18px' }}>Đang sắp xếp kệ hàng...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const categoryEntries = Object.entries(groupedProducts);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{categoryName}</h1>

      <div style={styles.layout}>
        {/* Sidebar Lọc */}
        <aside style={styles.sidebar}>
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
                  onChange={(e) => {
                    const val = e.target.value;
                    setPriceRange(prev => ({ ...prev, min: val === "" ? "" : Number(val) }))
                  }}
                />
                <span style={styles.priceUnit}>đ</span>
              </div>
              <div className="price-field-focus" style={styles.priceField}>
                <span style={styles.priceLabel}>Đến</span>
                <input
                  style={styles.priceInput}
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPriceRange(prev => ({ ...prev, max: val === "" ? "" : Number(val) }))
                  }}
                />
                <span style={styles.priceUnit}>đ</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
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
            onClick={() => { setPriceRange({ min: 0, max: 50000000 }); setSelectedBrands([]); }}
            style={styles.resetBtn}
          >
            <RotateCcw size={18} />
            LÀM MỚI BỘ LỌC
          </button>
        </aside>

        {/* Nội dung sản phẩm */}
        <main style={styles.content}>
          {categoryEntries.length > 0 ? (
            categoryEntries.map(([catName, catProducts]) => (
              <div key={catName}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                  <span style={{ fontSize: '22px', fontWeight: '800', color: brand.text }}>{catName}</span>
                  <div style={{ flex: 1, height: '2px', backgroundColor: brand.border, borderRadius: '2px' }}></div>
                </div>

                <div style={styles.grid}>
                  {catProducts.map((product) => {
                    const isHovered = hoveredId === product.id;
                    return (
                      <article
                        key={product.id}
                        style={{
                          ...styles.card,
                          transform: isHovered ? 'translateY(-5px)' : 'translateY(0)'
                        }}
                        onMouseEnter={() => setHoveredId(product.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        {product.sale_price && <div style={styles.ribbon}>GIẢM GIÁ</div>}
                        <img
                          src={product.image_url || "https://via.placeholder.com/400"}
                          alt={product.name}
                          style={styles.cardImage}
                          onClick={() => handleProductClick(product)}
                        />
                        <div style={styles.cardBody}>
                          <h3
                            style={styles.cardName}
                            onClick={() => handleProductClick(product)}
                          >
                            {product.name}
                          </h3>
                          <span style={styles.cardDesc}>
                            {product.brand || "Thiết bị gia dụng cao cấp"}
                          </span>
                          <div style={styles.priceContainer}>
                            <strong style={styles.activePrice}>
                              {formatVnd(product.sale_price || product.price)}
                            </strong>
                            {product.sale_price && (
                              <span style={styles.oldPrice}>
                                {formatVnd(product.price)}
                              </span>
                            )}
                          </div>
                          <button
                            style={styles.btn(isHovered)}
                            onMouseEnter={() => setHoveredId(product.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
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
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: brand.primary }}>Không tìm thấy sản phẩm</h3>
              <p style={{ color: brand.muted }}>Vui lòng điều chỉnh bộ lọc hoặc chọn danh mục khác.</p>
            </div>
          )}
        </main>
      </div>

      <style>{`
        /* Ẩn nút tăng giảm của input number */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
        
        .price-field-focus:focus-within {
          border-color: #da8f48 !important;
          background-color: #ffffff !important;
          box-shadow: 0 0 0 4px rgba(218, 143, 72, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e1d8; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #da8f48; }
      `}</style>
    </div>
  );
}
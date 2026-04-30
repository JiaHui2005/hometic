import React, { useState, useEffect } from "react";
import { LogOut, Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { catalogService } from "../services/api";

export default function Header({ user, cartCount, activeTab, setActiveTab, onLogout, filters, setFilters }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(filters?.q || "");
  const [expandedMobileCats, setExpandedMobileCats] = useState({});

  const defaultAvatar = "https://www.w3schools.com/howto/img_avatar.png";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await catalogService.getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh mục Header:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const parentCategories = categories.filter(cat => cat.parent_id === null);
  const getSubCategories = (parentId) => categories.filter(cat => cat.parent_id === parentId);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (filters?.q || "")) {
        setFilters(prev => ({ ...prev, q: searchTerm, category_slug: "" }));
        // Chỉ nhảy sang tab shop nếu đang ở các tab không liên quan đến sản phẩm
        if (!["shop", "category_detail", "product_detail"].includes(activeTab)) {
          setActiveTab("shop");
        }
      }
    }, 500); // Debounce 500ms
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      setFilters(prev => ({ ...prev, q: searchTerm, category_slug: "" }));
      if (!["shop", "category_detail"].includes(activeTab)) {
        setActiveTab("shop");
      }
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileCat = (id) => {
    setExpandedMobileCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const brand = {
    primary: "#008481",
    secondary: "#ed7f1a",
    text: "#133b3b",
    black: "#000000ff",
    muted: "#4b5563",
    glass: "rgba(155, 201, 199, 0.95)"
  };

  const styles = {
    header: {
      position: 'sticky', top: 0, zIndex: 1000, background: brand.glass, backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '0 20px' : '0 40px', height: '80px', width: '100%',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)', boxSizing: 'border-box'
    },
    brandContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      height: '100%'
    },
    nav: { display: isMobile ? 'none' : 'flex', height: '100%', gap: '5px' },
    navItem: { position: 'relative', display: 'flex', alignItems: 'center', height: '100%' },
    navBtn: (active) => ({
      background: 'transparent', color: brand.text, height: '100%', padding: '0 15px',
      fontSize: '15px', border: 'none', fontWeight: '600', cursor: 'pointer',
      backgroundColor: active ? 'rgba(255,255,255,0.2)' : 'transparent', transition: '0.2s'
    }),
    megaMenu: {
      position: 'absolute', top: '80px', left: '0',
      width: 'max-content', minWidth: '400px', background: 'white', borderRadius: '0 0 16px 16px',
      padding: '30px', display: 'none', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '30px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0', zIndex: 1001
    },
    actions: { display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px' },
    search: {
      display: isMobile ? 'none' : 'flex', alignItems: 'center', background: 'white',
      borderRadius: '20px', padding: '8px 16px', width: '220px', border: '1px solid rgba(0,0,0,0.1)'
    },
    searchInput: { background: 'transparent', border: 'none', padding: '0 8px', width: '100%', outline: 'none', fontSize: '13px' },
    cartBtn: { position: 'relative', background: 'transparent', border: 'none', padding: '8px', cursor: 'pointer', color: brand.text, display: 'flex', alignItems: 'center' },
    badge: {
      position: 'absolute', top: '-5px', right: '-5px', background: brand.secondary, color: 'white',
      fontSize: '10px', minWidth: '18px', height: '18px', borderRadius: '10px', display: 'grid', placeItems: 'center', fontWeight: '800'
    },
    userActions: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatarWrapper: {
      width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden',
      cursor: 'pointer', border: `2px solid white`, boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'white'
    },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },

    mobileToggle: { display: isMobile ? 'block' : 'none', background: 'transparent', border: 'none', padding: '5px', cursor: 'pointer', color: brand.text },
    mobileMenu: {
      position: 'fixed', top: '80px', left: 0, width: '100%', height: 'calc(100vh - 80px)',
      background: 'white', padding: '20px', zIndex: 999, display: isMobileMenuOpen ? 'flex' : 'none',
      flexDirection: 'column', gap: '10px', overflowY: 'auto', boxSizing: 'border-box'
    }
  };

  const handleCategoryClick = (slug) => {
    if (setFilters) {
      setFilters(prev => ({ ...prev, category_slug: slug, q: "" }));
      setActiveTab("category_detail");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header style={styles.header}>
        {/* LOGO BOX: logo1 bên trái logo2 */}
        <div style={{ ...styles.brandContainer, gap: '15px' }}
          onClick={() => {
            setActiveTab("shop");
            if (setFilters) {
              setFilters(prev => ({ ...prev, category_slug: "", q: "" }))
            }
            setSearchTerm("");
          }}
        >
          {/* Logo 1: Biểu tượng ngôi nhà - Tăng từ 40px lên 52px */}
          <div style={{
            position: 'relative',
            width: isMobile ? '35px' : '52px',
            height: isMobile ? '35px' : '52px',
            flexShrink: 0,
            transition: 'transform 0.3s ease' // Thêm hiệu ứng mượt khi hover
          }}>
            <img
              src="/logo1.png"
              alt="Hometic Icon"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Logo 2: Chữ Hometic - Tăng chiều cao từ 28px lên 38px để nhìn rõ hơn */}
          <div style={{
            height: isMobile ? '24px' : '38px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <img
              src="/logo2.png"
              alt="Hometic Brand"
              style={{
                height: '100%',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' // Thêm đổ bóng nhẹ cho chữ nổi bật
              }}
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={styles.nav}>
          {!loading && parentCategories.map((cat) => (
            <div key={cat.id} style={styles.navItem}
              onMouseEnter={(e) => { const menu = e.currentTarget.querySelector('.mega-menu-inline'); if (menu) menu.style.display = 'grid'; }}
              onMouseLeave={(e) => { const menu = e.currentTarget.querySelector('.mega-menu-inline'); if (menu) menu.style.display = 'none'; }}
            >
              <button style={styles.navBtn(activeTab === "category_detail" && filters?.category_slug === cat.slug)} onClick={() => handleCategoryClick(cat.slug)}>
                {cat.name}
              </button>
              <div className="mega-menu-inline" style={styles.megaMenu}>
                {getSubCategories(cat.id).map((sub) => (
                  <div key={sub.id}>
                    <h4
                      style={{ color: brand.black, fontSize: '15px', fontWeight: '800', marginBottom: '15px', cursor: 'pointer' }}
                      onClick={() => handleCategoryClick(sub.slug)}
                    >
                      {sub.name}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {getSubCategories(sub.id).map((grandSub) => (
                        <span
                          key={grandSub.id}
                          style={{ fontSize: '13px', color: brand.black, cursor: 'pointer', transition: '0.2s' }}
                          onMouseEnter={(e) => e.target.style.color = brand.secondary}
                          onMouseLeave={(e) => e.target.style.color = '#666'}
                          onClick={(e) => { e.stopPropagation(); handleCategoryClick(grandSub.slug); }}
                        >
                          {grandSub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div style={styles.actions}>
          <div style={styles.search}>
            <Search size={16} color={brand.muted} style={{ cursor: 'pointer' }} onClick={handleSearch} />
            <input
              style={styles.searchInput}
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <button style={styles.cartBtn} onClick={() => setActiveTab("cart")}>
            <ShoppingCart size={24} />
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </button>

          {user ? (
            <div style={styles.userActions}>
              <div style={styles.avatarWrapper} onClick={() => setActiveTab("profile")}>
                <img
                  src={user.avatar_url || defaultAvatar}
                  alt={user.full_name || "User"}
                  style={styles.avatarImg}
                  onError={(e) => { e.target.src = defaultAvatar; }}
                />
              </div>
              <button onClick={onLogout} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: brand.secondary, display: 'flex', alignItems: 'center' }} title="Đăng xuất">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              style={{ ...styles.navBtn(false), padding: '8px 18px', borderRadius: '20px', border: `1px solid ${brand.primary}`, height: 'auto', fontSize: '14px' }}
              onClick={() => setActiveTab("auth")}
            >
              Đăng nhập
            </button>
          )}

          <button style={styles.mobileToggle} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header >

      {/* Mobile Menu Overlay */}
      < div style={styles.mobileMenu} >
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 5px', borderBottom: '1px solid #eee', marginBottom: '10px' }} onClick={() => { setActiveTab("profile"); setIsMobileMenuOpen(false); }}>
            <div style={{ ...styles.avatarWrapper, width: '50px', height: '50px' }}>
              <img src={user.avatar_url || defaultAvatar} alt="User" style={styles.avatarImg} onError={(e) => { e.target.src = defaultAvatar; }} />
            </div>
            <div>
              <div style={{ fontWeight: '700', color: brand.text, fontSize: '16px' }}>{user.full_name}</div>
              <div style={{ fontSize: '13px', color: brand.muted }}>Xem trang cá nhân</div>
            </div>
          </div>
        )
        }

        <div style={{ display: 'flex', alignItems: 'center', background: '#f5f5f5', borderRadius: '12px', padding: '12px 15px', marginBottom: '10px' }}>
          <Search size={18} color="#999" onClick={handleSearch} />
          <input
            style={{ border: 'none', background: 'transparent', outline: 'none', paddingLeft: '10px', width: '100%', fontSize: '15px' }}
            placeholder="Bạn cần tìm gì?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {
          !loading && parentCategories.map((cat) => (
            <div key={cat.id} style={{ borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  style={{ flex: 1, background: 'none', border: 'none', padding: '15px 5px', textAlign: 'left', fontSize: '16px', fontWeight: '700', color: brand.text }}
                  onClick={() => handleCategoryClick(cat.slug)}
                >
                  {cat.name}
                </button>
                <button
                  style={{ background: 'none', border: 'none', padding: '10px' }}
                  onClick={() => toggleMobileCat(cat.id)}
                >
                  <ChevronDown size={20} style={{ transform: expandedMobileCats[cat.id] ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }} />
                </button>
              </div>

              {expandedMobileCats[cat.id] && (
                <div style={{ paddingLeft: '20px', paddingBottom: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {getSubCategories(cat.id).map(sub => (
                    <div key={sub.id}>
                      <div
                        style={{ fontWeight: '700', fontSize: '15px', color: brand.primary, padding: '5px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        onClick={() => handleCategoryClick(sub.slug)}
                      >
                        {sub.name}
                        {getSubCategories(sub.id).length > 0 && (
                          <button
                            style={{ background: 'none', border: 'none' }}
                            onClick={(e) => { e.stopPropagation(); toggleMobileCat(sub.id); }}
                          >
                            <ChevronDown size={16} style={{ transform: expandedMobileCats[sub.id] ? 'rotate(180deg)' : 'rotate(0)' }} />
                          </button>
                        )}
                      </div>
                      {expandedMobileCats[sub.id] && (
                        <div style={{ paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '5px' }}>
                          {getSubCategories(sub.id).map(grandSub => (
                            <span
                              key={grandSub.id}
                              style={{ fontSize: '14px', color: '#666', padding: '3px 0' }}
                              onClick={() => handleCategoryClick(grandSub.slug)}
                            >
                              {grandSub.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        }

        {
          !user ? (
            <button style={{ marginTop: '15px', background: brand.secondary, border: 'none', padding: '15px', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }} onClick={() => { setActiveTab("auth"); setIsMobileMenuOpen(false); }}>
              Đăng nhập / Đăng ký
            </button>
          ) : (
            <button style={{ marginTop: '15px', background: '#eee', border: 'none', padding: '15px', borderRadius: '12px', color: brand.text, fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={onLogout}>
              <LogOut size={18} />
              Đăng xuất
            </button>
          )
        }
      </div >
    </>
  );
} 
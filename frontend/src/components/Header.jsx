import React, { useState, useEffect } from "react";
import { LogOut, Search, ShoppingCart, Menu, X, ChevronDown, User as UserIcon } from "lucide-react"; // Import thêm UserIcon
import { catalogService } from "../services/api";

export default function Header({ user, cartCount, activeTab, setActiveTab, onLogout, filters, setFilters }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Link ảnh mặc định nếu user chưa có avatar
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

  const brand = {
    primary: "#008481",
    secondary: "#ed7f1a",
    text: "#133b3b",
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
    brand: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: brand.primary },
    logoText: { fontSize: isMobile ? '22px' : '26px', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 },
    nav: { display: isMobile ? 'none' : 'flex', height: '100%', gap: '5px' },
    navItem: { position: 'relative', display: 'flex', alignItems: 'center', height: '100%' },
    navBtn: (active) => ({
      background: 'transparent', color: brand.text, height: '100%', padding: '0 15px',
      fontSize: '15px', border: 'none', fontWeight: '600', cursor: 'pointer',
      backgroundColor: active ? 'rgba(255,255,255,0.2)' : 'transparent', transition: '0.2s'
    }),
    megaMenu: {
      position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)',
      width: 'max-content', minWidth: '250px', background: 'white', borderRadius: '0 0 16px 16px',
      padding: '25px', display: 'none', gridTemplateColumns: '1fr', gap: '10px',
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
    // Style mới cho Avatar Container
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
      setFilters(prev => ({ ...prev, category_slug: slug }));
      setActiveTab("category_detail");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header style={styles.header}>
        {/* Logo */}
        <div style={styles.brand} onClick={() => setActiveTab("shop")}>
          <svg width="35" height="35" viewBox="0 0 40 40" fill="none">
            <path d="M20 5L5 18V35H35V18L20 5Z" fill={brand.primary} />
            <path d="M12 22H28V30H12V22Z" fill={brand.secondary} />
          </svg>
          <h1 style={styles.logoText}>Hometic</h1>
        </div>

        {/* Desktop Navigation */}
        <nav style={styles.nav}>
          {!loading && parentCategories.map((cat) => (
            <div key={cat.id} style={styles.navItem}
              onMouseEnter={(e) => { const menu = e.currentTarget.querySelector('.mega-menu-inline'); if (menu) menu.style.display = 'grid'; }}
              onMouseLeave={(e) => { const menu = e.currentTarget.querySelector('.mega-menu-inline'); if (menu) menu.style.display = 'none'; }}
            >
              <button style={styles.navBtn(filters?.category_slug === cat.slug)} onClick={() => handleCategoryClick(cat.slug)}>
                {cat.name}
              </button>
              <div className="mega-menu-inline" style={styles.megaMenu}>
                <div>
                  <h4 style={{ color: brand.primary, fontSize: '14px', marginBottom: '12px', borderBottom: '2px solid #f0f0f0', paddingBottom: '5px' }}>
                    Tất cả {cat.name}
                  </h4>
                  {getSubCategories(cat.id).map((sub) => (
                    <span key={sub.id} style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '10px', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.target.style.color = brand.secondary}
                      onMouseLeave={(e) => e.target.style.color = '#666'}
                      onClick={() => handleCategoryClick(sub.slug)}
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Actions (Search, Cart, User) */}
        <div style={styles.actions}>
          <div style={styles.search}>
            <Search size={16} color={brand.muted} />
            <input style={styles.searchInput} placeholder="Tìm kiếm..." />
          </div>

          <button style={styles.cartBtn} onClick={() => setActiveTab("cart")}>
            <ShoppingCart size={24} />
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </button>

          {/* PHẦN HIỂN THỊ USER ĐÃ ĐƯỢC CẬP NHẬT */}
          {user ? (
            <div style={styles.userActions}>
              {/* Avatar tròn, click để vào Profile */}
              <div style={styles.avatarWrapper} onClick={() => setActiveTab("profile")}>
                <img
                  // Sử dụng avatar của user, nếu không có thì dùng defaultAvatar
                  src={user.avatar_url || defaultAvatar}
                  alt={user.full_name || "User"}
                  style={styles.avatarImg}
                  // Xử lý lỗi nếu link ảnh die
                  onError={(e) => { e.target.src = defaultAvatar; }}
                />
              </div>
              {/* Nút Logout */}
              <button
                onClick={onLogout}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: brand.secondary, display: 'flex', alignItems: 'center' }}
                title="Đăng xuất"
              >
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
      </header>

      {/* Mobile Menu Overlay */}
      <div style={styles.mobileMenu}>
        {/* Hiển thị User trên Mobile Menu nếu đã đăng nhập */}
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
        )}

        <div style={{ display: 'flex', alignItems: 'center', background: '#f5f5f5', borderRadius: '12px', padding: '12px 15px', marginBottom: '10px' }}>
          <Search size={18} color="#999" />
          <input style={{ border: 'none', background: 'transparent', outline: 'none', paddingLeft: '10px', width: '100%', fontSize: '15px' }} placeholder="Bạn cần tìm gì?" />
        </div>

        {parentCategories.map((cat) => (
          <div key={cat.id} style={{ borderBottom: '1px solid #eee' }}>
            <button style={{ width: '100%', background: 'none', border: 'none', padding: '15px 5px', textAlign: 'left', fontSize: '16px', fontWeight: '700', color: brand.text, display: 'flex', justifyContent: 'space-between' }} onClick={() => handleCategoryClick(cat.slug)}>
              {cat.name}
              <ChevronDown size={18} />
            </button>
          </div>
        ))}

        {!user ? (
          <button style={{ marginTop: '15px', background: brand.secondary, border: 'none', padding: '15px', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }} onClick={() => { setActiveTab("auth"); setIsMobileMenuOpen(false); }}>
            Đăng nhập / Đăng ký
          </button>
        ) : (
          <button style={{ marginTop: '15px', background: '#eee', border: 'none', padding: '15px', borderRadius: '12px', color: brand.text, fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={onLogout}>
            <LogOut size={18} />
            Đăng xuất
          </button>
        )}
      </div>
    </>
  );
}
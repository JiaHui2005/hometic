import React, { useState, useEffect } from "react";
import { LogOut, Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";

const megaMenus = {
  kitchen: [
    ["Thiết bị nhà bếp", "Nồi cơm điện", "Bếp từ", "Máy chiên"],
    ["Dụng cụ làm bếp", "Bộ nồi", "Chảo chống dính", "Dao"],
    ["Đồ uống ăn uống", "Bát đĩa", "Bộ dao nĩa", "Ly thủy tinh"],
    ["Bảo quản thực phẩm", "Tủ lạnh", "Hộp đựng thực phẩm", "Màng bọc"],
  ],
  living: [
    ["Âm thanh", "Loa kéo", "Dàn âm thanh", "Micro"],
    ["Trang trí phòng ở", "Đồng hồ treo tường", "Khung treo tranh", "Tranh ảnh"],
    ["Đồ dùng tiện ích", "Kệ đồ", "Bộ bàn ăn", "Tủ giày"],
  ],
  bedroom: [
    ["Chăn ga gối", "Ga giường & vỏ gối", "Chăn & ruột chăn", "Gối ôm"],
    ["Lưu trữ & Tổ chức", "Tủ quần áo mini", "Hộp lưu trữ", "Móc treo quần áo"],
    ["Trang trí, ánh sáng", "Đèn ngủ", "Rèm chống nắng", "Thảm"],
  ],
  homecare: [
    ["Dụng cụ vệ sinh", "Máy hút bụi", "Máy lau nhà thông minh", "Bàn chải điện"],
    ["Phòng tắm", "Kệ nhà tắm", "Tinh dầu", "Sồ đựng khăn"],
    ["Giặt giũ", "Máy giặt mini", "Bàn ủi", "Giàn phơi đồ"],
  ],
  utilities: [
    ["Thiết bị điện", "Ổ cắm điện", "Bóng LED", "Đèn pin"],
    ["Vệ sinh & Chăm sóc", "Máy sấy tóc", "Bàn ủi hơi", "Các sản phẩm chăm sóc"],
    ["Sức khỏe & An toàn", "Máy đo nhiệt độ", "Cân điện tử", "Thiết bị báo cháy mini"],
  ],
};

export default function Header({ user, cartCount, activeTab, setActiveTab, onLogout, filters, setFilters }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    ["shop", "Nhà bếp", "kitchen"],
    ["shop", "Phòng khách", "living"],
    ["shop", "Phòng ngủ", "bedroom"],
    ["shop", "Nhà cửa", "homecare"],
    ["shop", "Tiện ích", "utilities"],
  ];

  const brand = {
    primary: "#008481",
    secondary: "#ed7f1a",
    text: "#133b3b",
    muted: "#4b5563",
    glass: "rgba(155, 201, 199, 0.95)"
  };

  const styles = {
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: brand.glass,
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '0 20px' : '0 40px',
      height: '80px',
      width: '100%',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      color: brand.primary
    },
    logoText: {
      fontSize: isMobile ? '22px' : '26px',
      fontWeight: '800',
      letterSpacing: '-0.02em',
      margin: 0
    },
    nav: {
      display: isMobile ? 'none' : 'flex',
      height: '100%',
      gap: '5px'
    },
    navItem: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: '100%'
    },
    navBtn: (active) => ({
      background: 'transparent',
      color: brand.text,
      height: '100%',
      padding: '0 15px',
      fontSize: '15px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      backgroundColor: active ? 'rgba(255,255,255,0.2)' : 'transparent',
      transition: '0.2s'
    }),
    megaMenu: {
      position: 'absolute',
      top: '80px',
      left: '-100px',
      width: '700px',
      background: 'white',
      borderRadius: '0 0 16px 16px',
      padding: '30px',
      display: 'none',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0',
      zIndex: 1001
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '10px' : '20px'
    },
    search: {
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      background: 'white',
      borderRadius: '20px',
      padding: '8px 16px',
      width: '240px',
      border: '1px solid rgba(0,0,0,0.1)'
    },
    searchInput: {
      background: 'transparent',
      border: 'none',
      padding: '0 8px',
      width: '100%',
      outline: 'none',
      fontSize: '13px'
    },
    cartBtn: {
      position: 'relative',
      background: 'transparent',
      border: 'none',
      padding: '8px',
      cursor: 'pointer',
      color: brand.text
    },
    badge: {
      position: 'absolute',
      top: '0',
      right: '0',
      background: brand.secondary,
      color: 'white',
      fontSize: '10px',
      minWidth: '18px',
      height: '18px',
      borderRadius: '10px',
      display: 'grid',
      placeItems: 'center',
      fontWeight: '800'
    },
    mobileToggle: {
      display: isMobile ? 'block' : 'none',
      background: 'transparent',
      border: 'none',
      padding: '5px',
      cursor: 'pointer',
      color: brand.text
    },
    mobileMenu: {
      position: 'fixed',
      top: '80px',
      left: 0,
      width: '100%',
      height: 'calc(100vh - 80px)',
      background: brand.glass,
      backdropFilter: 'blur(15px)',
      padding: '20px',
      zIndex: 999,
      display: isMobileMenuOpen ? 'flex' : 'none',
      flexDirection: 'column',
      gap: '15px',
      overflowY: 'auto'
    }
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.brand} onClick={() => setActiveTab("shop")}>
          <svg width="35" height="35" viewBox="0 0 40 40" fill="none">
            <path d="M20 5L5 18V35H35V18L20 5Z" fill={brand.primary} />
            <path d="M12 22H28V30H12V22Z" fill={brand.secondary} />
          </svg>
          <h1 style={styles.logoText}>Hometic</h1>
        </div>

        {/* Desktop Nav */}
        <nav style={styles.nav}>
          {navItems.map(([id, label, menuKey]) => (
            <div 
              key={label} 
              style={styles.navItem}
              onMouseEnter={(e) => {
                const menu = e.currentTarget.querySelector('.mega-menu-inline');
                if (menu) menu.style.display = 'grid';
              }}
              onMouseLeave={(e) => {
                const menu = e.currentTarget.querySelector('.mega-menu-inline');
                if (menu) menu.style.display = 'none';
              }}
            >
              <button 
                style={styles.navBtn(activeTab === "category_detail" && label === "Nhà bếp")} 
                onClick={() => setActiveTab("category_detail")}
              >
                {label}
              </button>
              <div className="mega-menu-inline" style={styles.megaMenu}>
                {megaMenus[menuKey].map((column) => (
                  <div key={column[0]}>
                    <h4 style={{ color: brand.primary, fontSize: '13px', marginBottom: '12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '5px' }}>{column[0]}</h4>
                    {column.slice(1).map((item) => (
                      <span 
                        key={item} 
                        style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '8px', cursor: 'pointer' }}
                        onClick={() => setActiveTab("category_detail")}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div style={styles.actions}>
          <div style={styles.search}>
            <Search size={16} color={brand.muted} />
            <input
              style={styles.searchInput}
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              placeholder="Tìm kiếm..."
            />
          </div>

          <button style={styles.cartBtn} onClick={() => setActiveTab("cart")}>
            <ShoppingCart size={24} />
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              {!isMobile && (
                <span 
                  style={{ fontSize: '13px', fontWeight: '700', transition: '0.2s' }}
                  onClick={() => setActiveTab("profile")}
                  onMouseEnter={(e) => e.target.style.color = brand.secondary}
                  onMouseLeave={(e) => e.target.style.color = 'inherit'}
                >
                  {user.full_name.split(' ').pop()}
                </span>
              )}
              <LogOut size={20} color={brand.secondary} onClick={onLogout} />
            </div>
          ) : (
            <button 
              style={{ ...styles.navBtn(false), padding: '8px 15px', borderRadius: '20px', border: `1px solid ${brand.primary}`, height: 'auto' }}
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
        <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '12px', padding: '12px 15px', marginBottom: '10px' }}>
          <Search size={18} color="#999" />
          <input 
            style={{ border: 'none', outline: 'none', paddingLeft: '10px', width: '100%', fontSize: '15px' }} 
            placeholder="Bạn cần tìm gì?"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
        </div>
        {navItems.map(([id, label]) => (
          <button 
            key={label}
            style={{ background: 'white', border: 'none', padding: '15px', borderRadius: '12px', textAlign: 'left', fontSize: '16px', fontWeight: '700', color: brand.text }}
            onClick={() => {
              setActiveTab("category_detail");
              setIsMobileMenuOpen(false);
            }}
          >
            {label}
          </button>
        ))}
        {!user && (
          <button 
            style={{ background: brand.secondary, border: 'none', padding: '15px', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '700' }}
            onClick={() => setActiveTab("auth")}
          >
            Đăng nhập / Đăng ký
          </button>
        )}
      </div>
    </>
  );
}

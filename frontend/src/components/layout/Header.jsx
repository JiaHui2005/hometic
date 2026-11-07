import React, { useState, useEffect } from "react";
import { LogOut, Search, ShoppingBag, Menu, X, ChevronDown, User } from "lucide-react";
import { catalogService } from "../../services/api";
import "./Header.css";

const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";

export default function Header({ user, cartCount, activeTab, setActiveTab, onLogout, filters, setFilters }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(filters?.q || "");
  const [expandedMobileCats, setExpandedMobileCats] = useState({});

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

  // Khoá cuộn trang khi mở menu mobile
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const parentCategories = categories.filter(cat => cat.parent_id === null);
  const getSubCategories = (parentId) => categories.filter(cat => cat.parent_id === parentId);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (filters?.q || "")) {
        setFilters(prev => ({ ...prev, q: searchTerm, category_slug: "" }));
        // Chuyển sang tab search nếu đang gõ
        if (activeTab !== "search" && searchTerm.trim().length > 0) {
          setActiveTab("search");
        }
      }
    }, 500); // Debounce 500ms
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click" || e.type === "submit") {
      e.preventDefault?.();
      setFilters(prev => ({ ...prev, q: searchTerm, category_slug: "" }));
      setActiveTab("search");
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileCat = (id) => {
    setExpandedMobileCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCategoryClick = (slug) => {
    if (setFilters) {
      setFilters(prev => ({ ...prev, category_slug: slug, q: "" }));
      setActiveTab("category_detail");
      setIsMobileMenuOpen(false);
    }
  };

  const goHome = () => {
    setActiveTab("shop");
    if (setFilters) setFilters(prev => ({ ...prev, category_slug: "", q: "" }));
    setSearchTerm("");
    setIsMobileMenuOpen(false);
  };

  const go = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <button className="brand" onClick={goHome} aria-label="Về trang chủ Hometic">
            <img className="brand__icon" src="/logo1.png" alt="" />
            <img className="brand__word" src="/logo2.png" alt="Hometic" />
          </button>

          <nav className="main-nav" aria-label="Danh mục sản phẩm">
            {!loading && parentCategories.map((cat) => {
              const subs = getSubCategories(cat.id);
              const isActive = activeTab === "category_detail" && filters?.category_slug === cat.slug;
              return (
                <div key={cat.id} className="main-nav__item">
                  <button
                    className={`main-nav__link${isActive ? " is-active" : ""}`}
                    onClick={() => handleCategoryClick(cat.slug)}
                  >
                    {cat.name}
                    {subs.length > 0 && <ChevronDown size={14} />}
                  </button>
                  {subs.length > 0 && (
                    <div className="mega-menu">
                      {subs.map((sub) => (
                        <div key={sub.id} className="mega-menu__col">
                          <button className="mega-menu__title" onClick={() => handleCategoryClick(sub.slug)}>
                            {sub.name}
                          </button>
                          {getSubCategories(sub.id).map((grandSub) => (
                            <button
                              key={grandSub.id}
                              className="mega-menu__link"
                              onClick={(e) => { e.stopPropagation(); handleCategoryClick(grandSub.slug); }}
                            >
                              {grandSub.name}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="header-actions">
            <form className="header-search" role="search" onSubmit={handleSearch}>
              <Search size={16} />
              <input
                className="header-search__input"
                type="search"
                placeholder="Tìm sản phẩm"
                aria-label="Tìm sản phẩm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            <button className="icon-btn" onClick={() => go("cart")} aria-label={`Giỏ hàng (${cartCount})`}>
              <ShoppingBag size={21} />
              {cartCount > 0 && <span className="count-badge">{cartCount}</span>}
            </button>

            {user ? (
              <div className="header-user">
                <button className="header-avatar" onClick={() => go("profile")} aria-label="Trang cá nhân">
                  <img
                    src={user.avatar_url || DEFAULT_AVATAR}
                    alt=""
                    onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                  />
                </button>
                <button className="icon-btn header-logout" onClick={onLogout} aria-label="Đăng xuất" title="Đăng xuất">
                  <LogOut size={19} />
                </button>
              </div>
            ) : (
              <button className="btn btn-outline btn-sm header-login" onClick={() => go("auth")}>
                <User size={15} />
                Đăng nhập
              </button>
            )}

            <button
              className="icon-btn header-burger"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Mở menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`drawer-backdrop${isMobileMenuOpen ? " is-open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />
      <aside className={`drawer${isMobileMenuOpen ? " is-open" : ""}`} aria-hidden={!isMobileMenuOpen}>
        <div className="drawer__head">
          <span className="drawer__title">Menu</span>
          <button className="icon-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Đóng menu">
            <X size={22} />
          </button>
        </div>

        {user && (
          <button className="drawer__user" onClick={() => go("profile")}>
            <span className="header-avatar header-avatar--lg">
              <img src={user.avatar_url || DEFAULT_AVATAR} alt="" onError={(e) => { e.target.src = DEFAULT_AVATAR; }} />
            </span>
            <span>
              <strong>{user.full_name}</strong>
              <small>Xem trang cá nhân</small>
            </span>
          </button>
        )}

        <form className="input-group drawer__search" role="search" onSubmit={handleSearch}>
          <Search size={17} />
          <input
            className="input"
            type="search"
            placeholder="Bạn cần tìm gì?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <nav className="drawer__nav">
          {!loading && parentCategories.map((cat) => {
            const subs = getSubCategories(cat.id);
            return (
              <div key={cat.id} className="drawer__group">
                <div className="drawer__row">
                  <button className="drawer__link" onClick={() => handleCategoryClick(cat.slug)}>{cat.name}</button>
                  {subs.length > 0 && (
                    <button
                      className={`icon-btn icon-btn-sm drawer__toggle${expandedMobileCats[cat.id] ? " is-open" : ""}`}
                      onClick={() => toggleMobileCat(cat.id)}
                      aria-label={`Mở ${cat.name}`}
                    >
                      <ChevronDown size={18} />
                    </button>
                  )}
                </div>

                {expandedMobileCats[cat.id] && (
                  <div className="drawer__sub">
                    {subs.map(sub => {
                      const grandSubs = getSubCategories(sub.id);
                      return (
                        <div key={sub.id}>
                          <div className="drawer__row">
                            <button className="drawer__sublink" onClick={() => handleCategoryClick(sub.slug)}>{sub.name}</button>
                            {grandSubs.length > 0 && (
                              <button
                                className={`icon-btn icon-btn-sm drawer__toggle${expandedMobileCats[sub.id] ? " is-open" : ""}`}
                                onClick={(e) => { e.stopPropagation(); toggleMobileCat(sub.id); }}
                                aria-label={`Mở ${sub.name}`}
                              >
                                <ChevronDown size={16} />
                              </button>
                            )}
                          </div>
                          {expandedMobileCats[sub.id] && (
                            <div className="drawer__leaf">
                              {grandSubs.map(grandSub => (
                                <button key={grandSub.id} onClick={() => handleCategoryClick(grandSub.slug)}>
                                  {grandSub.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="drawer__foot">
          {!user ? (
            <button className="btn btn-primary btn-block btn-lg" onClick={() => go("auth")}>
              Đăng nhập / Đăng ký
            </button>
          ) : (
            <button className="btn btn-outline btn-block btn-lg" onClick={() => { setIsMobileMenuOpen(false); onLogout(); }}>
              <LogOut size={18} />
              Đăng xuất
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

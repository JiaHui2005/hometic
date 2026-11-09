import React, { useEffect, useState } from "react";
import { LogOut, ShoppingBag, Menu, X, ChevronDown, User, LayoutGrid } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import SearchBox from "./SearchBox";
import "./Header.css";

const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";

export default function Header({ activeTab, onLogout }) {
  const { user, categories, cartCount, filters, go, openCategory, openFinder, openStaticPage, setFilters } = useStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMegaOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  const roots = categories.filter(c => c.parent_id === null || c.parent_id === undefined);
  const childrenOf = (id) => categories.filter(c => c.parent_id === id);

  const pickCategory = (slug) => {
    openCategory(slug);
    setDrawerOpen(false);
    setMegaOpen(false);
  };

  const nav = (tab) => {
    go(tab);
    setDrawerOpen(false);
  };

  const goHome = () => {
    setFilters({ q: "", category_slug: "" });
    nav("shop");
  };

  const activeRoot = activeTab === "category_detail" ? filters.category_slug : null;

  return (
    <>
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <p>Giao trong 2–4 giờ ở nội thành TP.HCM và Hà Nội</p>
          <nav aria-label="Hỗ trợ">
            <button onClick={() => openStaticPage("guide")}>Hướng dẫn mua hàng</button>
            <button onClick={() => openStaticPage("warranty")}>Bảo hành</button>
            <a href="tel:1900255579">Hotline 1900 2555 79</a>
          </nav>
        </div>
      </div>

      <header className="site-header">
        <div className="container site-header__main">
          <button className="icon-btn header-burger" onClick={() => setDrawerOpen(true)} aria-label="Mở danh mục" aria-expanded={drawerOpen}>
            <Menu size={22} />
          </button>

          <button className="brand" onClick={goHome} aria-label="Hometic, về trang chủ">
            <img className="brand__icon" src="/logo1.png" alt="" />
            <img className="brand__word" src="/logo2.png" alt="" />
          </button>

          <div className="site-header__search">
            <SearchBox />
          </div>

          <div className="header-actions">
            {user ? (
              <div className="header-account">
                <button className="header-account__btn" onClick={() => nav("profile")}>
                  <img
                    src={user.avatar_url || DEFAULT_AVATAR}
                    alt=""
                    onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                  />
                  <span className="header-label">{user.full_name?.split(" ").pop() || "Tài khoản"}</span>
                </button>
                <button className="icon-btn header-logout" onClick={onLogout} aria-label="Đăng xuất" title="Đăng xuất">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button className="header-action" onClick={() => nav("auth")}>
                <User size={20} aria-hidden="true" />
                <span className="header-label">Đăng nhập</span>
              </button>
            )}

            <button className="header-action" onClick={() => nav("cart")} aria-label={`Giỏ hàng, ${cartCount} sản phẩm`}>
              <span className="header-cart-icon">
                <ShoppingBag size={20} aria-hidden="true" />
                {cartCount > 0 && <span key={cartCount} className="count-badge count-badge--bump">{cartCount}</span>}
              </span>
              <span className="header-label">Giỏ hàng</span>
            </button>
          </div>
        </div>

        <div className="cat-bar">
          <div className="container cat-bar__inner">
            <button
              className={`cat-bar__all${megaOpen ? " is-open" : ""}`}
              onClick={() => setMegaOpen(o => !o)}
              aria-expanded={megaOpen}
              aria-controls="mega-menu"
            >
              <LayoutGrid size={16} aria-hidden="true" />
              Tất cả danh mục
              <ChevronDown size={14} aria-hidden="true" />
            </button>

            <nav className="cat-bar__links" aria-label="Danh mục chính">
              {roots.map(c => (
                <button
                  key={c.id}
                  className={activeRoot === c.slug ? "is-active" : ""}
                  aria-current={activeRoot === c.slug ? "page" : undefined}
                  onClick={() => pickCategory(c.slug)}
                >
                  {c.name}
                </button>
              ))}
            </nav>

            <button className={`cat-bar__finder${activeTab === "finder" ? " is-active" : ""}`} onClick={() => openFinder()}>
              Chưa biết chọn gì?
            </button>
          </div>

          {megaOpen && (
            <>
              <div className="mega-scrim" onClick={() => setMegaOpen(false)} aria-hidden="true" />
              <div className="mega" id="mega-menu">
                <div className="container mega__grid">
                  {roots.map(root => (
                    <div key={root.id} className="mega__col">
                      <button className="mega__root" onClick={() => pickCategory(root.slug)}>{root.name}</button>
                      {childrenOf(root.id).map(sub => (
                        <div key={sub.id} className="mega__group">
                          <button className="mega__sub" onClick={() => pickCategory(sub.slug)}>{sub.name}</button>
                          {childrenOf(sub.id).map(leaf => (
                            <button key={leaf.id} className="mega__leaf" onClick={() => pickCategory(leaf.slug)}>{leaf.name}</button>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Ngăn kéo danh mục trên điện thoại */}
      <div className={`drawer-backdrop${drawerOpen ? " is-open" : ""}`} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      <aside className={`drawer${drawerOpen ? " is-open" : ""}`} aria-hidden={!drawerOpen} aria-label="Danh mục">
        <div className="drawer__head">
          <span className="drawer__title">Danh mục</span>
          <button className="icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Đóng danh mục">
            <X size={22} />
          </button>
        </div>

        <nav className="drawer__nav">
          {roots.map(root => {
            const subs = childrenOf(root.id);
            const isOpen = expanded[root.id];
            return (
              <div key={root.id} className="drawer__group">
                <div className="drawer__row">
                  <button className="drawer__link" onClick={() => pickCategory(root.slug)}>{root.name}</button>
                  {subs.length > 0 && (
                    <button
                      className={`icon-btn icon-btn-sm drawer__toggle${isOpen ? " is-open" : ""}`}
                      onClick={() => setExpanded(e => ({ ...e, [root.id]: !e[root.id] }))}
                      aria-expanded={!!isOpen}
                      aria-label={`Xem nhóm trong ${root.name}`}
                    >
                      <ChevronDown size={18} />
                    </button>
                  )}
                </div>
                {isOpen && (
                  <div className="drawer__sub">
                    {subs.map(sub => (
                      <div key={sub.id}>
                        <button className="drawer__sublink" onClick={() => pickCategory(sub.slug)}>{sub.name}</button>
                        <div className="drawer__leaf">
                          {childrenOf(sub.id).map(leaf => (
                            <button key={leaf.id} onClick={() => pickCategory(leaf.slug)}>{leaf.name}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="drawer__extra">
          <button onClick={() => { openFinder(); setDrawerOpen(false); }}>Chưa biết chọn gì? Lọc theo nhu cầu</button>
          <button onClick={() => { openStaticPage("guide"); setDrawerOpen(false); }}>Hướng dẫn mua hàng</button>
          <a href="tel:1900255579">Hotline 1900 2555 79</a>
        </div>

        <div className="drawer__foot">
          {!user ? (
            <button className="btn btn-primary btn-block btn-lg" onClick={() => nav("auth")}>Đăng nhập / Đăng ký</button>
          ) : (
            <button className="btn btn-outline btn-block btn-lg" onClick={() => { setDrawerOpen(false); onLogout(); }}>
              <LogOut size={18} /> Đăng xuất
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

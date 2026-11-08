import React, { useEffect, useMemo, useState } from "react";
import { clearSession, getStoredUser, catalogService } from "./services/api";
import alertService from "./services/alertService";
import { demoCategories, demoProducts } from "./constants/demoData";
import { StoreContext } from "./context/StoreContext";

import { Header, Footer } from "./components/layout";
import { AlertContainer } from "./components/common";
import { CompareTray } from "./components/product";
import {
  Shop, Auth, Cart, Admin, CategoryDetail, ProductDetail, Profile, StaticPages, SearchPage, Compare, Finder,
} from "./pages";

const MAX_COMPARE = 3;

export default function App() {
  const [user, setUser] = useState(getStoredUser());
  const [activeTab, setActiveTab] = useState(() => {
    const u = getStoredUser();
    return u && u.role === "admin" ? "admin" : "shop";
  });
  const [categories, setCategories] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "", category_slug: "" });
  const [compareList, setCompareList] = useState([]);
  const [finderPreset, setFinderPreset] = useState(null);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("hometic_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [staticPage, setStaticPage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, selectedProduct, filters.category_slug]);

  useEffect(() => {
    localStorage.setItem("hometic_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    catalogService.getCategories()
      .then(setCategories)
      .catch(() => setCategories(demoCategories));

    // shortcut: tải toàn bộ sản phẩm một lần để tìm kiếm/gợi ý/so sánh phía client — đổi sang tìm kiếm phía server khi catalog lớn (vài nghìn sản phẩm)
    catalogService.getProducts()
      .then(setCatalog)
      .catch(() => setCatalog(demoProducts))
      .finally(() => setCatalogLoading(false));
  }, []);

  function addToCart(product, { silent = false } = {}) {
    const qtyToAdd = product.quantity || 1;
    setCart((items) => {
      const current = items.find((item) => item.id === product.id);
      if (current) {
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }
      return [...items, { ...product, quantity: qtyToAdd }];
    });
    if (!silent) alertService.success("Đã thêm vào giỏ", `${qtyToAdd} × ${product.name}`);
  }

  function logout() {
    clearSession();
    localStorage.removeItem("hometic_cart");
    setUser(null);
    setCart([]);
    setActiveTab("shop");
    alertService.success("Đã đăng xuất", "Hẹn gặp lại bạn.");
  }

  const store = useMemo(() => ({
    user,
    categories,
    catalog,
    catalogLoading,
    filters,
    setFilters,
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    addToCart,
    compareList,
    isComparing: (id) => compareList.some(p => p.id === id),
    toggleCompare: (product) => {
      setCompareList(list => {
        if (list.some(p => p.id === product.id)) return list.filter(p => p.id !== product.id);
        if (list.length >= MAX_COMPARE) {
          alertService.warning("Đã đủ 3 sản phẩm", "Bỏ bớt một sản phẩm để so sánh thêm.");
          return list;
        }
        return [...list, product];
      });
    },
    clearCompare: () => setCompareList([]),
    go: setActiveTab,
    openProduct: (product) => {
      setSelectedProduct(product);
      setActiveTab("product_detail");
    },
    openCategory: (slug) => {
      setFilters(prev => ({ ...prev, category_slug: slug, q: "" }));
      setActiveTab("category_detail");
    },
    search: (q) => {
      setFilters(prev => ({ ...prev, q, category_slug: "" }));
      setActiveTab("search");
    },
    openFinder: (preset = null) => {
      setFinderPreset(preset);
      setActiveTab("finder");
    },
    openStaticPage: (key) => {
      setStaticPage(key);
      setActiveTab("static_page");
    },
  }), [user, categories, catalog, catalogLoading, filters, cart, compareList]);

  const isAdmin = activeTab === "admin";

  return (
    <StoreContext.Provider value={store}>
      <div className="app-root">
        <a className="skip-link" href="#main">Bỏ qua tới nội dung chính</a>
        <AlertContainer />

        {!isAdmin && <Header activeTab={activeTab} onLogout={logout} />}

        <main id="main" key={activeTab} className="main-layout page-enter">
          {activeTab === "shop" && <Shop />}
          {activeTab === "category_detail" && <CategoryDetail />}
          {activeTab === "product_detail" && <ProductDetail product={selectedProduct} />}
          {activeTab === "search" && <SearchPage />}
          {activeTab === "compare" && <Compare />}
          {activeTab === "finder" && <Finder preset={finderPreset} />}

          {activeTab === "auth" && <Auth setUser={setUser} setActiveTab={setActiveTab} />}

          {activeTab === "cart" && (
            <Cart
              cart={cart}
              user={user}
              setActiveTab={setActiveTab}
              clearCart={() => setCart([])}
              updateQuantity={(id, delta) =>
                setCart(cart.map((item) =>
                  item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
                ))
              }
              removeFromCart={(id) => setCart(cart.filter((item) => item.id !== id))}
            />
          )}

          {activeTab === "profile" && <Profile user={user} setUser={setUser} setActiveTab={setActiveTab} />}
          {activeTab === "admin" && <Admin onLogout={logout} />}
          {activeTab === "static_page" && <StaticPages pageKey={staticPage} />}
        </main>

        {!isAdmin && activeTab !== "compare" && <CompareTray raised={activeTab === "product_detail"} />}
        {!isAdmin && <Footer />}
      </div>
    </StoreContext.Provider>
  );
}

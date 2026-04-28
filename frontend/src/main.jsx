import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { clearSession, getStoredUser, catalogService } from "./services/api";
import "./styles.css";

import { Header, Footer, Shop, Auth, Cart, Orders, Admin, Reviews, CategoryDetail, ProductDetail, Profile, StaticPages } from "./components";
import { demoCategories, demoProducts } from "./constants";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Hometic System Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          minHeight: "100vh", backgroundColor: "#f9f5ed", fontFamily: "sans-serif"
        }}>
          <div style={{
            textAlign: "center", padding: "40px", backgroundColor: "white",
            borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", maxWidth: "500px"
          }}>
            <h1 style={{ color: "#234a4a" }}>Oops! Có lỗi xảy ra</h1>
            <p style={{ color: "#666" }}>Hệ thống gặp sự cố bất ngờ. Vui lòng tải lại trang.</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "12px 24px", backgroundColor: "#234a4a", color: "white",
                border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700"
              }}
            >
              TẢI LẠI TRANG
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState(getStoredUser());
  const [activeTab, setActiveTab] = useState(() => {
    const u = getStoredUser();
    return u && u.role === "admin" ? "admin" : "shop";
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ q: "", category_slug: "" });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("hometic_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [staticPage, setStaticPage] = useState("");

  useEffect(() => {
    localStorage.setItem("hometic_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    catalogService.getCategories()
      .then(setCategories)
      .catch(() => setCategories(demoCategories));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.category_slug) params.set("category_slug", filters.category_slug);

    catalogService.getProducts(params.toString() ? `?${params.toString()}` : "")
      .then(setProducts)
      .catch(() => setProducts(demoProducts));
  }, [filters]);

  function addToCart(product) {
    setCart((items) => {
      const current = items.find((item) => item.id === product.id);
      const qtyToAdd = product.quantity || 1;

      if (current) {
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }
      return [...items, { ...product, quantity: qtyToAdd }];
    });
  }

  function logout() {
    clearSession();
    localStorage.removeItem("hometic_cart");
    setUser(null);
    setCart([]);
    setActiveTab("shop");
    alert("Đã đăng xuất thành công! Hẹn gặp lại bạn. ✨");
  }

  return (
    <div className="app-root">
      {/* Header ẩn khi ở trang Admin */}
      {activeTab !== "admin" && (
        <Header
          user={user}
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={logout}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      <main className="main-layout">
        {activeTab === "shop" && (
          <Shop
            categories={categories}
            products={products}
            filters={filters}
            setFilters={setFilters}
            addToCart={addToCart}
            setActiveTab={setActiveTab}
            setSelectedProduct={setSelectedProduct}
          />
        )}

        {activeTab === "category_detail" && (
          <CategoryDetail
            categories={categories}
            filters={filters}
            products={products}
            addToCart={addToCart}
            setActiveTab={setActiveTab}
            setSelectedProduct={setSelectedProduct}
          />
        )}

        {activeTab === "product_detail" && (
          <ProductDetail
            product={selectedProduct}
            addToCart={addToCart}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "auth" && (
          <Auth
            setUser={setUser}
            setActiveTab={setActiveTab}
          />
        )}

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

        {activeTab === "profile" && (
          <Profile
            user={user}
            setUser={setUser}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "admin" && (
          <Admin onLogout={logout} />
        )}

        {activeTab === "static_page" && (
          <StaticPages pageKey={staticPage} />
        )}
      </main>

      {/* Footer ẩn khi ở trang Admin */}
      {activeTab !== "admin" && (
        <Footer 
          setActiveTab={setActiveTab} 
          setStaticPage={setStaticPage} 
        />
      )}
    </div>
  );
}

// Render ứng dụng
createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
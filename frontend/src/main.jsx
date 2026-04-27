import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { clearSession, getStoredUser, catalogService } from "./services/api";
import "./styles.css";

// Import components từ barrel export
import { Header, Footer, Shop, Auth, Cart, Orders, Admin, Reviews, CategoryDetail, ProductDetail, Profile } from "./components";

// Import constants
import { demoCategories, demoProducts } from "./constants";

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          fontFamily: "Arial, sans-serif",
          color: "#333"
        }}>
          <div style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <h1 style={{ color: "#e74c3c", marginTop: 0 }}>❌ Lỗi Ứng Dụng</h1>
            <p><strong>Thông báo lỗi:</strong></p>
            <pre style={{
              backgroundColor: "#f5f5f5",
              padding: "15px",
              borderRadius: "4px",
              textAlign: "left",
              overflow: "auto",
              maxWidth: "600px"
            }}>
              {this.state.error?.toString()}
            </pre>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "20px" }}>
              Vui lòng mở DevTools (F12) để xem chi tiết lỗi
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Tải lại trang
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
  const [activeTab, setActiveTab] = useState("shop");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ q: "", category_id: "" });
  const [cart, setCart] = useState(() => JSON.parse(sessionStorage.getItem("hometic_cart") || "[]"));
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => { 
    sessionStorage.setItem("hometic_cart", JSON.stringify(cart)); 
  }, [cart]);

  useEffect(() => { 
    catalogService.getCategories()
      .then(setCategories)
      .catch(() => setCategories(demoCategories));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.category_id) params.set("category_id", filters.category_id);
    
    catalogService.getProducts(params.toString() ? `?${params.toString()}` : "")
      .then(setProducts)
      .catch(() => setProducts(demoProducts));
  }, [filters]);

  function addToCart(product) {
    setCart((items) => {
      const current = items.find((item) => item.id === product.id);
      if (current) return items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...items, { ...product, quantity: 1 }];
    });
  }

  function logout() {
    clearSession();
    setUser(null);
    setActiveTab("shop");
  }

  const reviewMatch = activeTab.match(/^review:(\d+)$/);

  return (
    <div className="app-root">
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
      
      {activeTab === "shop" && <Shop categories={categories} products={products} filters={filters} setFilters={setFilters} addToCart={addToCart} setActiveTab={setActiveTab} setSelectedProduct={setSelectedProduct} />}
      {activeTab === "category_detail" && <CategoryDetail products={products} addToCart={addToCart} setActiveTab={setActiveTab} setSelectedProduct={setSelectedProduct} />}
      {activeTab === "product_detail" && <ProductDetail product={selectedProduct} addToCart={addToCart} setActiveTab={setActiveTab} />}
      {activeTab === "auth" && <Auth setUser={setUser} setActiveTab={setActiveTab} />}
      {activeTab === "cart" && (
        <Cart 
          cart={cart} 
          user={user} 
          setActiveTab={setActiveTab} 
          clearCart={() => setCart([])} 
          updateQuantity={(id, delta) => setCart(cart.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))} 
          removeFromCart={(id) => setCart(cart.filter((item) => item.id !== id))} 
        />
      )}
      {activeTab === "orders" && <Orders />}
      {activeTab === "profile" && <Profile user={user} setActiveTab={setActiveTab} />}
      {activeTab === "admin" && <Admin onLogout={logout} />}
      {reviewMatch && <Reviews productId={reviewMatch[1]} />}
      
      {activeTab !== "admin" && <Footer />}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

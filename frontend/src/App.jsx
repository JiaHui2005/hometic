import React, { useEffect, useState } from "react";
import { clearSession, getStoredUser, catalogService } from "./services/api";
import alertService from "./services/alertService";
import { demoCategories, demoProducts } from "./constants/demoData";

import { Header, Footer } from "./components/layout";
import { AlertContainer } from "./components/common";
import { Shop, Auth, Cart, Admin, CategoryDetail, ProductDetail, Profile, StaticPages, SearchPage } from "./pages";

export default function App() {
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
    window.scrollTo(0, 0);
  }, [activeTab])

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
    alertService.success("Đăng xuất thành công!", "Hẹn gặp lại bạn. ✨");
  }

  return (
    <div className="app-root">
      {/* Alert Container */}
      <AlertContainer />

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

      <main key={activeTab} className="main-layout page-enter">
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

        {activeTab === "search" && (
          <SearchPage
            products={products}
            filters={filters}
            setFilters={setFilters}
            addToCart={addToCart}
            setActiveTab={setActiveTab}
            setSelectedProduct={setSelectedProduct}
          />
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

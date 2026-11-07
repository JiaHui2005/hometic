import React, { useState } from "react";
import { Search, SlidersHorizontal, X, PackageSearch } from "lucide-react";
import alertService from "../services/alertService";
import { ProductCard, ProductFilters } from "../components/product";
import useProductFilters from "../hooks/useProductFilters";

export default function SearchPage({ products, filters, setFilters, addToCart, setActiveTab, setSelectedProduct }) {
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const filterState = useProductFilters(products);
  const { filteredProducts, resetFilters, isFiltered } = filterState;

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setActiveTab("product_detail");
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    setActiveTab("cart");
    alertService.success(`Đã thêm thành công "${product.name}" vào giỏ hàng!`);
  };

  return (
    <div className="container page">
      <header className="search-head">
        <h1 className="page-title">
          {filters?.q ? <>Kết quả cho “{filters.q}”</> : "Tất cả sản phẩm"}
        </h1>
        <p className="page-lead">
          {filteredProducts.length} sản phẩm
        </p>

        <div className="input-group search-head__box">
          <Search size={20} />
          <input
            className="input"
            type="search"
            placeholder="Tìm nồi chiên, robot hút bụi, máy lọc không khí…"
            aria-label="Tìm sản phẩm"
            value={filters?.q || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
          />
        </div>
      </header>

      <div className="catalog">
        <aside className="catalog__aside">
          <ProductFilters {...filterState} />
        </aside>

        <div>
          <div className="catalog__toolbar">
            <button className="btn btn-outline btn-sm catalog__filter-btn" onClick={() => setShowFiltersMobile(true)}>
              <SlidersHorizontal size={15} />
              Bộ lọc
            </button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  meta={product.brand || "Hometic"}
                  onOpen={handleProductClick}
                  onBuy={handleBuyNow}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon"><PackageSearch size={28} /></span>
              <h3>Không tìm thấy sản phẩm nào</h3>
              <p>Thử từ khoá khác, hoặc xoá bộ lọc để xem nhiều sản phẩm hơn.</p>
              <button
                className="btn btn-secondary"
                onClick={() => { resetFilters(); setFilters({ q: "", category_slug: "" }); }}
              >
                {isFiltered || filters?.q ? "Xoá tìm kiếm và bộ lọc" : "Xem tất cả sản phẩm"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`sheet-backdrop${showFiltersMobile ? " is-open" : ""}`} onClick={() => setShowFiltersMobile(false)} />
      <div className={`sheet${showFiltersMobile ? " is-open" : ""}`} role="dialog" aria-label="Bộ lọc">
        <div className="sheet__handle" />
        <div className="sheet__head">
          <h2>Bộ lọc</h2>
          <button className="icon-btn" onClick={() => setShowFiltersMobile(false)} aria-label="Đóng bộ lọc"><X size={20} /></button>
        </div>
        <ProductFilters {...filterState} onDone={() => setShowFiltersMobile(false)} />
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import useProductFilters, { SORTS } from "../../hooks/useProductFilters";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import "./Product.css";

// Bố cục trang danh sách sản phẩm: cột lọc + thanh công cụ (số lượng, sắp xếp) + lưới.
// Trên điện thoại bộ lọc chuyển thành bottom sheet.
export default function CatalogView({ products, loading, empty }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const filterState = useProductFilters(products);
  const { filteredProducts, sort, setSort, activeCount, resetFilters } = filterState;

  return (
    <>
      <div className="catalog">
        <aside className="catalog__aside" aria-label="Bộ lọc">
          <ProductFilters {...filterState} />
        </aside>

        <div>
          <div className="catalog__toolbar">
            <button className="btn btn-outline btn-sm catalog__filter-btn" onClick={() => setSheetOpen(true)}>
              <SlidersHorizontal size={15} aria-hidden="true" />
              Bộ lọc{activeCount ? ` (${activeCount})` : ""}
            </button>
            <p aria-live="polite"><strong>{loading ? "…" : filteredProducts.length}</strong> sản phẩm</p>
            <label className="catalog__sort">
              <span className="sr-only">Sắp xếp</span>
              <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
              </select>
            </label>
          </div>

          {loading ? (
            <div className="grid-skeleton" aria-label="Đang tải sản phẩm">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" />)}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="empty-state">
              <h3>Không có sản phẩm khớp bộ lọc</h3>
              <p>Nới khoảng giá hoặc bỏ bớt thương hiệu để xem thêm.</p>
              <button className="btn btn-secondary" onClick={resetFilters}>Xoá bộ lọc</button>
            </div>
          ) : (
            empty
          )}
        </div>
      </div>

      <div className={`sheet-backdrop${sheetOpen ? " is-open" : ""}`} onClick={() => setSheetOpen(false)} aria-hidden="true" />
      <div className={`sheet${sheetOpen ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Bộ lọc" aria-hidden={!sheetOpen}>
        <div className="sheet__handle" />
        <div className="sheet__head">
          <h2>Bộ lọc</h2>
          <button className="icon-btn" onClick={() => setSheetOpen(false)} aria-label="Đóng bộ lọc"><X size={20} /></button>
        </div>
        <ProductFilters {...filterState} onDone={() => setSheetOpen(false)} resultCount={filteredProducts.length} />
      </div>
    </>
  );
}

import React from "react";
import "./Product.css";

const PRICE_PRESETS = [
  ["Dưới 1 triệu", "", 1000000],
  ["1 – 5 triệu", 1000000, 5000000],
  ["5 – 15 triệu", 5000000, 15000000],
  ["Trên 15 triệu", 15000000, ""],
];

// Bảng lọc: khoảng giá, thương hiệu, còn hàng. Nhận state từ useProductFilters.
export default function ProductFilters({
  priceRange, setPriceRange, brandCounts, selectedBrands, toggleBrand,
  inStockOnly, setInStockOnly, resetFilters, activeCount, onDone, resultCount,
}) {
  const setBound = (key) => (e) => setPriceRange(prev => ({ ...prev, [key]: e.target.value }));
  const isPreset = (min, max) => String(priceRange.min) === String(min) && String(priceRange.max) === String(max);

  return (
    <div className="filters">
      <fieldset className="filters__group">
        <legend className="filters__title">Khoảng giá</legend>
        <div className="filters__presets">
          {PRICE_PRESETS.map(([label, min, max]) => (
            <button
              key={label}
              type="button"
              className="chip"
              aria-pressed={isPreset(min, max)}
              onClick={() => setPriceRange(isPreset(min, max) ? { min: "", max: "" } : { min, max })}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="filters__range">
          <label className="filters__price">
            <span className="sr-only">Giá từ</span>
            <input type="number" min="0" step="100000" placeholder="Từ" value={priceRange.min} onChange={setBound("min")} />
          </label>
          <span aria-hidden="true">–</span>
          <label className="filters__price">
            <span className="sr-only">Giá đến</span>
            <input type="number" min="0" step="100000" placeholder="Đến" value={priceRange.max} onChange={setBound("max")} />
          </label>
        </div>
      </fieldset>

      {brandCounts.length > 1 && (
        <fieldset className="filters__group">
          <legend className="filters__title">Thương hiệu</legend>
          <div className="filters__brands">
            {brandCounts.map(([b, count]) => (
              <label key={b} className="filters__check">
                <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} />
                <span>{b}</span>
                <span className="filters__count">{count}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="filters__group">
        <legend className="filters__title">Tình trạng</legend>
        <label className="filters__check">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
          <span>Chỉ hiện hàng còn</span>
        </label>
      </fieldset>

      <div className="filters__actions">
        {activeCount > 0 && <button type="button" className="btn btn-ghost btn-sm" onClick={resetFilters}>Xoá bộ lọc ({activeCount})</button>}
        {onDone && (
          <button type="button" className="btn btn-primary btn-sm filters__done" onClick={onDone}>
            Xem {resultCount} sản phẩm
          </button>
        )}
      </div>
    </div>
  );
}

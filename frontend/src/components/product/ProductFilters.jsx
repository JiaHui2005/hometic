import React from "react";
import { Check, RotateCcw } from "lucide-react";
import "./Product.css";

const QUICK_MAX = [5000000, 15000000, 30000000];

// Bảng lọc giá / thương hiệu, nhận state từ hook useProductFilters
export default function ProductFilters({ priceRange, setPriceRange, availableBrands, selectedBrands, toggleBrand, resetFilters, onDone }) {
  const setBound = (key) => (e) =>
    setPriceRange(prev => ({ ...prev, [key]: e.target.value === "" ? "" : Number(e.target.value) }));

  return (
    <div className="filters">
      <section className="filters__group">
        <h3 className="filters__title">Khoảng giá</h3>
        <div className="filters__range">
          <label className="filters__price">
            <span>Từ</span>
            <input type="number" min="0" value={priceRange.min} onChange={setBound("min")} />
            <span>đ</span>
          </label>
          <label className="filters__price">
            <span>Đến</span>
            <input type="number" min="0" value={priceRange.max} onChange={setBound("max")} />
            <span>đ</span>
          </label>
        </div>
        <div className="filters__quick">
          {QUICK_MAX.map(val => (
            <button
              key={val}
              className={`chip${priceRange.min === 0 && priceRange.max === val ? " is-active" : ""}`}
              onClick={() => setPriceRange({ min: 0, max: val })}
            >
              Dưới {val / 1000000} triệu
            </button>
          ))}
        </div>
      </section>

      {availableBrands.length > 0 && (
        <section className="filters__group">
          <h3 className="filters__title">Thương hiệu</h3>
          <div className="filters__brands">
            {availableBrands.map(b => {
              const checked = selectedBrands.includes(b);
              return (
                <button
                  key={b}
                  className={`filters__brand${checked ? " is-checked" : ""}`}
                  onClick={() => toggleBrand(b)}
                  role="checkbox"
                  aria-checked={checked}
                >
                  <span className="filters__box">{checked && <Check size={13} strokeWidth={3} />}</span>
                  {b}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <div className="filters__actions">
        <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
          <RotateCcw size={15} />
          Xoá bộ lọc
        </button>
        {onDone && (
          <button className="btn btn-primary btn-sm" onClick={onDone}>Xem kết quả</button>
        )}
      </div>
    </div>
  );
}

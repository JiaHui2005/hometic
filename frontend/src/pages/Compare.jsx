import React, { useMemo } from "react";
import { X, Columns3 } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { getImgUrl } from "../services/api";
import { formatVnd } from "../utils/format";
import { finalPrice, discountPercent, specEntries, specLabel, parseSpec, lowerIsBetter, stockStatus } from "../utils/product";
import "./Compare.css";

// Giá trị tốt nhất trong một hàng (chỉ khi mọi ô cùng đơn vị)
function bestIndex(values, lowerBetter) {
  const parsed = values.map(v => (v == null ? null : parseSpec(v)));
  const units = new Set(parsed.filter(Boolean).map(p => p.unit));
  if (parsed.filter(Boolean).length < 2 || units.size !== 1) return -1;
  let best = -1;
  parsed.forEach((p, i) => {
    if (!p) return;
    if (best === -1 || (lowerBetter ? p.n < parsed[best].n : p.n > parsed[best].n)) best = i;
  });
  const ties = parsed.filter(p => p && p.n === parsed[best].n).length;
  return ties > 1 ? -1 : best;
}

export default function Compare() {
  const { compareList, toggleCompare, addToCart, openProduct, go } = useStore();

  const rows = useMemo(() => {
    const keys = [];
    compareList.forEach(p => specEntries(p).forEach(s => { if (!keys.includes(s.key)) keys.push(s.key); }));
    return keys.map(key => {
      const values = compareList.map(p => specEntries(p).find(s => s.key === key)?.value ?? null);
      return { key, label: specLabel(key), values, best: bestIndex(values, lowerIsBetter(key)) };
    });
  }, [compareList]);

  if (compareList.length < 2) {
    return (
      <div className="container page">
        <div className="empty-state">
          <span className="empty-icon"><Columns3 size={32} aria-hidden="true" /></span>
          <h3>Chọn ít nhất 2 sản phẩm để so sánh</h3>
          <p>Bấm “So sánh” trên thẻ sản phẩm ở trang danh mục hoặc tìm kiếm, tối đa 3 sản phẩm.</p>
          <button className="btn btn-secondary" onClick={() => go("search")}>Xem sản phẩm</button>
        </div>
      </div>
    );
  }

  const prices = compareList.map(finalPrice);
  const cheapest = prices.indexOf(Math.min(...prices));
  const mixed = new Set(compareList.map(p => p.category_id)).size > 1;
  const cols = { "--cols": compareList.length };

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Vị trí trang">
        <button onClick={() => go("shop")}>Trang chủ</button>
        <span aria-hidden="true">/</span>
        <span aria-current="page">So sánh</span>
      </nav>
      <h1 className="page-title">So sánh {compareList.length} sản phẩm</h1>
      {mixed && (
        <p className="compare-note">Các sản phẩm thuộc nhóm khác nhau nên nhiều thông số không đặt cạnh nhau được.</p>
      )}

      <div className="compare-scroll">
        <table className="compare" style={cols}>
          <caption className="sr-only">Bảng so sánh thông số</caption>
          <thead>
            <tr>
              <th scope="col"><span className="sr-only">Tiêu chí</span></th>
              {compareList.map(p => (
                <th key={p.id} scope="col" className="compare__product">
                  <button className="icon-btn icon-btn-sm compare__remove" onClick={() => toggleCompare(p)} aria-label={`Bỏ ${p.name} khỏi so sánh`}>
                    <X size={15} />
                  </button>
                  <button className="compare__media" onClick={() => openProduct(p)} tabIndex={-1} aria-hidden="true">
                    <img src={getImgUrl(p.image_url || p.image)} alt="" />
                  </button>
                  <button className="compare__name" onClick={() => openProduct(p)}>{p.name}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Giá bán</th>
              {compareList.map((p, i) => (
                <td key={p.id} className={i === cheapest ? "is-best" : ""}>
                  <strong className="price">{formatVnd(finalPrice(p))}</strong>
                  {i === cheapest && <span className="compare__badge">Thấp nhất</span>}
                  {discountPercent(p) > 0 && <div className="compare__sub"><s className="price-old">{formatVnd(p.price)}</s> <span className="price-off">−{discountPercent(p)}%</span></div>}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">Thương hiệu</th>
              {compareList.map(p => <td key={p.id}>{p.brand || "—"}</td>)}
            </tr>
            <tr>
              <th scope="row">Nhóm</th>
              {compareList.map(p => <td key={p.id}>{p.category?.name || "—"}</td>)}
            </tr>
            {rows.map(r => (
              <tr key={r.key}>
                <th scope="row">{r.label}</th>
                {r.values.map((v, i) => (
                  <td key={compareList[i].id} className={i === r.best ? "is-best" : ""}>
                    {v ?? <span className="muted">—</span>}
                    {i === r.best && <span className="compare__badge">{lowerIsBetter(r.key) ? "Thấp nhất" : "Cao nhất"}</span>}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">Bảo hành</th>
              {compareList.map(p => <td key={p.id}>{p.detail?.warranty_info || "—"}</td>)}
            </tr>
            <tr>
              <th scope="row">Tình trạng</th>
              {compareList.map(p => {
                const s = stockStatus(p);
                return <td key={p.id}>{s ? <span className={`stock stock--${s.tone}`}>{s.label}</span> : "—"}</td>;
              })}
            </tr>
            <tr>
              <th scope="row"><span className="sr-only">Mua</span></th>
              {compareList.map(p => (
                <td key={p.id}>
                  <button className="btn btn-primary btn-sm" disabled={stockStatus(p)?.tone === "out"} onClick={() => addToCart(p)}>
                    Thêm vào giỏ
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

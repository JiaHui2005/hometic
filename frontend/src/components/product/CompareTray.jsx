import React from "react";
import { X } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { getImgUrl } from "../../services/api";
import "./Product.css";

// Khay so sánh cố định ở đáy màn hình khi đã chọn sản phẩm
export default function CompareTray({ raised = false }) {
  const { compareList, toggleCompare, clearCompare, go } = useStore();
  if (!compareList.length) return null;

  return (
    <aside className={`compare-tray${raised ? " compare-tray--raised" : ""}`} aria-label="Sản phẩm đang chọn để so sánh">
      <div className="container compare-tray__inner">
        <ul className="compare-tray__items">
          {compareList.map(p => (
            <li key={p.id}>
              <img src={getImgUrl(p.image_url || p.image)} alt="" />
              <span>{p.name}</span>
              <button className="icon-btn icon-btn-sm" onClick={() => toggleCompare(p)} aria-label={`Bỏ ${p.name} khỏi so sánh`}>
                <X size={14} />
              </button>
            </li>
          ))}
          {Array.from({ length: 3 - compareList.length }).map((_, i) => (
            <li key={`slot-${i}`} className="compare-tray__slot" aria-hidden="true">Chọn thêm</li>
          ))}
        </ul>
        <div className="compare-tray__actions">
          <button className="btn btn-ghost btn-sm" onClick={clearCompare}>Bỏ chọn</button>
          <button className="btn btn-primary btn-sm" disabled={compareList.length < 2} onClick={() => go("compare")}>
            So sánh {compareList.length} sản phẩm
          </button>
        </div>
      </div>
    </aside>
  );
}

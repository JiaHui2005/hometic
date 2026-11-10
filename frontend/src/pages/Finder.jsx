import React, { useMemo, useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { getImgUrl } from "../services/api";
import { formatVnd } from "../utils/format";
import { finalPrice, keySpecs, categoryTree } from "../utils/product";
import { rankForNeeds } from "../utils/guidance";
import "./Finder.css";

const BUDGETS = [
  ["Dưới 1 triệu", 1000000],
  ["Dưới 3 triệu", 3000000],
  ["Dưới 5 triệu", 5000000],
  ["Dưới 10 triệu", 10000000],
  ["Dưới 20 triệu", 20000000],
  ["Không giới hạn", 0],
];

const NEED_HINTS = ["Inverter", "Wifi", "thông minh", "remote", "4K", "không dây"];

// Bộ chọn sản phẩm theo nhu cầu: lọc + xếp hạng + giải thích bằng dữ liệu thật của catalog
export default function Finder({ preset }) {
  const { catalog, categories, openProduct, addToCart, toggleCompare, isComparing } = useStore();
  const [groupId, setGroupId] = useState(preset?.categoryId ? String(preset.categoryId) : "");
  const [budget, setBudget] = useState(preset?.budget ?? 0);
  const [needs, setNeeds] = useState("");
  const [priority, setPriority] = useState("value");

  // Các nhóm đang có hàng, gom theo danh mục gốc để dễ chọn
  const groupOptions = useMemo(() => {
    const withStock = new Set(catalog.map(p => p.category_id));
    const roots = categories.filter(c => c.parent_id == null);
    return roots.map(root => ({
      root,
      leaves: categories.filter(c => categoryTree(categories, root.id).has(c.id) && withStock.has(c.id)),
    })).filter(g => g.leaves.length);
  }, [catalog, categories]);

  const results = useMemo(() => {
    const categoryIds = groupId ? categoryTree(categories, Number(groupId)) : null;
    return rankForNeeds(catalog, { categoryIds, budget, needs, priority });
  }, [catalog, categories, groupId, budget, needs, priority]);

  const fits = results.filter(r => r.withinBudget).slice(0, 6);
  const near = results
    .filter(r => !r.withinBudget && finalPrice(r.product) <= budget * 1.25)
    .slice(0, 3);

  const addNeed = (word) => setNeeds(n => (n.toLowerCase().includes(word.toLowerCase()) ? n : `${n} ${word}`.trim()));

  return (
    <div className="container page finder">
      <header className="finder__head">
        <h1 className="page-title">Tìm sản phẩm phù hợp</h1>
        <p className="page-lead">
          Cho Hometic biết bạn cần gì và chi bao nhiêu. Mỗi gợi ý đều kèm lý do dựa trên giá, thông số và tồn kho thực tế.
        </p>
      </header>

      <div className="finder__layout">
        <form className="finder__form" onSubmit={(e) => e.preventDefault()} aria-label="Yêu cầu của bạn">
          <div className="field">
            <label htmlFor="fd-group">Bạn đang tìm</label>
            <select id="fd-group" className="select" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
              <option value="">Mọi nhóm sản phẩm</option>
              {groupOptions.map(({ root, leaves }) => (
                <optgroup key={root.id} label={root.name}>
                  <option value={root.id}>Tất cả {root.name.toLowerCase()}</option>
                  {leaves.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          <fieldset className="field finder__budget">
            <legend className="field-label">Ngân sách tối đa</legend>
            <div className="finder__chips">
              {BUDGETS.map(([label, v]) => (
                <button type="button" key={label} className="chip" aria-pressed={budget === v} onClick={() => setBudget(v)}>{label}</button>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="fd-needs">Cần có gì đặc biệt?</label>
            <input
              id="fd-needs"
              className="input"
              placeholder="vd. inverter, wifi, không dây"
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
            />
            <div className="finder__hints">
              {NEED_HINTS.map(h => (
                <button type="button" key={h} onClick={() => addNeed(h)}>+ {h}</button>
              ))}
            </div>
          </div>

          <fieldset className="field">
            <legend className="field-label">Ưu tiên</legend>
            <label className="finder__radio">
              <input type="radio" name="priority" checked={priority === "value"} onChange={() => setPriority("value")} />
              <span><strong>Giá tốt</strong> Rẻ và đang giảm nhiều được xếp trước</span>
            </label>
            <label className="finder__radio">
              <input type="radio" name="priority" checked={priority === "premium"} onChange={() => setPriority("premium")} />
              <span><strong>Cao cấp</strong> Mẫu cao cấp trong ngân sách được xếp trước</span>
            </label>
          </fieldset>
        </form>

        <section className="finder__results" aria-live="polite" aria-label="Gợi ý">
          <p className="finder__summary">
            {fits.length
              ? <><strong>{fits.length}</strong> mẫu phù hợp{budget ? ` với ngân sách ${formatVnd(budget)}` : ""}</>
              : "Chưa có mẫu nào khớp toàn bộ yêu cầu"}
          </p>

          {fits.length === 0 && (
            <div className="finder__none">
              <AlertCircle size={18} aria-hidden="true" />
              <p>Thử tăng ngân sách, bỏ bớt từ khoá hoặc chọn “Mọi nhóm sản phẩm”.</p>
            </div>
          )}

          <ol className="finder__list">
            {fits.map((r, i) => (
              <ResultRow key={r.product.id} r={r} rank={i + 1} {...{ openProduct, addToCart, toggleCompare, isComparing }} />
            ))}
          </ol>

          {near.length > 0 && (
            <>
              <h2 className="finder__near-title">Vượt ngân sách một chút</h2>
              <ol className="finder__list finder__list--near">
                {near.map(r => (
                  <ResultRow key={r.product.id} r={r} {...{ openProduct, addToCart, toggleCompare, isComparing }} />
                ))}
              </ol>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function ResultRow({ r, rank, openProduct, addToCart, toggleCompare, isComparing }) {
  const p = r.product;
  return (
    <li className={`finder__item${rank === 1 ? " is-top" : ""}`}>
      <button className="finder__media" onClick={() => openProduct(p)} tabIndex={-1} aria-hidden="true">
        <img src={getImgUrl(p.image_url || p.image, 240)} alt="" loading="lazy" />
      </button>
      <div className="finder__info">
        {rank === 1 && <span className="finder__top">Hợp nhất với yêu cầu</span>}
        <h3><button onClick={() => openProduct(p)}>{p.name}</button></h3>
        <p className="finder__meta">{[p.brand, keySpecs(p)].filter(Boolean).join(" — ")}</p>
        {r.reasons.length > 0 && (
          <ul className="finder__reasons" aria-label="Lý do phù hợp">
            {r.reasons.map(t => <li key={t}><Check size={14} aria-hidden="true" />{t}</li>)}
          </ul>
        )}
        {r.tradeoffs.length > 0 && (
          <ul className="finder__tradeoffs" aria-label="Cần cân nhắc">
            {r.tradeoffs.map(t => <li key={t}>{t}</li>)}
          </ul>
        )}
      </div>
      <div className="finder__buy">
        <strong className="price">{formatVnd(finalPrice(p))}</strong>
        <button className="btn btn-primary btn-sm" onClick={() => addToCart(p)}>Thêm vào giỏ</button>
        <label className="pcard__compare">
          <input type="checkbox" checked={isComparing(p.id)} onChange={() => toggleCompare(p)} /> So sánh
        </label>
      </div>
    </li>
  );
}

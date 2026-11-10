import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Search, Clock, X } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { getImgUrl } from "../../services/api";
import { formatVnd } from "../../utils/format";
import { finalPrice, matchesQuery, normalize } from "../../utils/product";
import "./SearchBox.css";

const RECENT_KEY = "hometic_recent_searches";

function readRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRecent(list) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* trình duyệt chặn lưu trữ: bỏ qua, chỉ mất lịch sử tìm kiếm */
  }
}

// Ô tìm kiếm có gợi ý: danh mục, sản phẩm, tìm kiếm gần đây. Không phân biệt dấu tiếng Việt.
export default function SearchBox({ onDone, autoFocus = false }) {
  const { catalog, categories, filters, search, openProduct, openCategory } = useStore();
  const [term, setTerm] = useState(filters.q || "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState(readRecent);
  const rootRef = useRef(null);
  const listId = useId();

  useEffect(() => { setTerm(filters.q || ""); }, [filters.q]);

  useEffect(() => {
    const close = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const q = term.trim();

  const { cats, prods, total } = useMemo(() => {
    if (!q) return { cats: [], prods: [], total: 0 };
    const nq = normalize(q);
    const all = catalog.filter(p => matchesQuery(p, q));
    return {
      cats: categories.filter(c => normalize(c.name).includes(nq)).slice(0, 3),
      prods: all.slice(0, 5),
      total: all.length,
    };
  }, [q, catalog, categories]);

  // Danh mục có nhiều sản phẩm nhất — gợi ý khi ô tìm kiếm còn trống
  const popular = useMemo(() => {
    const counts = new Map();
    catalog.forEach(p => counts.set(p.category_id, (counts.get(p.category_id) || 0) + 1));
    return categories
      .filter(c => counts.get(c.id))
      .sort((a, b) => counts.get(b.id) - counts.get(a.id))
      .slice(0, 6);
  }, [catalog, categories]);

  // Danh sách lựa chọn phẳng để điều hướng bằng phím mũi tên
  const options = q
    ? [
      ...cats.map(c => ({ type: "cat", item: c })),
      ...prods.map(p => ({ type: "prod", item: p })),
      ...(total ? [{ type: "all" }] : []),
    ]
    : recent.map(r => ({ type: "recent", item: r }));

  const finish = () => {
    setOpen(false);
    setActive(-1);
    onDone?.();
  };

  const runSearch = (value) => {
    const v = value.trim();
    if (!v) return;
    const next = [v, ...recent.filter(r => normalize(r) !== normalize(v))].slice(0, 5);
    setRecent(next);
    saveRecent(next);
    search(v);
    finish();
  };

  const choose = (opt) => {
    if (!opt) return runSearch(term);
    if (opt.type === "cat") { openCategory(opt.item.slug); finish(); }
    else if (opt.type === "prod") { openProduct(opt.item); finish(); }
    else if (opt.type === "recent") { setTerm(opt.item); runSearch(opt.item); }
    else runSearch(term);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive(i => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(active >= 0 ? options[active] : null);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  const removeRecent = (r) => {
    const next = recent.filter(x => x !== r);
    setRecent(next);
    saveRecent(next);
  };

  const optId = (i) => `${listId}-opt-${i}`;
  let index = -1;
  const nextIndex = () => ++index;

  const showPanel = open && (q || recent.length || popular.length);

  return (
    <div
      className="searchbox"
      ref={rootRef}
      onBlur={(e) => { if (!rootRef.current?.contains(e.relatedTarget)) setOpen(false); }}
    >
      <form className="searchbox__field" role="search" onSubmit={(e) => { e.preventDefault(); choose(active >= 0 ? options[active] : null); }}>
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          placeholder="Tìm sản phẩm, thương hiệu…"
          aria-label="Tìm sản phẩm"
          role="combobox"
          aria-expanded={!!showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? optId(active) : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          value={term}
          onChange={(e) => { setTerm(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {term && (
          <button type="button" className="searchbox__clear" onClick={() => { setTerm(""); setActive(-1); }} aria-label="Xoá nội dung tìm kiếm">
            <X size={16} />
          </button>
        )}
        <button type="submit" className="searchbox__submit">Tìm</button>
      </form>

      {showPanel ? (
        <div className="searchbox__panel" id={listId} role="listbox" aria-label="Gợi ý tìm kiếm">
          {!q && (
            <>
              {recent.length > 0 && (
                <section>
                  <h3 className="searchbox__label">Tìm gần đây</h3>
                  {recent.map((r) => {
                    const i = nextIndex();
                    return (
                      <div key={r} className={`searchbox__row${active === i ? " is-active" : ""}`}>
                        <button id={optId(i)} role="option" aria-selected={active === i} className="searchbox__recent" onClick={() => choose({ type: "recent", item: r })}>
                          <Clock size={15} aria-hidden="true" /> {r}
                        </button>
                        <button className="icon-btn icon-btn-sm" onClick={() => removeRecent(r)} aria-label={`Xoá "${r}" khỏi lịch sử`}>
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </section>
              )}
              <section>
                <h3 className="searchbox__label">Danh mục được xem nhiều</h3>
                <div className="searchbox__chips">
                  {popular.map(c => (
                    <button key={c.id} className="chip" onClick={() => { openCategory(c.slug); finish(); }}>{c.name}</button>
                  ))}
                </div>
              </section>
            </>
          )}

          {q && total === 0 && cats.length === 0 && (
            <div className="searchbox__empty">
              <p>Không có sản phẩm nào khớp “{q}”.</p>
              <p className="muted">Thử từ khoá ngắn hơn, tên thương hiệu, hoặc chọn một danh mục:</p>
              <div className="searchbox__chips">
                {popular.slice(0, 4).map(c => (
                  <button key={c.id} className="chip" onClick={() => { openCategory(c.slug); finish(); }}>{c.name}</button>
                ))}
              </div>
            </div>
          )}

          {q && cats.length > 0 && (
            <section>
              <h3 className="searchbox__label">Danh mục</h3>
              {cats.map(c => {
                const i = nextIndex();
                return (
                  <button key={c.id} id={optId(i)} role="option" aria-selected={active === i} className={`searchbox__cat${active === i ? " is-active" : ""}`} onClick={() => choose({ type: "cat", item: c })}>
                    {c.name}
                  </button>
                );
              })}
            </section>
          )}

          {q && prods.length > 0 && (
            <section>
              <h3 className="searchbox__label">Sản phẩm</h3>
              {prods.map(p => {
                const i = nextIndex();
                return (
                  <button key={p.id} id={optId(i)} role="option" aria-selected={active === i} className={`searchbox__prod${active === i ? " is-active" : ""}`} onClick={() => choose({ type: "prod", item: p })}>
                    <img src={getImgUrl(p.image_url || p.image, 96)} alt="" loading="lazy" />
                    <span className="searchbox__prod-name">{p.name}</span>
                    <span className="price">{formatVnd(finalPrice(p))}</span>
                  </button>
                );
              })}
            </section>
          )}

          {q && total > 0 && (() => {
            const i = nextIndex();
            return (
              <button id={optId(i)} role="option" aria-selected={active === i} className={`searchbox__all${active === i ? " is-active" : ""}`} onClick={() => choose({ type: "all" })}>
                Xem tất cả {total} kết quả cho “{q}”
              </button>
            );
          })()}
        </div>
      ) : null}
    </div>
  );
}

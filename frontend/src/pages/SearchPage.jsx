import React, { useMemo } from "react";
import { PackageSearch } from "lucide-react";
import { useStore } from "../context/StoreContext";
import CatalogView from "../components/product/CatalogView";
import { matchesQuery, normalize } from "../utils/product";

export default function SearchPage() {
  const { catalog, catalogLoading, categories, filters, openCategory, openFinder, go } = useStore();
  const q = (filters?.q || "").trim();

  // Tìm không phân biệt dấu: "noi chien" khớp "Nồi chiên"
  const results = useMemo(() => catalog.filter(p => matchesQuery(p, q)), [catalog, q]);

  // Khi không có kết quả: gợi ý danh mục có tên gần giống từng từ khoá
  const nearCategories = useMemo(() => {
    if (!q || results.length) return [];
    const words = normalize(q).split(/\s+/).filter(w => w.length > 2);
    return categories.filter(c => words.some(w => normalize(c.name).includes(w))).slice(0, 6);
  }, [q, results.length, categories]);

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Vị trí trang">
        <button onClick={() => go("shop")}>Trang chủ</button>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{q ? "Tìm kiếm" : "Tất cả sản phẩm"}</span>
      </nav>

      <header className="plp-head">
        <h1 className="page-title">{q ? <>Kết quả cho “{q}”</> : "Tất cả sản phẩm"}</h1>
        {q && <p className="page-lead">Tìm theo tên, thương hiệu, nhóm và thông số, không cần gõ dấu.</p>}
      </header>

      <CatalogView
        key={q}
        products={results}
        loading={catalogLoading}
        empty={(
          <div className="empty-state">
            <span className="empty-icon"><PackageSearch size={32} aria-hidden="true" /></span>
            <h3>Không tìm thấy “{q}”</h3>
            <p>Kiểm tra lại chính tả, thử tên thương hiệu (vd. Philips, Xiaomi) hoặc một từ chung hơn như “nồi chiên”.</p>
            {nearCategories.length > 0 && (
              <div className="plp-subcats">
                {nearCategories.map(c => <button key={c.id} className="chip" onClick={() => openCategory(c.slug)}>{c.name}</button>)}
              </div>
            )}
            <button className="btn btn-secondary" onClick={() => openFinder()}>Lọc theo nhu cầu thay vì tìm từ khoá</button>
          </div>
        )}
      />
    </div>
  );
}

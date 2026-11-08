import React, { useState, useEffect, useMemo } from "react";
import { PackageOpen } from "lucide-react";
import { catalogService } from "../services/api";
import { useStore } from "../context/StoreContext";
import CatalogView from "../components/product/CatalogView";
import { categoryTree } from "../utils/product";

export default function CategoryDetail() {
  const { categories, catalog, filters, openCategory, go } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const slug = filters?.category_slug;
  const category = categories.find(c => c.slug === slug);

  // Chuỗi danh mục cha → con để làm breadcrumb
  const trail = useMemo(() => {
    const chain = [];
    let c = category;
    while (c) {
      chain.unshift(c);
      c = categories.find(x => x.id === c.parent_id);
    }
    return chain;
  }, [category, categories]);

  const children = category ? categories.filter(c => c.parent_id === category.id) : [];
  const parent = trail.length > 1 ? trail[trail.length - 2] : null;
  const siblings = !children.length && parent ? categories.filter(c => c.parent_id === parent.id) : [];

  useEffect(() => {
    if (!slug) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    catalogService.getProductsByCategory(slug)
      .then(data => { if (!cancelled) setProducts(data || []); })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu danh mục:", error);
        // Không gọi được API: lọc từ catalog đã tải sẵn
        if (!cancelled && category) {
          const ids = categoryTree(categories, category.id);
          setProducts(catalog.filter(p => ids.has(p.category_id)));
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug, category, categories, catalog]);

  const title = category?.name || (slug ? "Danh mục sản phẩm" : "Cửa hàng");
  const nav = children.length ? children : siblings;

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Vị trí trang">
        <button onClick={() => go("shop")}>Trang chủ</button>
        {trail.map((c, i) => (
          <React.Fragment key={c.id}>
            <span aria-hidden="true">/</span>
            {i === trail.length - 1
              ? <span aria-current="page">{c.name}</span>
              : <button onClick={() => openCategory(c.slug)}>{c.name}</button>}
          </React.Fragment>
        ))}
      </nav>

      <header className="plp-head">
        <h1 className="page-title">{title}</h1>
        {category?.description && <p className="page-lead">{category.description}.</p>}
        {nav.length > 0 && (
          <div className="plp-subcats" role="list" aria-label="Nhóm sản phẩm">
            {nav.map(c => (
              <button
                key={c.id}
                role="listitem"
                className="chip"
                aria-pressed={c.slug === slug}
                onClick={() => openCategory(c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </header>

      <CatalogView
        key={slug /* bộ lọc làm mới khi đổi danh mục */}
        products={products}
        loading={loading}
        empty={(
          <div className="empty-state">
            <span className="empty-icon"><PackageOpen size={32} aria-hidden="true" /></span>
            <h3>Nhóm này chưa có sản phẩm</h3>
            <p>Hometic đang cập nhật hàng cho {title.toLowerCase()}. Xem các nhóm khác hoặc quay lại trang chủ.</p>
            <button className="btn btn-secondary" onClick={() => go("shop")}>Về trang chủ</button>
          </div>
        )}
      />
    </div>
  );
}

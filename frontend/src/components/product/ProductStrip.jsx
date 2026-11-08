import React from "react";
import ProductCard from "./ProductCard";

// Một dải sản phẩm có tiêu đề: dạng lưới hoặc hàng cuộn ngang (rail)
export default function ProductStrip({ title, lead, items, layout = "grid", action, getNote }) {
  if (!items.length) return null;

  return (
    <section className="section" aria-label={title}>
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          {lead && <p>{lead}</p>}
        </div>
        {action}
      </div>

      <div className={layout === "rail" ? "rail product-rail" : "product-grid"}>
        {items.map((product) => (
          <ProductCard key={product.id} product={product} note={getNote?.(product)} />
        ))}
      </div>
    </section>
  );
}

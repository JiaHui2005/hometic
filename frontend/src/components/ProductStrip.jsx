import React from "react";
import { Star } from "lucide-react";
import { formatVnd } from "../constants";

export default function ProductStrip({ title, items, addToCart, setActiveTab, setSelectedProduct }) {
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setActiveTab("product_detail");
  };

  return (
    <section className="product-section">
      <div className="section-heading">
        <h2>{title}</h2>
        <button className="ghost">Xem thêm</button>
      </div>
      <div className="product-grid">
        {items.map((product, index) => (
          <article className="product-card" key={product.viewKey || `${product.id}-${index}`}>
            {product.sale_price && <div className="sale-ribbon">Giảm giá</div>}
            <img src={product.image_url} alt={product.name} onClick={() => handleProductClick(product)} style={{ cursor: "pointer" }} />
            <div className="product-body">
              <h3 onClick={() => handleProductClick(product)} style={{ cursor: "pointer" }}>{product.name}</h3>
              <span>{product.description || "Thiết bị gia dụng cao cấp"}</span>
              <strong>{formatVnd(product.sale_price || product.price)}</strong>
              <button onClick={() => addToCart(product)}>Mua ngay</button>
              <button className="review-link" onClick={() => setActiveTab(`review:${product.id}`)}>
                <Star size={13} fill="currentColor" /> Đánh giá
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

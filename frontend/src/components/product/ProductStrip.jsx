import React from "react";
import alertService from "../../services/alertService";
import ProductCard from "./ProductCard";

export default function ProductStrip({ title, items, addToCart, setActiveTab, setSelectedProduct }) {
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setActiveTab("product_detail");
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    setActiveTab("cart");
    alertService.success(`Đã thêm thành công "${product.name}" vào giỏ hàng!`);
  };

  if (!items.length) return null;

  return (
    <section className="section">
      <div className="section-head">
        <h2>{title}</h2>
        <button className="section-head__link" onClick={() => setActiveTab("search")}>
          Xem tất cả
        </button>
      </div>

      <div className="product-grid">
        {items.map((product, index) => (
          <ProductCard
            key={product.viewKey || `${product.id}-${index}`}
            product={product}
            meta={product.description}
            onOpen={handleProductClick}
            onBuy={handleBuyNow}
          />
        ))}
      </div>
    </section>
  );
}

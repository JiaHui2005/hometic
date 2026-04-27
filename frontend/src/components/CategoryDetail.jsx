import React from "react";
import { formatVnd } from "../constants";

export default function CategoryDetail({ products, addToCart, setActiveTab, setSelectedProduct }) {
  // Mock image for the product as seen in the image (robot vacuum)
  const productImg = "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80";

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setActiveTab("product_detail");
  };

  const displayProducts = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    name: "Item name",
    price: 49.99,
    image: productImg
  }));

  const ProductCard = ({ product, isFilled }) => (
    <div className="category-product-card">
      <div className="product-image-container" onClick={() => handleProductClick(product)} style={{ cursor: "pointer" }}>
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info" onClick={() => handleProductClick(product)} style={{ cursor: "pointer" }}>
        <span className="info-label">{product.name}</span>
        <span className="info-label">Price</span>
        <strong className="info-price">${product.price.toFixed(2)}</strong>
      </div>
      <button
        className={isFilled ? "btn-filled" : "btn-outline"}
        onClick={() => addToCart(product)}
      >
        Mua ngay
      </button>
    </div>
  );

  return (
    <div className="category-detail-container">
      <h1
        className="category-title"
        style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#ffffffff',
          marginBottom: '20px',
          textAlign: 'center'
        }}
      >
        Gia dụng nhà bếp
      </h1>
      <div className="category-product-grid">
        {displayProducts.map((p, i) => (
          <ProductCard key={i} product={p} isFilled={i === 3 || i === 8} />
        ))}
      </div>

      <h2
        className="section-subtitle"
        style={{
          color: '#ffffff',
          fontSize: '1.5rem',
          padding: '10px',
          textAlign: 'center'

        }}
      >
        Tất cả sản phẩm
      </h2>

      <div className="category-product-grid">
        {displayProducts.slice(0, 5).map((p, i) => (
          <ProductCard key={i} product={p} isFilled={i === 3} />
        ))}
      </div>
    </div>
  );
}

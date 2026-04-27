import React, { useState } from "react";
import { formatVnd } from "../constants";

export default function ProductDetail({ product, addToCart, setActiveTab }) {
  const [quantity, setQuantity] = useState(1);

  // Mock product data if none provided (based on image)
  const defaultProduct = {
    name: "Hometic Hộp đựng thực phẩm",
    sku: "019583262",
    price: 166000,
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1590422443831-768569888998?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&w=600&q=80"
    ],
    details: [
      { label: "Kích thước", value: "≈188 x 75 x 142 mm" },
      { label: "Sức chứa", value: "980ml" },
      { label: "Tên các bộ phận", value: "Hộp gồm: nắp lật, nắp trên, vòng gioăng, thân hộp." },
      { label: "Chất liệu", value: "Polyme của polyethylene và methyl methacrylate." },
      { label: "Trước khi sử dụng", value: "Trước lần sử dụng đầu tiên, hãy dùng dụng cụ vệ sinh mềm và nước sạch để rửa các bộ phận, đồng thời lắp ráp đúng cách." },
      { label: "Trong khi sử dụng", value: "Không dùng trong lò vi sóng, lò nướng, trên lửa trực tiếp hoặc đặt cạnh vật có nhiệt độ cao; có thể gây biến dạng hoặc hư hỏng." },
      { label: "Sau khi sử dụng", value: "Không rửa bằng máy rửa chén." },
      { label: "Lưu ý khác", value: "Không dùng cho mục đích khác ngoài bảo quản thực phẩm." }
    ]
  };

  const p = product || defaultProduct;
  const [mainImage, setMainImage] = useState(p.images[0]);

  return (
    <div className="product-detail-page">
      <div className="product-main-info">
        {/* Gallery */}
        <div className="product-gallery">
          <div className="thumbnail-list">
            {p.images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`thumb-${idx}`} 
                className={mainImage === img ? "active" : ""}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          <div className="main-image">
            <img src={mainImage} alt={p.name} />
          </div>
        </div>

        {/* Content */}
        <div className="product-content">
          <h1 className="product-title">{p.name}</h1>
          <p className="product-sku">SKU: {p.sku}</p>
          <div className="product-price">{p.price.toLocaleString()}VND</div>

          <div className="qty-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <input type="text" value={quantity} readOnly />
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div className="action-buttons">
            <button className="btn-add-cart" onClick={() => addToCart({ ...p, quantity })}>
              Thêm vào giỏ hàng
            </button>
            <button className="btn-buy-now">
              Mua nhanh
            </button>
          </div>
        </div>
      </div>

      {/* Specification Table */}
      <div className="product-specs">
        <table className="specs-table">
          <thead>
            <tr>
              <th>Thông tin</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {p.details.map((detail, idx) => (
              <tr key={idx}>
                <td className="spec-label">{detail.label}</td>
                <td className="spec-value">{detail.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from "react";
import { Plus } from "lucide-react";
import { formatVnd } from "../../utils/format";
import { getImgUrl } from "../../services/api";
import "./Product.css";

// Thẻ sản phẩm dùng chung: click thẻ để xem chi tiết, nút "Mua ngay" thêm vào giỏ
export default function ProductCard({ product, onOpen, onBuy, meta }) {
  const hasSale = !!product.sale_price;
  const discount = hasSale && product.price
    ? Math.round((1 - product.sale_price / product.price) * 100)
    : 0;

  return (
    <article className="product-card" onClick={() => onOpen(product)}>
      <div className="product-card__media">
        {hasSale && discount > 0 && <span className="product-card__sale">−{discount}%</span>}
        <img
          src={getImgUrl(product.image_url || product.image)}
          alt={product.name}
          loading="lazy"
        />
      </div>

      <div className="product-card__body">
        {meta && <span className="product-card__meta">{meta}</span>}
        <h3 className="product-card__name">{product.name}</h3>

        <div className="product-card__foot">
          <div className="product-card__price">
            <strong className="price">{formatVnd(product.sale_price || product.price)}</strong>
            {hasSale && <s>{formatVnd(product.price)}</s>}
          </div>
          <button
            className="product-card__buy"
            onClick={(e) => { e.stopPropagation(); onBuy(product); }}
            aria-label={`Mua ngay ${product.name}`}
          >
            <Plus size={16} />
            <span className="product-card__buy-label">Mua ngay</span>
          </button>
        </div>
      </div>
    </article>
  );
}

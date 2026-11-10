import React from "react";
import { ShoppingBag } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { formatVnd } from "../../utils/format";
import { getImgUrl } from "../../services/api";
import { finalPrice, discountPercent, keySpecs, stockStatus } from "../../utils/product";
import "./Product.css";

// Thẻ sản phẩm: ảnh → tên → điểm khác biệt (thông số) → giá → hành động.
export default function ProductCard({ product, note, compact = false }) {
  const { openProduct, addToCart, toggleCompare, isComparing } = useStore();
  const off = discountPercent(product);
  const specs = keySpecs(product);
  const stock = stockStatus(product);
  const soldOut = stock?.tone === "out";
  const comparing = isComparing(product.id);

  return (
    <article className={`pcard${compact ? " pcard--compact" : ""}`}>
      <button className="pcard__media" onClick={() => openProduct(product)} tabIndex={-1} aria-hidden="true">
        <img src={getImgUrl(product.image_url || product.image, 480)} alt="" loading="lazy" />
        {off >= 5 && <span className="pcard__off">−{off}%</span>}
      </button>

      <div className="pcard__body">
        {product.brand && <span className="pcard__brand">{product.brand}</span>}
        <h3 className="pcard__name">
          <button onClick={() => openProduct(product)}>{product.name}</button>
        </h3>
        {specs && <p className="pcard__specs">{specs}</p>}
        {note && <p className="pcard__note">{note}</p>}

        <div className="pcard__price">
          <strong className="price">{formatVnd(finalPrice(product))}</strong>
          {off > 0 && <s className="price-old">{formatVnd(product.price)}</s>}
        </div>
        {stock && stock.tone !== "in" && <span className={`stock stock--${stock.tone}`}>{stock.label}</span>}
      </div>

      <div className="pcard__actions">
        <button
          className="btn btn-outline btn-sm pcard__add"
          onClick={() => addToCart(product)}
          disabled={soldOut}
          aria-label={`Thêm ${product.name} vào giỏ`}
        >
          <ShoppingBag size={15} aria-hidden="true" />
          <span className="pcard__add-label">{soldOut ? "Hết hàng" : "Thêm vào giỏ"}</span>
        </button>
        <label className="pcard__compare">
          <input type="checkbox" checked={comparing} onChange={() => toggleCompare(product)} />
          So sánh
        </label>
      </div>
    </article>
  );
}

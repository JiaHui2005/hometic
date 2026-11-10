import React, { useState, useEffect, useMemo } from "react";
import { ShieldCheck, Truck, RefreshCw, Minus, Plus, PackageX, MapPin } from "lucide-react";
import { formatVnd } from "../utils/format";
import { catalogService, getImgUrl } from "../services/api";
import { useStore } from "../context/StoreContext";
import { finalPrice, discountPercent, savings, specEntries, stockStatus, keySpecs } from "../utils/product";
import { productHighlights, alternatives } from "../utils/guidance";
import { ProductCard } from "../components/product";
import Reviews from "../components/common/Reviews";
import RichText from "../components/common/RichText";
import "./ProductDetail.css";

// Ảnh trong gallery_urls có thể là tên file mẫu không tồn tại — chỉ nhận đường dẫn thật
const isRealImage = (u) => typeof u === "string" && (u.startsWith("http") || u.startsWith("static/") || u.startsWith("/"));


export default function ProductDetail({ product: initialProduct }) {
  const { catalog, categories, addToCart, go, openCategory, search, toggleCompare, isComparing } = useStore();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialProduct?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setQuantity(1);
    setActiveImage(0);
    catalogService.getProduct(initialProduct.id)
      .then(data => { if (!cancelled) setProduct(data); })
      .catch((err) => {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
        // Không gọi được API (vd: chế độ demo) thì vẫn hiển thị dữ liệu đã có
        if (!cancelled) setProduct(initialProduct);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [initialProduct]);

  const highlights = useMemo(() => (product ? productHighlights(product, catalog) : []), [product, catalog]);
  const alts = useMemo(() => (product ? alternatives(product, catalog) : []), [product, catalog]);

  const trail = useMemo(() => {
    const chain = [];
    let c = product?.category && categories.find(x => x.id === product.category.id);
    while (c) {
      chain.unshift(c);
      c = categories.find(x => x.id === c.parent_id);
    }
    return chain;
  }, [product, categories]);

  if (loading) {
    return (
      <div className="container page pd" aria-busy="true" aria-label="Đang tải sản phẩm">
        <div className="skeleton" style={{ aspectRatio: "1" }} />
        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <div className="skeleton" style={{ height: 40, width: "80%" }} />
          <div className="skeleton" style={{ height: 24, width: "40%" }} />
          <div className="skeleton" style={{ height: 120 }} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container page">
        <div className="empty-state">
          <span className="empty-icon"><PackageX size={32} aria-hidden="true" /></span>
          <h3>Không tìm thấy sản phẩm</h3>
          <p>Sản phẩm có thể đã ngừng bán. Xem các sản phẩm khác trong cửa hàng.</p>
          <button className="btn btn-secondary" onClick={() => go("shop")}>Về trang chủ</button>
        </div>
      </div>
    );
  }

  const images = [product.image_url || product.image, ...(product.detail?.gallery_urls || []).filter(isRealImage)].filter(Boolean);
  const off = discountPercent(product);
  const saved = savings(product);
  const stock = stockStatus(product);
  const soldOut = stock?.tone === "out";
  const specs = specEntries(product);
  const warranty = product.detail?.warranty_info;
  const origin = product.detail?.origin;
  const about = product.detail?.content;
  const comparing = isComparing(product.id);

  const handleAdd = () => addToCart({ ...product, quantity });
  const handleBuyNow = () => {
    addToCart({ ...product, quantity }, { silent: true });
    go("cart");
  };

  return (
    <div className="pd-page">
      <div className="container page">
        <nav className="breadcrumb" aria-label="Vị trí trang">
          <button onClick={() => go("shop")}>Trang chủ</button>
          {trail.map(c => (
            <React.Fragment key={c.id}>
              <span aria-hidden="true">/</span>
              <button onClick={() => openCategory(c.slug)}>{c.name}</button>
            </React.Fragment>
          ))}
        </nav>

        <div className="pd">
          {/* Ảnh */}
          <div className="pd__gallery">
            <div className="pd__image">
              <img key={activeImage} className="pd__image-current" src={getImgUrl(images[activeImage], 1000)} alt={product.name} />
              {off >= 5 && <span className="pd__off">−{off}%</span>}
            </div>
            {images.length > 1 && (
              <div className="pd__thumbs" role="list" aria-label="Ảnh sản phẩm">
                {images.map((src, i) => (
                  <button key={src + i} role="listitem" className={i === activeImage ? "is-active" : ""} onClick={() => setActiveImage(i)} aria-label={`Ảnh ${i + 1}`}>
                    <img src={getImgUrl(src, 160)} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Khối mua */}
          <div className="pd__buybox">
            {product.brand && (
              <button className="pd__brand" onClick={() => search(product.brand)}>{product.brand}</button>
            )}
            <h1 className="pd__title">{product.name}</h1>
            {keySpecs(product, 3) && <p className="pd__keyspecs">{keySpecs(product, 3)}</p>}

            <div className="pd__price">
              <strong className="price">{formatVnd(finalPrice(product))}</strong>
              {off > 0 && <s className="price-old">{formatVnd(product.price)}</s>}
            </div>
            {saved > 0 && <p className="pd__save">Tiết kiệm {formatVnd(saved)} so với giá gốc</p>}
            {stock && <span className={`stock stock--${stock.tone}`}>{stock.label}</span>}

            <div className="pd__buy">
              <div className="qty" role="group" aria-label="Số lượng">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Giảm số lượng" disabled={quantity <= 1}><Minus size={16} /></button>
                <span aria-live="polite">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} aria-label="Tăng số lượng"><Plus size={16} /></button>
              </div>
              <button className="btn btn-primary btn-lg pd__add" onClick={handleAdd} disabled={soldOut}>
                {soldOut ? "Tạm hết hàng" : "Thêm vào giỏ"}
              </button>
              <button className="btn btn-outline btn-lg" onClick={handleBuyNow} disabled={soldOut}>Mua ngay</button>
            </div>

            <label className="pcard__compare pd__compare">
              <input type="checkbox" checked={comparing} onChange={() => toggleCompare(product)} />
              Thêm vào so sánh
            </label>

            <ul className="pd__service">
              <li><Truck size={18} aria-hidden="true" /><span><strong>Giao trong 2–4 giờ</strong> ở nội thành TP.HCM và Hà Nội, tỉnh khác 2–4 ngày</span></li>
              {warranty && <li><ShieldCheck size={18} aria-hidden="true" /><span><strong>Bảo hành {warranty}</strong> chính hãng</span></li>}
              <li><RefreshCw size={18} aria-hidden="true" /><span><strong>Đổi mới trong 7 ngày</strong> nếu lỗi kỹ thuật từ nhà sản xuất</span></li>
              {origin && <li><MapPin size={18} aria-hidden="true" /><span>Xuất xứ: {origin}</span></li>}
            </ul>
          </div>
        </div>

        {/* Vì sao nên chọn: chỉ nêu điều đo được so với các mẫu cùng nhóm */}
        {highlights.length > 0 && (
          <section className="pd__why" aria-labelledby="pd-why">
            <h2 id="pd-why">Vì sao nên chọn mẫu này</h2>
            <ul>
              {highlights.map(h => (
                <li key={h.title}>
                  <strong>{h.title}</strong>
                  <span>{h.detail}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="pd__details">
          <section aria-labelledby="pd-specs">
            <h2 id="pd-specs">Thông số kỹ thuật</h2>
            {specs.length > 0 ? (
              <dl className="spec-list">
                {specs.map(s => (
                  <div key={s.key} className="spec-list__row">
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
                {warranty && <div className="spec-list__row"><dt>Bảo hành</dt><dd>{warranty}</dd></div>}
                {origin && <div className="spec-list__row"><dt>Xuất xứ</dt><dd>{origin}</dd></div>}
              </dl>
            ) : (
              <p className="muted">Thông số đang được cập nhật.</p>
            )}
          </section>

          {(product.detail?.description || about) && (
            <section aria-labelledby="pd-about">
              <h2 id="pd-about">Giới thiệu</h2>
              {product.detail?.description && <p className="pd__lede">{product.detail.description}</p>}
              {about && <RichText className="pd__about" html={about} />}
            </section>
          )}
        </div>

        {alts.length > 0 && (
          <section className="section pd__alts" aria-labelledby="pd-alts">
            <div className="section-head">
              <div>
                <h2 id="pd-alts">Cân nhắc thêm</h2>
                <p>Các mẫu cùng nhóm {product.category?.name?.toLowerCase()}, so với giá của mẫu này</p>
              </div>
            </div>
            <div className="pd__alts-grid">
              {alts.map(a => (
                <div key={a.product.id} className="pd__alt">
                  <p className="pd__alt-label"><strong>{a.label}</strong> {a.reason}</p>
                  <ProductCard product={a.product} />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="pd__reviews">
          <Reviews productId={product.id} showForm={false} />
        </div>
      </div>

      {/* Thanh mua cố định trên điện thoại */}
      <div className="pd__sticky" aria-hidden="true">
        <div>
          <strong className="price">{formatVnd(finalPrice(product))}</strong>
          {off > 0 && <span className="price-off">−{off}%</span>}
        </div>
        <button className="btn btn-primary" tabIndex={-1} onClick={handleAdd} disabled={soldOut}>
          {soldOut ? "Tạm hết hàng" : "Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
}

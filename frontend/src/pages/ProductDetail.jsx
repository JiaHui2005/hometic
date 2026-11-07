import React, { useState, useEffect } from "react";
import { ShieldCheck, Truck, Minus, Plus, ShoppingBag, PackageX } from "lucide-react";
import { formatVnd } from "../utils/format";
import { catalogService, getImgUrl } from "../services/api";
import alertService from "../services/alertService";
import Reviews from "../components/common/Reviews";
import "./ProductDetail.css";

export default function ProductDetail({ product: initialProduct, addToCart, setActiveTab }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (initialProduct?.id) {
      loadProductDetail(initialProduct.id);
    } else {
      setLoading(false);
    }
  }, [initialProduct]);

  const loadProductDetail = async (id) => {
    try {
      setLoading(true);
      const data = await catalogService.getProduct(id);
      setProduct(data);
      setMainImage(getImgUrl(data.image_url));
    } catch (err) {
      console.error("Lỗi lấy chi tiết sản phẩm:", err);
      // Không gọi được API (vd: chế độ demo) thì vẫn hiển thị dữ liệu đã có
      setProduct(initialProduct);
      setMainImage(getImgUrl(initialProduct.image_url || initialProduct.image));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-block" style={{ minHeight: "60vh" }}><div className="spinner" /></div>;
  }

  if (!product) {
    return (
      <div className="container page">
        <div className="empty-state">
          <span className="empty-icon"><PackageX size={28} /></span>
          <h3>Không tìm thấy sản phẩm</h3>
          <button className="btn btn-secondary" onClick={() => setActiveTab("shop")}>Về trang chủ</button>
        </div>
      </div>
    );
  }

  const hasSale = !!product.sale_price;

  const specs = product.detail?.specifications && typeof product.detail.specifications === "object"
    ? Object.entries(product.detail.specifications).map(([key, value]) => ({ label: key, value }))
    : (product.details || []);

  const handleAdd = () => {
    addToCart({ ...product, quantity });
    alertService.success("Đã thêm vào giỏ", `${quantity} × ${product.name}`);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    setActiveTab("cart");
  };

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <button onClick={() => setActiveTab("shop")}>Trang chủ</button>
        {product.category?.name && <><span>/</span><span>{product.category.name}</span></>}
      </nav>

      <div className="pd">
        <div className="pd__gallery">
          <div className="pd__image">
            <img src={getImgUrl(mainImage)} alt={product.name} />
          </div>
        </div>

        <div className="pd__info">
          <h1 className="pd__title">{product.name}</h1>
          <dl className="pd__meta">
            <div><dt>Thương hiệu</dt><dd>{product.brand || "Hometic"}</dd></div>
            <div><dt>Mã sản phẩm</dt><dd>{product.id}</dd></div>
          </dl>

          <div className="pd__price">
            <strong className="price">{formatVnd(product.sale_price || product.price)}</strong>
            {hasSale && <s>{formatVnd(product.price)}</s>}
          </div>

          <p className="pd__desc">
            {product.description || "Nâng tầm đẳng cấp không gian sống với thiết bị thông minh từ Hometic."}
          </p>

          <div className="pd__buy">
            <div className="qty" role="group" aria-label="Số lượng">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Giảm số lượng"><Minus size={16} /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} aria-label="Tăng số lượng"><Plus size={16} /></button>
            </div>
            <button className="btn btn-secondary btn-lg" onClick={handleAdd}>
              <ShoppingBag size={18} />
              Thêm vào giỏ
            </button>
            <button className="btn btn-primary btn-lg pd__buy-now" onClick={handleBuyNow}>
              Mua ngay
            </button>
          </div>

          <ul className="pd__policy">
            <li><Truck size={18} /> Miễn phí vận chuyển</li>
            <li><ShieldCheck size={18} /> Bảo hành 24 tháng</li>
          </ul>
        </div>
      </div>

      <section className="pd__specs">
        <h2>Thông số kỹ thuật</h2>
        {specs.length > 0 ? (
          <dl className="spec-list">
            {specs.map((item, idx) => (
              <div key={idx} className="spec-list__row">
                <dt>{item.label}</dt>
                <dd>{String(item.value)}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="muted">Thông số đang được cập nhật.</p>
        )}
      </section>

      <div className="pd__reviews">
        <Reviews productId={product.id} showForm={false} />
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Star, Package, ShieldCheck, Truck, Loader2, Minus, Plus } from "lucide-react";
import { formatVnd } from "../constants";
import { catalogService } from "../services/api";
import Reviews from "./Reviews";

export default function ProductDetail({ product: initialProduct, addToCart, setActiveTab }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);

  const brand = {
    bg: "#f9f5ed",
    panelBg: "#ffffff",
    primary: "#234a4a",
    orange: "#da8f48",
    white: "#ffffff",
    text: "#1a1a1a",
    muted: "#71717a",
    border: "#dcd7cc"
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (initialProduct?.id) {
      loadProductDetail(initialProduct.id);
    }
  }, [initialProduct]);

  const loadProductDetail = async (id) => {
    try {
      setLoading(true);
      const data = await catalogService.getProduct(id);
      setProduct(data);
      setMainImage(data.image_url);
    } catch (err) {
      console.error("Lỗi lấy chi tiết sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', backgroundColor: brand.bg }}>
        <Loader2 className="animate-spin" size={40} color={brand.primary} />
      </div>
    );
  }

  if (!product) return <div style={{ textAlign: 'center', padding: '100px' }}>Không tìm thấy sản phẩm.</div>;

  const hasSale = !!product.sale_price;
  const isMobile = window.innerWidth <= 768;

  const specs = product.detail?.specifications
    ? Object.entries(product.detail.specifications).map(([key, value]) => ({ label: key, value }))
    : [];

  const styles = {
    page: { backgroundColor: brand.bg, minHeight: '100vh', padding: isMobile ? '20px' : '60px 10%', color: brand.text, fontFamily: '"Inter", sans-serif' },
    mainContainer: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '60px', marginBottom: '60px', alignItems: 'flex-start' },
    gallery: { flex: 1, maxWidth: isMobile ? '100%' : '500px' },
    mainImgBox: { backgroundColor: brand.white, borderRadius: '30px', overflow: 'hidden', border: `1px solid ${brand.border}`, boxShadow: '0 20px 40px rgba(35, 74, 74, 0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
    content: { flex: 1.2, display: 'flex', flexDirection: 'column', gap: '15px' },
    badge: { display: 'inline-block', padding: '6px 16px', backgroundColor: brand.text, color: 'white', borderRadius: '10px', fontSize: '12px', fontWeight: '800', width: 'fit-content', textTransform: 'uppercase' },
    title: { fontSize: isMobile ? '28px' : '36px', fontWeight: '900', margin: '10px 0 0', color: brand.text, lineHeight: '1.2' },

    // STYLE GIÁ ĐÃ CẬP NHẬT
    priceSection: { display: 'flex', alignItems: 'center', gap: '15px', margin: '10px 0', color: brand.text },
    activePrice: { fontSize: '32px', fontWeight: '900', color: brand.text },
    oldPrice: { fontSize: '18px', color: brand.muted, textDecoration: 'line-through', fontWeight: '500' },

    policy: { display: 'flex', gap: '25px', padding: '20px 0', borderTop: `1px solid ${brand.border}`, borderBottom: `1px solid ${brand.border}`, margin: '10px 0' },
    policyItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: brand.text },

    qtySelector: { display: 'flex', alignItems: 'center', gap: '20px', margin: '20px 0' },
    qtyWrapper: { display: 'flex', alignItems: 'center', border: `1px solid ${brand.text}`, borderRadius: '15px', overflow: 'hidden', backgroundColor: 'white', width: '160px', height: '48px' },
    qtyBtn: { flex: '1', height: '100%', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: brand.text, transition: '0.2s', padding: '0' },
    qtyText: { width: '50px', textAlign: 'center', fontSize: '18px', fontWeight: '800', color: brand.text },

    specsSection: { backgroundColor: brand.white, padding: isMobile ? '25px' : '45px', borderRadius: '30px', border: `1px solid ${brand.border}`, marginBottom: '60px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    row: { borderBottom: `1px solid #f2f0eb` },
    label: { padding: '18px', fontWeight: '800', color: brand.text, width: '35%', backgroundColor: '#faf9f6', fontSize: '14px' },
    val: { padding: '18px', color: brand.text, fontSize: '14px' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.mainContainer}>
        {/* Gallery */}
        <div style={styles.gallery}>
          <div style={styles.mainImgBox}>
            <img src={mainImage} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
          </div>
        </div>

        {/* Product Info */}
        <div style={styles.content}>
          <div style={styles.badge}>{product.category?.name || "Premium"}</div>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={{ color: brand.muted, fontSize: '14px', fontWeight: '600' }}>
            THƯƠNG HIỆU: <span style={{ color: brand.text }}>{product.brand}</span> | SKU: <span style={{ color: brand.text }}>{product.id}</span>
          </p>

          {/* PHẦN GIÁ ĐỒNG BỘ */}
          <div style={styles.priceSection}>
            <div style={styles.activePrice}>
              {formatVnd(product.sale_price || product.price)}
            </div>
            {hasSale && (
              <div style={styles.oldPrice}>
                {formatVnd(product.price)}
              </div>
            )}
          </div>

          <p style={{ lineHeight: '1.8', color: brand.muted, fontSize: '15px' }}>
            {product.description || "Nâng tầm đẳng cấp không gian sống với thiết bị thông minh từ Hometic."}
          </p>

          <div style={styles.policy}>
            <div style={styles.policyItem}><Truck size={20} color={brand.orange} /> Miễn phí vận chuyển</div>
            <div style={styles.policyItem}><ShieldCheck size={20} color={brand.orange} /> Bảo hành 24 tháng</div>
          </div>

          <div style={styles.qtySelector}>
            <span style={{ fontWeight: '800', color: brand.text }}>SỐ LƯỢNG:</span>
            <div style={styles.qtyWrapper}>
              <button style={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus size={18} />
              </button>
              <div style={styles.qtyText}>{quantity}</div>
              <button style={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}>
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <button
              onClick={() => addToCart({ ...product, quantity })}
              style={{ flex: 1, padding: '18px', backgroundColor: brand.orange, color: brand.white, borderRadius: '15px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', transition: '0.3s' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = brand.primary; e.currentTarget.style.color = 'white'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = brand.orange; e.currentTarget.style.color = brand.white; }}
            >
              THÊM VÀO GIỎ
            </button>
            <button
              onClick={() => { addToCart({ ...product, quantity }); setActiveTab("cart"); }}
              style={{ flex: 1, padding: '18px', backgroundColor: brand.orange, color: brand.white, border: 'none', borderRadius: '15px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(35, 74, 74, 0.15)' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = brand.primary; e.currentTarget.style.color = 'white'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = brand.orange; e.currentTarget.style.color = brand.white; }}
            >
              MUA NGAY
            </button>
          </div>
        </div>
      </div>

      {/* Thông số kỹ thuật */}
      <div style={styles.specsSection}>
        <h2 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '30px', color: brand.text, borderLeft: `5px solid ${brand.orange}`, paddingLeft: '15px' }}>
          CHI TIẾT SẢN PHẨM
        </h2>
        {specs.length > 0 ? (
          <div style={{ borderRadius: '20px', overflow: 'hidden', border: `1px solid ${brand.border}` }}>
            <table style={styles.table}>
              <tbody>
                {specs.map((item, idx) => (
                  <tr key={idx} style={styles.row}>
                    <td style={styles.label}>{item.label}</td>
                    <td style={styles.val}>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: brand.muted, fontStyle: 'italic' }}>Thông số đang được cập nhật...</p>
        )}
      </div>

      {/* Reviews */}
      <div style={{ marginTop: '80px', borderTop: `1px solid ${brand.border}`, paddingTop: '60px' }}>
        <Reviews productId={product.id} showForm={false} />
      </div>
    </div>
  );
}
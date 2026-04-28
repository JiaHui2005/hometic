import React, { useState, useEffect } from "react";
import { Star, Package, ShieldCheck, Truck, Loader2, Minus, Plus } from "lucide-react"; // Thêm Minus, Plus
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
    muted: "#666",
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

  const specs = product.detail?.specifications
    ? Object.entries(product.detail.specifications).map(([key, value]) => ({ label: key, value }))
    : [];

  const isMobile = window.innerWidth <= 768;

  const styles = {
    page: { backgroundColor: brand.bg, minHeight: '100vh', padding: isMobile ? '20px' : '40px 10%', color: brand.text, fontFamily: '"Inter", sans-serif' },
    mainContainer: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '60px', marginBottom: '60px', alignItems: 'flex-start' },
    gallery: { flex: 1, maxWidth: isMobile ? '100%' : '500px' },
    mainImgBox: { backgroundColor: brand.white, borderRadius: '30px', overflow: 'hidden', border: `1px solid ${brand.border}`, boxShadow: '0 20px 40px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    content: { flex: 1.2, display: 'flex', flexDirection: 'column', gap: '15px' },
    badge: { display: 'inline-block', padding: '6px 16px', backgroundColor: brand.primary, color: 'white', borderRadius: '10px', fontSize: '12px', fontWeight: '800', width: 'fit-content' },
    title: { fontSize: isMobile ? '28px' : '38px', fontWeight: '900', margin: 0, color: brand.primary, lineHeight: '1.2' },
    price: { fontSize: '32px', fontWeight: '900', color: brand.orange, margin: '10px 0' },
    policy: { display: 'flex', gap: '25px', padding: '20px 0', borderTop: `1px solid ${brand.border}`, borderBottom: `1px solid ${brand.border}`, margin: '10px 0' },
    policyItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: brand.primary },

    // Fix lại nút cộng trừ ở đây
    qtySelector: { display: 'flex', alignItems: 'center', gap: '20px', margin: '20px 0' },
    qtyWrapper: { display: 'flex', alignItems: 'center', border: `2px solid ${brand.primary}`, borderRadius: '15px', overflow: 'hidden', backgroundColor: 'white' },
    qtyBtn: { width: '50px', height: '50px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: brand.primary, transition: '0.2s', padding: 0 },
    qtyText: { width: '60px', textAlign: 'center', fontSize: '18px', fontWeight: '800', color: brand.primary, borderLeft: `1px solid ${brand.border}`, borderRight: `1px solid ${brand.border}` },

    specsSection: { backgroundColor: brand.white, padding: isMobile ? '25px' : '45px', borderRadius: '30px', border: `1px solid ${brand.border}`, marginBottom: '60px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    row: { borderBottom: `1px solid #f2f0eb` },
    label: { padding: '18px', fontWeight: '800', color: brand.primary, width: '35%', backgroundColor: '#faf9f6', fontSize: '14px' },
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
          <div style={styles.badge}>{product.category?.name || "Sản phẩm mới"}</div>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={{ color: brand.muted, fontSize: '15px', fontWeight: '500' }}>
            Thương hiệu: <span style={{ color: brand.primary, fontWeight: '700' }}>{product.brand}</span> | SKU: {product.id}
          </p>

          <div style={styles.price}>{formatVnd(product.sale_price || product.price)}</div>

          <p style={{ lineHeight: '1.7', color: brand.muted, fontSize: '15px' }}>
            {product.description || "Sản phẩm gia dụng thông minh Hometic giúp nâng tầm không gian sống của bạn."}
          </p>

          <div style={styles.policy}>
            <div style={styles.policyItem}><Truck size={20} color={brand.secondary || brand.orange} /> Giao hàng nhanh</div>
            <div style={styles.policyItem}><ShieldCheck size={20} color={brand.secondary || brand.orange} /> Bảo hành chính hãng</div>
          </div>

          <div style={styles.qtySelector}>
            <span style={{ fontWeight: '800', color: brand.primary }}>Số lượng:</span>
            <div style={styles.qtyWrapper}>
              <button
                style={styles.qtyBtn}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Minus size={20} />
              </button>
              <div style={styles.qtyText}>{quantity}</div>
              <button
                style={styles.qtyBtn}
                onClick={() => setQuantity(quantity + 1)}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            <button
              onClick={() => addToCart({ ...product, quantity })}
              style={{ flex: 1, padding: '20px', backgroundColor: brand.primary, color: 'white', border: 'none', borderRadius: '18px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', transition: '0.3s', boxShadow: '0 10px 20px rgba(35, 74, 74, 0.2)' }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              THÊM VÀO GIỎ
            </button>
            <button
              onClick={() => { addToCart({ ...product, quantity }); setActiveTab("cart"); }}
              style={{ flex: 1, padding: '20px', backgroundColor: brand.orange, color: 'white', border: 'none', borderRadius: '18px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', transition: '0.3s', boxShadow: '0 10px 20px rgba(218, 143, 72, 0.2)' }}
            >
              MUA NGAY
            </button>
          </div>
        </div>
      </div>

      {/* Thông số kỹ thuật */}
      <div style={styles.specsSection}>
        <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '30px', color: brand.primary, borderLeft: `6px solid ${brand.orange}`, paddingLeft: '20px' }}>
          THÔNG SỐ KỸ THUẬT
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
          <p style={{ color: brand.muted, fontStyle: 'italic' }}>Dữ liệu thông số đang được cập nhật...</p>
        )}
      </div>

      {/* Reviews */}
      <div style={{ marginTop: '80px', borderTop: `1px solid ${brand.border}`, paddingTop: '60px' }}>
        <Reviews productId={product.id} showForm={false} />
      </div>
    </div>
  );
}
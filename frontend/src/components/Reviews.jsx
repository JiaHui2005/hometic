import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Send, User as UserIcon, Loader2 } from "lucide-react";
import { reviewService } from "../services/api";

export default function Reviews({ productId, showForm = true }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const brand = {
    bg: "#f9f5ed",
    white: "#ffffff",
    primary: "#234a4a", // Xanh đậm Hometic
    secondary: "#ed7f1a", // Cam Hometic
    text: "#1a1a1a",
    muted: "#71717a",
    border: "#e5e1d8",
    starEmpty: "#dcd7cc"
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setFetching(true);
      const data = await reviewService.getProductReviews(productId);
      setReviews(data);
    } catch (err) {
      console.error("Lỗi lấy đánh giá:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.comment.trim()) return;
    setLoading(true);
    try {
      const payload = { product_id: productId, rating: form.rating, comment: form.comment };
      const newReview = await reviewService.createReview(payload);
      setReviews([newReview, ...reviews]);
      setForm({ rating: 5, comment: "" });
      alert("Cảm ơn bạn đã để lại đánh giá! ✨");
    } catch (err) {
      alert(err.message || "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { width: '100%', backgroundColor: brand.bg },
    panel: { maxWidth: '900px', margin: '0 auto' },
    titleSection: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' },
    title: { fontSize: '24px', fontWeight: '900', color: brand.primary, display: 'flex', alignItems: 'center', gap: '12px', margin: 0 },
    countBadge: { backgroundColor: brand.primary, color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' },

    formCard: {
      backgroundColor: brand.white,
      padding: '35px',
      borderRadius: '30px',
      marginBottom: '50px',
      boxShadow: '0 20px 40px rgba(35, 74, 74, 0.05)',
      border: `1px solid ${brand.border}`
    },
    starPicker: { display: 'flex', gap: '8px', marginBottom: '25px', alignItems: 'center', backgroundColor: brand.bg, padding: '15px 25px', borderRadius: '20px', width: 'fit-content' },
    starIcon: (active) => ({
      cursor: 'pointer',
      color: active ? brand.secondary : brand.starEmpty,
      fill: active ? brand.secondary : 'transparent',
      transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: active ? 'scale(1.1)' : 'scale(1)'
    }),
    textarea: {
      width: '100%',
      padding: '20px',
      borderRadius: '20px',
      border: `2px solid ${brand.border}`,
      minHeight: '130px',
      fontSize: '15px',
      outline: 'none',
      marginBottom: '20px',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      transition: 'border-color 0.3s',
      focus: { borderColor: brand.primary }
    },
    btnSubmit: {
      backgroundColor: brand.primary,
      color: brand.white,
      border: 'none',
      padding: '18px',
      borderRadius: '18px',
      fontWeight: '800',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      width: '100%',
      fontSize: '16px',
      boxShadow: '0 10px 20px rgba(35, 74, 74, 0.15)',
      transition: '0.3s'
    },

    reviewCard: {
      backgroundColor: brand.white,
      padding: '30px',
      borderRadius: '25px',
      marginBottom: '20px',
      border: `1px solid ${brand.border}`,
      boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
    },
    authorBox: { display: 'flex', gap: '18px', marginBottom: '18px' },
    avatar: { width: '52px', height: '52px', borderRadius: '16px', objectFit: 'cover', backgroundColor: brand.bg, border: `1px solid ${brand.border}` },
    commentText: {
      fontSize: '15px',
      lineHeight: '1.8',
      color: brand.text,
      margin: 0,
      paddingLeft: '70px',
      fontWeight: '450'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <div style={styles.titleSection}>
          <h2 style={styles.title}>
            <MessageSquare size={28} /> Nhận xét từ cộng đồng
          </h2>
          <span style={styles.countBadge}>{reviews.length} đánh giá</span>
        </div>

        {showForm && (
          <div style={styles.formCard}>
            <p style={{ fontWeight: '800', marginBottom: '15px', color: brand.primary, fontSize: '18px' }}>Trải nghiệm của bạn</p>

            <div style={styles.starPicker}>
              {[1, 2, 3, 4, 5].map((num) => (
                <Star
                  key={num}
                  size={30}
                  style={styles.starIcon((hoverRating || form.rating) >= num)}
                  onMouseEnter={() => setHoverRating(num)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setForm({ ...form, rating: num })}
                />
              ))}
              <span style={{ marginLeft: '15px', fontWeight: '900', color: brand.primary, fontSize: '18px' }}>{form.rating}.0</span>
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                style={styles.textarea}
                placeholder="Sản phẩm giúp ích gì cho cuộc sống của bạn? Hãy chia sẻ tại đây nhé..."
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = brand.primary}
                onBlur={(e) => e.target.style.borderColor = brand.border}
                required
              />
              <button
                style={{ ...styles.btnSubmit, opacity: loading ? 0.7 : 1 }}
                disabled={loading}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {loading ? "ĐANG GỬI..." : "GỬI ĐÁNH GIÁ CỦA BẠN"}
              </button>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {fetching ? (
            <div style={{ textAlign: 'center', padding: '50px' }}><Loader2 className="animate-spin" style={{ margin: '0 auto' }} color={brand.primary} /></div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: brand.muted, backgroundColor: brand.white, borderRadius: '30px', border: `1px dotted ${brand.border}` }}>
              <p style={{ margin: 0, fontSize: '16px' }}>Sản phẩm này chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nhận!</p>
            </div>
          ) : (
            reviews.map((r) => (
              <article key={r.id} style={styles.reviewCard}>
                <div style={styles.authorBox}>
                  <img
                    src={r.user?.avatar_url || "https://www.w3schools.com/howto/img_avatar.png"}
                    style={styles.avatar}
                    alt="avatar"
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '800', fontSize: '16px', color: brand.primary }}>{r.user?.full_name || "Khách hàng Hometic"}</span>
                      <span style={{ fontSize: '12px', color: brand.muted, fontWeight: '600' }}>{new Date(r.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '3px', marginTop: '6px' }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} fill={s <= r.rating ? brand.secondary : 'transparent'} color={s <= r.rating ? brand.secondary : brand.starEmpty} />
                      ))}
                    </div>
                  </div>
                </div>
                <p style={styles.commentText}>
                  {r.comment}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
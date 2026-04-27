import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Star, MessageSquare, Send, User } from "lucide-react";

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([
    { rating: 5, comment: "Sản phẩm đóng gói rất cẩn thận, chất liệu nhựa cao cấp, cầm rất chắc tay. Rất đáng tiền!", customer_name: "Nguyễn Văn An", date: "26/04/2026" },
    { rating: 4, comment: "Giao hàng nhanh, hộp kín khí tốt, màu sắc nhã nhặn đúng style mình thích.", customer_name: "Trần Thị Bình", date: "25/04/2026" }
  ]);

  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [hoverRating, setHoverRating] = useState(0); // State xử lý hiệu ứng hover sao

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const brand = {
    bg: "#f9f5ed",
    panelBg: "#e5e5e5",
    primary: "#2c4e4e",
    orange: "#da8f48",
    white: "#ffffff",
    text: "#1a1a1a",
    muted: "#888",
    starEmpty: "#d1d1d1"
  };

  const styles = {
    container: {
      // Phủ kín toàn bộ chiều rộng và chiều cao
      width: '100vw',
      minHeight: '100vh',

      // Loại bỏ mọi khoảng cách thừa
      margin: 0,
      padding: 0,

      // Màu nền chủ đạo của bạn (Beige)
      backgroundColor: "#f9f5ed",

      // Đảm bảo không bị lòi phần nền đen của body
      display: 'flex',
      flexDirection: 'column',

      // Nếu trang của bạn có xu hướng bị trượt ngang do scrollbar, hãy thêm:
      overflowX: 'hidden',
    },
    panel: { backgroundColor: brand.panelBg, padding: '40px', borderRadius: '24px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' },
    title: { fontSize: '26px', fontWeight: '800', marginBottom: '30px', color: brand.primary, display: 'flex', alignItems: 'center', gap: '12px' },

    // Form Đánh Giá
    formCard: { backgroundColor: brand.white, padding: '30px', borderRadius: '18px', marginBottom: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
    starPicker: { display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' },
    starIcon: (active) => ({
      cursor: 'pointer',
      color: active ? brand.orange : brand.starEmpty,
      fill: active ? brand.orange : 'transparent',
      transition: 'all 0.2s ease-in-out',
      transform: active ? 'scale(1.1)' : 'scale(1)'
    }),

    textarea: { width: '100%', padding: '18px', borderRadius: '12px', border: '1px solid #eee', minHeight: '120px', fontSize: '15px', fontFamily: 'inherit', outline: 'none', backgroundColor: '#fcfcfc', marginBottom: '15px', transition: 'border 0.3s' },
    btnSubmit: { backgroundColor: brand.orange, color: brand.white, border: 'none', padding: '16px 30px', borderRadius: '10px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' },

    // List Đánh Giá
    reviewCard: { backgroundColor: brand.white, padding: '25px', borderRadius: '16px', marginBottom: '15px', position: 'relative' },
    authorInfo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
    avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: brand.bg, display: 'flex', justifyContent: 'center', alignItems: 'center', color: brand.primary },
    date: { fontSize: '12px', color: brand.muted, marginLeft: 'auto' }
  };

  const submit = (e) => {
    e.preventDefault();
    const newReview = { ...form, customer_name: "Bạn", date: "Vừa xong" };
    setReviews([newReview, ...reviews]);
    setForm({ rating: 5, comment: "" });
  };

  return (
    <main style={styles.container}>
      <section style={styles.panel}>
        <h2 style={styles.title}>
          <MessageSquare size={28} /> Đánh giá từ khách hàng
        </h2>

        {/* Form Đánh Giá Chuyên Nghiệp */}
        <div style={styles.formCard}>
          <p style={{ fontWeight: '700', marginBottom: '12px', fontSize: '15px' }}>Trải nghiệm của bạn thế nào?</p>

          <div style={styles.starPicker}>
            {[1, 2, 3, 4, 5].map((num) => (
              <Star
                key={num}
                size={32}
                style={styles.starIcon((hoverRating || form.rating) >= num)}
                onMouseEnter={() => setHoverRating(num)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setForm({ ...form, rating: num })}
              />
            ))}
            <span style={{ marginLeft: '10px', fontWeight: '600', color: brand.orange }}>
              {form.rating}/5 sao
            </span>
          </div>

          <form onSubmit={submit}>
            <textarea
              style={styles.textarea}
              placeholder="Chia sẻ chi tiết về chất lượng sản phẩm, dịch vụ giao hàng để giúp các khách hàng khác nhé..."
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              required
              onFocus={(e) => e.target.style.border = `1px solid ${brand.orange}`}
              onBlur={(e) => e.target.style.border = '1px solid #eee'}
            />
            <button style={styles.btnSubmit}>
              <Send size={18} /> GỬI ĐÁNH GIÁ CỦA BẠN
            </button>
          </form>
        </div>

        {/* Danh sách nhận xét */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {reviews.map((r, i) => (
            <article key={i} style={styles.reviewCard}>
              <div style={styles.authorInfo}>
                <div style={styles.avatar}><User size={20} /></div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>{r.customer_name}</div>
                  <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={14} fill={s <= r.rating ? brand.orange : 'transparent'} color={s <= r.rating ? brand.orange : brand.starEmpty} />
                    ))}
                  </div>
                </div>
                <span style={styles.date}>{r.date}</span>
              </div>
              <p style={{ fontSize: '15px', lineHeight: '1.6', color: brand.text, margin: 0 }}>
                {r.comment}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
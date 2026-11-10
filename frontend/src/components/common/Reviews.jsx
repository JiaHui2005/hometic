import React, { useState, useEffect } from "react";
import { Star, Send, MessageSquareText } from "lucide-react";
import alertService from "../../services/alertService";
import { reviewService, getImgUrl } from "../../services/api";
import "./Reviews.css";

const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";

function Stars({ value, size = 14 }) {
  return (
    <span className="stars" aria-label={`${value} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={size} className={s <= value ? "is-on" : ""} />
      ))}
    </span>
  );
}

export default function Reviews({ productId, showForm = true }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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
      alertService.success("Cảm ơn bạn!", "Đánh giá của bạn đã được lưu thành công.");
    } catch (err) {
      alertService.error("Lỗi!", err.message || "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;

  return (
    <section className="reviews">
      <header className="reviews__head">
        <h2>Nhận xét từ khách hàng</h2>
        {reviews.length > 0 && (
          <div className="reviews__score">
            <strong>{average.toFixed(1)}</strong>
            <Stars value={Math.round(average)} size={16} />
            <span>{reviews.length} đánh giá</span>
          </div>
        )}
      </header>

      {showForm && (
        <form className="reviews__form card card-pad" onSubmit={handleSubmit}>
          <p className="field-label">Bạn chấm sản phẩm này mấy sao?</p>
          <div className="star-picker" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                type="button"
                key={num}
                className={(hoverRating || form.rating) >= num ? "is-on" : ""}
                onMouseEnter={() => setHoverRating(num)}
                onClick={() => setForm({ ...form, rating: num })}
                aria-label={`${num} sao`}
              >
                <Star size={26} />
              </button>
            ))}
          </div>
          <textarea
            className="textarea"
            placeholder="Sản phẩm giúp ích gì cho cuộc sống của bạn? Hãy chia sẻ tại đây nhé…"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            required
          />
          <button className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner spinner--sm" /> : <Send size={16} />}
            {loading ? "Đang gửi…" : "Gửi đánh giá"}
          </button>
        </form>
      )}

      {fetching ? (
        <div className="loading-block"><div className="spinner" /></div>
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><MessageSquareText size={26} /></span>
          <p>Sản phẩm này chưa có đánh giá nào.</p>
        </div>
      ) : (
        <ul className="reviews__list">
          {reviews.map((r) => (
            <li key={r.id} className="review">
              <img
                className="review__avatar"
                src={getImgUrl(r.user?.avatar_url, 80) || DEFAULT_AVATAR}
                alt=""
                onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
              />
              <div className="review__body">
                <div className="review__meta">
                  <strong>{r.user?.full_name || "Khách hàng Hometic"}</strong>
                  <time>{new Date(r.created_at).toLocaleDateString("vi-VN")}</time>
                </div>
                <Stars value={r.rating} />
                <p>{r.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

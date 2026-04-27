import React, { useState, useEffect } from "react";
import { api } from "../services/api";

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    api(`/reviews/${productId}`).then(setReviews).catch(() => setReviews([]));
  }, [productId]);

  const submit = (e) => {
    e.preventDefault();
    api(`/reviews/${productId}`, "POST", form).then(() => {
      setForm({ rating: 5, comment: "" });
      api(`/reviews/${productId}`).then(setReviews);
    });
  };

  return (
    <main className="narrow">
      <section className="panel">
        <h2>Đánh giá sản phẩm</h2>
        <form className="form" onSubmit={submit}>
          <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} sao</option>)}
          </select>
          <textarea placeholder="Chia sẻ cảm nhận..." value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          <button>Gửi đánh giá</button>
        </form>
        <div className="review-list">
          {reviews.map((r, i) => (
            <article key={i}>
              <div className="stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
              <p>{r.comment}</p>
              <small>bởi {r.customer_name}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

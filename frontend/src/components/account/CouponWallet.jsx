import React, { useEffect, useState } from "react";
import { TicketPercent } from "lucide-react";
import { couponService } from "../../services/api";
import alertService from "../../services/alertService";
import { describeCoupon, couponExpiry } from "../../utils/coupon";
import "./CouponWallet.css";

// Ví mã giảm giá của khách: xem mã đã lưu và lưu thêm mã mới (POST /coupons/claim/{code})
export default function CouponWallet({ onShop }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    couponService.getMyCoupons()
      .then(setCoupons)
      .catch(() => setError("Chưa tải được danh sách mã. Thử tải lại trang."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const claim = async (e) => {
    e.preventDefault();
    const value = code.trim().toUpperCase();
    if (!value) return;
    setSaving(true);
    setError("");
    try {
      const saved = await couponService.claimCoupon(value);
      setCoupons(list => [saved, ...list]);
      setCode("");
      alertService.success("Đã lưu mã", `${value}: ${describeCoupon(saved.coupon)}.`);
    } catch (err) {
      setError(err.message || "Mã không hợp lệ.");
    } finally {
      setSaving(false);
    }
  };

  const usable = coupons.filter(c => !c.is_used);
  const used = coupons.filter(c => c.is_used);

  return (
    <div className="wallet">
      <form className="wallet__claim" onSubmit={claim}>
        <div className="field">
          <label htmlFor="wallet-code">Lưu mã giảm giá</label>
          <div className="wallet__row">
            <input
              id="wallet-code"
              className="input wallet__input"
              placeholder="Nhập mã, vd. HOMETIC5"
              value={code}
              aria-invalid={!!error}
              aria-describedby="wallet-msg"
              onChange={(e) => { setCode(e.target.value); setError(""); }}
            />
            <button className="btn btn-primary" disabled={saving || !code.trim()}>
              {saving ? "Đang lưu…" : "Lưu mã"}
            </button>
          </div>
          <span id="wallet-msg" className={error ? "field-error" : "field-hint"}>
            {error || "Mã đã lưu sẽ hiện ở giỏ hàng khi bạn bấm “Chọn từ ví mã của bạn”."}
          </span>
        </div>
      </form>

      {loading ? (
        <div className="loading-block"><div className="spinner" /></div>
      ) : coupons.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><TicketPercent size={32} aria-hidden="true" /></span>
          <h3>Ví mã đang trống</h3>
          <p>Nhập mã bạn nhận được từ livestream hoặc chương trình khuyến mãi để lưu lại dùng sau.</p>
          {onShop && <button className="btn btn-secondary" onClick={onShop}>Xem hàng đang giảm</button>}
        </div>
      ) : (
        <>
          <h2 className="wallet__title">Có thể dùng <small>{usable.length}</small></h2>
          <ul className="wallet__list">
            {usable.map(uc => <CouponTicket key={uc.id} uc={uc} />)}
          </ul>
          {used.length > 0 && (
            <>
              <h2 className="wallet__title">Đã dùng <small>{used.length}</small></h2>
              <ul className="wallet__list wallet__list--used">
                {used.map(uc => <CouponTicket key={uc.id} uc={uc} />)}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}

function CouponTicket({ uc }) {
  const c = uc.coupon;
  if (!c) return null;
  return (
    <li className="ticket">
      <div className="ticket__value">
        {c.discount_type === "percent" ? `${c.discount_value}%` : `${Math.round(c.discount_value / 1000)}K`}
      </div>
      <div className="ticket__body">
        <strong>{c.code}</strong>
        <span>{describeCoupon(c)}</span>
        <span className="ticket__meta">
          {uc.is_used && uc.used_at
            ? `Đã dùng ngày ${new Date(uc.used_at).toLocaleDateString("vi-VN")}`
            : couponExpiry(c)}
        </span>
      </div>
    </li>
  );
}

import React, { useState, useEffect } from "react";
import { Trash2, ShoppingBag, Minus, Plus, Ticket, TicketPercent, Banknote, RefreshCw, ArrowLeft, CheckCircle2 } from "lucide-react";
import { formatVnd } from "../utils/format";
import alertService from "../services/alertService";
import { orderService, couponService, getImgUrl } from "../services/api";
import Modal from "../components/common/Modal";
import { couponDiscount, couponProblem, describeCoupon, couponExpiry } from "../utils/coupon";
import "./Cart.css";

const STEPS = ["Giỏ hàng", "Thông tin giao hàng", "Hoàn tất"];
const PHONE_RE = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

function Steps({ current }) {
  return (
    <ol className="steps" aria-label="Các bước đặt hàng">
      {STEPS.map((label, i) => (
        <li key={label} className={i === current ? "is-current" : i < current ? "is-done" : ""} aria-current={i === current ? "step" : undefined}>
          <span className="steps__num">{i + 1}</span>
          <span className="steps__label">{label}</span>
        </li>
      ))}
    </ol>
  );
}

export default function Cart({ cart, user, updateQuantity, removeFromCart, setActiveTab, clearCart }) {
  const [step, setStep] = useState(0); // 0 giỏ hàng, 1 giao hàng, 2 hoàn tất
  const [placedOrder, setPlacedOrder] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);

  const [myCoupons, setMyCoupons] = useState([]);
  const [promo, setPromo] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // đối tượng Coupon đang áp dụng
  const [applying, setApplying] = useState(false);
  const [showCouponField, setShowCouponField] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    recipient_name: "",
    phone_number: "",
    shipping_address: "",
    notes: "Giao hàng giờ hành chính"
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const fetchProvinces = async () => {
    try {
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách tỉnh thành:", error);
    }
  };

  const fetchDistricts = async (provinceCode) => {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      const data = await response.json();
      setDistricts(data.districts || []);
      setWards([]);
      setSelectedDistrict("");
      setSelectedWard("");
    } catch (error) {
      console.error("Lỗi lấy danh sách quận huyện:", error);
    }
  };

  const fetchWards = async (districtCode) => {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      const data = await response.json();
      setWards(data.wards || []);
      setSelectedWard("");
    } catch (error) {
      console.error("Lỗi lấy danh sách phường xã:", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    const provinceName = provinces.find(p => p.code == selectedProvince)?.name || "";
    const districtName = districts.find(d => d.code == selectedDistrict)?.name || "";
    const wardName = wards.find(w => w.code == selectedWard)?.name || "";

    const parts = [detailAddress, wardName, districtName, provinceName].filter(Boolean);
    setShippingInfo(prev => ({
      ...prev,
      shipping_address: parts.join(", ")
    }));
  }, [selectedProvince, selectedDistrict, selectedWard, detailAddress, provinces, districts, wards]);

  useEffect(() => {
    if (user && step === 1) {
      setShippingInfo(prev => ({
        ...prev,
        recipient_name: prev.recipient_name || user.full_name || "",
        phone_number: prev.phone_number || user.phone || "",
      }));
    }
    window.scrollTo(0, 0);
  }, [user, step]);

  const subtotal = cart.reduce((sum, item) => (sum + (item.sale_price || item.price) * (item.quantity || 1)), 0);
  const originalTotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const productSavings = Math.max(0, originalTotal - subtotal);
  // Tính lại mỗi khi giỏ thay đổi; nếu giỏ tụt dưới mức tối thiểu thì mã tạm không có hiệu lực
  const couponIssue = couponProblem(appliedCoupon, subtotal);
  const discount = couponDiscount(appliedCoupon, subtotal);
  const total = subtotal - discount;
  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const fetchMyCoupons = async () => {
    if (!user) {
      alertService.warning("Cần đăng nhập", "Đăng nhập để xem các mã giảm giá bạn đã lưu.");
      return;
    }
    try {
      setCouponLoading(true);
      const data = await couponService.getMyCoupons();
      setMyCoupons(data.filter(uc => !uc.is_used) || []);
      setShowCouponModal(true);
    } catch (err) {
      console.error("Lỗi lấy coupon:", err);
      alertService.error("Không tải được mã giảm giá", "Thử lại sau ít phút.");
    } finally {
      setCouponLoading(false);
    }
  };

  const applyCouponLogic = (coupon) => {
    const problem = couponProblem(coupon, subtotal);
    if (problem) {
      alertService.warning("Chưa dùng được mã", problem + ".");
      return;
    }
    setAppliedCoupon(coupon);
    setPromo(coupon.code);
    setShowCouponModal(false);
    alertService.success("Đã áp dụng mã", `Mã ${coupon.code} giảm ${formatVnd(couponDiscount(coupon, subtotal))}.`);
  };

  // Nhập mã: nếu chưa có trong ví (403) thì lưu mã vào tài khoản rồi áp dụng luôn
  const handleManualApply = async () => {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    if (!user) {
      alertService.warning("Cần đăng nhập", "Đăng nhập để dùng mã giảm giá.");
      return;
    }
    setApplying(true);
    try {
      let owned;
      try {
        owned = await couponService.checkCoupon(code);
      } catch (err) {
        if (err.status !== 403) throw err;
        owned = await couponService.claimCoupon(code);
      }
      applyCouponLogic(owned.coupon);
    } catch (err) {
      alertService.error("Mã không dùng được", err.message || "Mã không hợp lệ hoặc đã hết hạn.");
    } finally {
      setApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPromo("");
  };

  const phoneValid = PHONE_RE.test(shippingInfo.phone_number.replace(/\s/g, ""));

  const confirmOrder = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    setTriedSubmit(true);

    if (!shippingInfo.shipping_address || !shippingInfo.phone_number || !detailAddress || !selectedWard) {
      alertService.warning("Thiếu thông tin giao hàng", "Điền đủ người nhận, số điện thoại và địa chỉ.");
      return;
    }
    if (!phoneValid) {
      document.getElementById("co-phone")?.focus();
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity || 1 })),
        coupon_code: appliedCoupon && !couponIssue ? appliedCoupon.code : null,
        payment_method: "cod",
        ...shippingInfo
      };
      const order = await orderService.checkout(payload);

      setPlacedOrder({
        code: order?.order_code,
        items: cart,
        total,
        address: shippingInfo.shipping_address,
        name: shippingInfo.recipient_name,
        phone: shippingInfo.phone_number,
      });
      clearCart();
      setStep(2);
    } catch (err) {
      alertService.error("Chưa đặt được hàng", err.message || "Kiểm tra kết nối và thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const startCheckout = () => {
    if (!user) {
      alertService.warning("Cần đăng nhập", "Đăng nhập để đặt hàng và theo dõi đơn.");
      setActiveTab("auth");
      return;
    }
    setStep(1);
  };

  // ---------- Bước 3: hoàn tất ----------
  if (step === 2 && placedOrder) {
    return (
      <div className="container page checkout-done">
        <Steps current={2} />
        <div className="done">
          <CheckCircle2 size={36} className="done__icon" aria-hidden="true" />
          <h1 className="page-title">Đã đặt hàng{placedOrder.code ? ` #${placedOrder.code}` : ""}</h1>
          <p className="page-lead">
            Hometic sẽ gọi {placedOrder.phone} để xác nhận trước khi giao. Bạn thanh toán {formatVnd(placedOrder.total)} khi nhận hàng.
          </p>
          <dl className="done__facts">
            <div><dt>Giao đến</dt><dd>{placedOrder.name}, {placedOrder.address}</dd></div>
            <div><dt>Sản phẩm</dt><dd>{placedOrder.items.map(i => `${i.quantity} × ${i.name}`).join("; ")}</dd></div>
          </dl>
          <div className="done__actions">
            <button className="btn btn-primary" onClick={() => setActiveTab("profile")}>Xem đơn hàng của tôi</button>
            <button className="btn btn-outline" onClick={() => setActiveTab("shop")}>Tiếp tục mua sắm</button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container page">
        <div className="empty-state">
          <span className="empty-icon"><ShoppingBag size={32} aria-hidden="true" /></span>
          <h3>Giỏ hàng đang trống</h3>
          <p>Xem hàng đang giảm hoặc lọc theo nhu cầu để chọn món đầu tiên.</p>
          <button className="btn btn-primary" onClick={() => setActiveTab("shop")}>Tiếp tục mua sắm</button>
        </div>
      </div>
    );
  }

  const summary = (
    <aside className="cart__summary" aria-label="Tóm tắt đơn hàng">
      <h2>Đơn hàng</h2>

      {step === 1 && (
        <ul className="summary-items">
          {cart.map(item => (
            <li key={item.id}>
              <img src={getImgUrl(item.image_url || item.image)} alt="" />
              <span>{item.name}<small>Số lượng {item.quantity || 1}</small></span>
              <span className="price">{formatVnd((item.sale_price || item.price) * (item.quantity || 1))}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className="receipt">
        <div>
          <dt>Tạm tính ({itemCount} sản phẩm)</dt>
          <dd className="price">{formatVnd(subtotal)}</dd>
        </div>
        {productSavings > 0 && (
          <div className="receipt__saved">
            <dt>Đã giảm so với giá gốc</dt>
            <dd>−{formatVnd(productSavings)}</dd>
          </div>
        )}
        <div>
          <dt>Giao hàng</dt>
          <dd className="receipt__free">Miễn phí</dd>
        </div>
        {appliedCoupon && (
          <div className="receipt__discount">
            <dt>
              Mã <strong>{appliedCoupon.code}</strong>
              <button className="receipt__remove" onClick={handleRemoveCoupon}>Bỏ mã</button>
            </dt>
            <dd>−{formatVnd(discount)}</dd>
          </div>
        )}
        {couponIssue && <p className="receipt__warn" role="status">{couponIssue}.</p>}
      </dl>

      {!appliedCoupon && step === 0 && (
        showCouponField ? (
          <div className="coupon">
            <form className="coupon__field" onSubmit={(e) => { e.preventDefault(); handleManualApply(); }}>
              <input
                className="input"
                placeholder="Nhập mã"
                aria-label="Mã giảm giá"
                autoFocus
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
              />
              <button type="submit" className="btn btn-outline btn-sm" disabled={applying}>{applying ? "Đang kiểm tra…" : "Dùng mã"}</button>
            </form>
            <button className="coupon__link" onClick={fetchMyCoupons}>
              {couponLoading ? "Đang tải…" : "Hoặc chọn từ ví mã của bạn"}
            </button>
          </div>
        ) : (
          <button className="coupon__link coupon__toggle" onClick={() => setShowCouponField(true)}>
            <Ticket size={15} aria-hidden="true" />
            Bạn có mã giảm giá?
          </button>
        )
      )}

      <div className="summary-total">
        <span>Tổng cộng</span>
        <strong className="price">{formatVnd(total)}</strong>
      </div>

      {step === 0 ? (
        <button className="btn btn-primary btn-lg btn-block" onClick={startCheckout}>Tiếp tục đặt hàng</button>
      ) : (
        <button type="submit" form="checkout-form" className="btn btn-primary btn-lg btn-block" disabled={loading}>
          {loading ? <><span className="spinner spinner--sm" /> Đang đặt hàng…</> : `Đặt hàng, ${formatVnd(total)}`}
        </button>
      )}

      <ul className="reassure">
        <li><Banknote size={16} aria-hidden="true" /> Trả tiền khi nhận hàng</li>
        <li><RefreshCw size={16} aria-hidden="true" /> Đổi mới trong 7 ngày nếu lỗi kỹ thuật</li>
      </ul>
    </aside>
  );

  return (
    <div className="container page">
      <Steps current={step} />

      {/* key theo bước: mỗi lần sang bước mới nội dung hiện dần, thấy rõ đã chuyển bước */}
      <div key={step} className="step-enter">
      {step === 0 ? (
        <>
          <header className="cart-head">
            <h1 className="page-title">Giỏ hàng</h1>
            <p className="page-lead">{itemCount} sản phẩm</p>
          </header>

          <div className="cart">
            <ul className="cart__items">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <img className="cart-item__img" src={getImgUrl(item.image_url || item.image)} alt="" />
                  <div className="cart-item__info">
                    <h3>{item.name}</h3>
                    <div className="cart-item__price">
                      <span className="price">{formatVnd(item.sale_price || item.price)}</span>
                      {item.sale_price && <s className="price-old">{formatVnd(item.price)}</s>}
                    </div>
                  </div>
                  <div className="qty qty--sm" role="group" aria-label={`Số lượng ${item.name}`}>
                    <button onClick={() => updateQuantity(item.id, -1)} aria-label="Giảm" disabled={(item.quantity || 1) <= 1}><Minus size={15} /></button>
                    <span aria-live="polite">{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} aria-label="Tăng"><Plus size={15} /></button>
                  </div>
                  <strong className="price cart-item__line">
                    {formatVnd((item.sale_price || item.price) * (item.quantity || 1))}
                  </strong>
                  <button className="icon-btn icon-btn-sm cart-item__remove" onClick={() => removeFromCart(item.id)} aria-label={`Xoá ${item.name} khỏi giỏ`}>
                    <Trash2 size={17} />
                  </button>
                </li>
              ))}
            </ul>
            {summary}
          </div>
        </>
      ) : (
        <>
          <header className="cart-head">
            <button className="btn btn-ghost btn-sm cart-back" onClick={() => setStep(0)}>
              <ArrowLeft size={16} aria-hidden="true" /> Quay lại giỏ hàng
            </button>
            <h1 className="page-title">Thông tin giao hàng</h1>
          </header>

          <div className="cart">
            <form id="checkout-form" className="checkout-form" onSubmit={confirmOrder} noValidate>
              <fieldset>
                <legend>Người nhận</legend>
                <div className="checkout-form__row">
                  <div className="field">
                    <label htmlFor="co-name">Họ và tên</label>
                    <input id="co-name" className="input" required autoComplete="name" value={shippingInfo.recipient_name} onChange={e => setShippingInfo({ ...shippingInfo, recipient_name: e.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="co-phone">Số điện thoại</label>
                    <input
                      id="co-phone"
                      className="input"
                      required
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      aria-invalid={triedSubmit && !phoneValid}
                      aria-describedby="co-phone-msg"
                      value={shippingInfo.phone_number}
                      onChange={e => setShippingInfo({ ...shippingInfo, phone_number: e.target.value })}
                    />
                    <span id="co-phone-msg" className={triedSubmit && !phoneValid ? "field-error" : "field-hint"}>
                      {triedSubmit && !phoneValid ? "Số điện thoại cần 10 số, bắt đầu bằng 0 (vd. 0901234567)." : "Shipper gọi số này khi giao."}
                    </span>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>Địa chỉ</legend>
                <div className="checkout-form__row checkout-form__row--3">
                  <div className="field">
                    <label htmlFor="co-province">Tỉnh / Thành phố</label>
                    <select
                      id="co-province"
                      className="select"
                      required
                      value={selectedProvince}
                      onChange={e => {
                        setSelectedProvince(e.target.value);
                        fetchDistricts(e.target.value);
                      }}
                    >
                      <option value="">Chọn tỉnh/thành</option>
                      {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="co-district">Quận / Huyện</label>
                    <select
                      id="co-district"
                      className="select"
                      required
                      value={selectedDistrict}
                      disabled={!selectedProvince}
                      onChange={e => {
                        setSelectedDistrict(e.target.value);
                        fetchWards(e.target.value);
                      }}
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="co-ward">Phường / Xã</label>
                    <select
                      id="co-ward"
                      className="select"
                      required
                      value={selectedWard}
                      disabled={!selectedDistrict}
                      onChange={e => setSelectedWard(e.target.value)}
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="co-address">Số nhà, tên đường</label>
                  <input
                    id="co-address"
                    className="input"
                    required
                    autoComplete="street-address"
                    placeholder="vd. 123 Nguyễn Huệ"
                    value={detailAddress}
                    onChange={e => setDetailAddress(e.target.value)}
                  />
                </div>
                {shippingInfo.shipping_address && (
                  <p className="checkout-form__preview">Giao đến: {shippingInfo.shipping_address}</p>
                )}
                {provinces.length === 0 && (
                  <p className="field-error">Chưa tải được danh sách tỉnh thành. Kiểm tra kết nối mạng rồi tải lại trang.</p>
                )}
              </fieldset>

              <fieldset>
                <legend>Thanh toán</legend>
                <label className="pay-option">
                  <input type="radio" name="payment" checked readOnly />
                  <span><strong>Thanh toán khi nhận hàng (COD)</strong> Kiểm tra hàng rồi mới trả tiền</span>
                </label>
              </fieldset>
            </form>
            {summary}
          </div>
        </>
      )}
      </div>

      {/* Mã giảm giá của tôi */}
      <Modal
        open={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        title="Mã giảm giá của bạn"
        icon={<TicketPercent size={18} />}
        size="sm"
      >
        {myCoupons.length === 0 ? (
          <p className="muted">Bạn chưa có mã giảm giá nào khả dụng.</p>
        ) : (
          <ul className="coupon-list">
            {myCoupons.map((item) => {
              const problem = couponProblem(item.coupon, subtotal);
              return (
                <li key={item.id} className="coupon-ticket">
                  <div>
                    <strong>{item.coupon.code}</strong>
                    <span>{describeCoupon(item.coupon)}</span>
                    <span>{problem || couponExpiry(item.coupon)}</span>
                  </div>
                  <button className="btn btn-primary btn-sm" disabled={!!problem} onClick={() => applyCouponLogic(item.coupon)}>Dùng mã</button>
                </li>
              );
            })}
          </ul>
        )}
      </Modal>
    </div>
  );
}

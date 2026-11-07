import React, { useState, useEffect } from "react";
import { Trash2, ShoppingBag, Minus, Plus, CheckCircle, Ticket, TicketPercent, Banknote, RefreshCw } from "lucide-react";
import { formatVnd } from "../utils/format";
import alertService from "../services/alertService";
import { orderService, couponService, getImgUrl } from "../services/api";
import Modal from "../components/common/Modal";
import "./Cart.css";

export default function Cart({ cart, user, updateQuantity, removeFromCart, setActiveTab, clearCart }) {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const [myCoupons, setMyCoupons] = useState([]);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
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

  const fetchMyCoupons = async () => {
    if (!user) {
      alertService.warning("Thông báo!", "Vui lòng đăng nhập để xem mã giảm giá.");
      return;
    }
    try {
      setCouponLoading(true);
      const data = await couponService.getMyCoupons();
      setMyCoupons(data.filter(uc => !uc.is_used) || []);
      setShowCouponModal(true);
    } catch (err) {
      console.error("Lỗi lấy coupon:", err);
      alertService.error("Lỗi!", "Không thể tải danh sách mã giảm giá.");
    } finally {
      setCouponLoading(false);
    }
  };

  const applyCouponLogic = (couponData) => {
    let discValue = 0;
    if (couponData.discount_type === "percent") {
      discValue = subtotal * (couponData.discount_value / 100);
    } else {
      discValue = couponData.discount_value;
    }
    setDiscount(discValue);
    setAppliedCoupon(couponData.code);
    setPromo(couponData.code);
    setShowCouponModal(false);
    alertService.success("Áp dụng thành công!", `Mã ${couponData.code} đã được áp dụng.`);
  };

  const handleManualApply = async () => {
    if (!promo) return;
    try {
      const resp = await couponService.checkCoupon(promo);
      applyCouponLogic(resp);
    } catch (err) {
      alertService.error("Lỗi!", err.message || "Mã không hợp lệ hoặc đã hết hạn.");
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setPromo("");
    alertService.info("Thông báo", "Đã hủy áp dụng mã giảm giá.");
  };

  useEffect(() => {
    if (user && showCheckoutModal) {
      setShippingInfo({
        recipient_name: user.full_name || "",
        phone_number: user.phone || "",
        shipping_address: user.address || "",
        notes: "Giao hàng giờ hành chính"
      });
      // Nếu user đã có địa chỉ, có thể thử parse nhưng khá phức tạp
      // Ở đây ta ưu tiên cho user chọn lại từ đầu để đảm bảo tính chính xác của API
    }
  }, [user, showCheckoutModal]);

  const subtotal = cart.reduce((sum, item) => (sum + (item.sale_price || item.price) * (item.quantity || 1)), 0);
  const total = subtotal - discount;

  const confirmOrder = async (e) => {

    if (e) e.preventDefault();

    if (loading) {
      return;
    }

    if (!shippingInfo.shipping_address || !shippingInfo.phone_number) {
      alertService.warning("Cảnh báo!", "Vui lòng cung cấp đầy đủ thông tin giao hàng.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity || 1 })),
        coupon_code: appliedCoupon,
        payment_method: "cod",
        ...shippingInfo
      };
      await orderService.checkout(payload);

      clearCart();

      setShowCheckoutModal(false);

      alertService.success("Thành công!", "Đặt hàng thành công! Hometic sẽ sớm liên hệ với bạn.");

      setActiveTab("shop");
    } catch (err) {
      alertService.error("Lỗi!", err.message || "Lỗi khi đặt hàng.");
    } finally {
      setLoading(false);
    }
  };


  const startCheckout = () => {
    if (!user) {
      alertService.warning("Thông báo!", "Vui lòng đăng nhập để thanh toán.");
      setActiveTab("auth");
      return;
    }
    setShowCheckoutModal(true);
  };

  if (cart.length === 0) {
    return (
      <div className="container page">
        <div className="empty-state">
          <span className="empty-icon"><ShoppingBag size={28} /></span>
          <h3>Giỏ hàng đang trống</h3>
          <p>Thêm vài món đồ cho ngôi nhà của bạn nhé.</p>
          <button className="btn btn-primary" onClick={() => setActiveTab("shop")}>Tiếp tục mua sắm</button>
        </div>
      </div>
    );
  }

  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="container page">
      <header className="cart-head">
        <h1 className="page-title">Giỏ hàng</h1>
        <p className="page-lead">{itemCount} sản phẩm</p>
      </header>

      <div className="cart">
        <ul className="cart__items">
          {cart.map((item) => (
            <li key={item.id} className="cart-item">
              <img className="cart-item__img" src={getImgUrl(item.image_url || item.image)} alt={item.name} />
              <div className="cart-item__info">
                <h3>{item.name}</h3>
                <div className="cart-item__price">
                  <strong className="price">{formatVnd(item.sale_price || item.price)}</strong>
                  {item.sale_price && <s>{formatVnd(item.price)}</s>}
                </div>
              </div>
              <div className="qty qty--sm" role="group" aria-label="Số lượng">
                <button onClick={() => updateQuantity(item.id, -1)} aria-label="Giảm"><Minus size={15} /></button>
                <span>{item.quantity || 1}</span>
                <button onClick={() => updateQuantity(item.id, 1)} aria-label="Tăng"><Plus size={15} /></button>
              </div>
              <strong className="price cart-item__line">
                {formatVnd((item.sale_price || item.price) * (item.quantity || 1))}
              </strong>
              <button className="icon-btn icon-btn-sm cart-item__remove" onClick={() => removeFromCart(item.id)} aria-label={`Xoá ${item.name}`}>
                <Trash2 size={17} />
              </button>
            </li>
          ))}
        </ul>

        <aside className="cart__summary">
          <h2>Đơn hàng</h2>

          <dl className="receipt">
            <div>
              <dt>Tạm tính ({itemCount} sản phẩm)</dt>
              <dd className="price">{formatVnd(subtotal)}</dd>
            </div>
            <div>
              <dt>Giao hàng</dt>
              <dd className="receipt__free">Miễn phí</dd>
            </div>
            {appliedCoupon && (
              <div className="receipt__discount">
                <dt>
                  Mã <strong>{appliedCoupon}</strong>
                  <button className="receipt__remove" onClick={handleRemoveCoupon}>Bỏ mã</button>
                </dt>
                <dd>−{formatVnd(discount)}</dd>
              </div>
            )}
          </dl>

          {!appliedCoupon && (
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
                  <button type="submit" className="btn btn-outline btn-sm">Dùng mã</button>
                </form>
                <button className="coupon__link" onClick={fetchMyCoupons}>
                  {couponLoading ? "Đang tải…" : "Hoặc chọn từ ví mã của bạn"}
                </button>
              </div>
            ) : (
              <button className="coupon__link coupon__toggle" onClick={() => setShowCouponField(true)}>
                <Ticket size={15} />
                Bạn có mã giảm giá?
              </button>
            )
          )}

          <div className="summary-total">
            <span>Tổng cộng</span>
            <strong className="price">{formatVnd(total)}</strong>
          </div>

          <button className="btn btn-primary btn-lg btn-block cart__checkout" onClick={startCheckout}>
            Đặt hàng
          </button>

          <ul className="reassure">
            <li><Banknote size={16} /> Trả tiền khi nhận hàng</li>
            <li><RefreshCw size={16} /> 1 đổi 1 trong 7 ngày nếu lỗi kỹ thuật</li>
          </ul>
        </aside>
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
            {myCoupons.map((item) => (
              <li key={item.id} className="coupon-ticket">
                <div>
                  <strong>{item.coupon.code}</strong>
                  <span>{item.coupon.description}</span>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => applyCouponLogic(item.coupon)}>Dùng mã</button>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      {/* Xác nhận đặt hàng */}
      <Modal
        open={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        title="Thông tin giao hàng"
        icon={<CheckCircle size={18} />}
      >
        <form className="checkout-form" onSubmit={confirmOrder}>
          <div className="checkout-form__row">
            <div className="field">
              <label htmlFor="co-name">Người nhận</label>
              <input id="co-name" className="input" required value={shippingInfo.recipient_name} onChange={e => setShippingInfo({ ...shippingInfo, recipient_name: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="co-phone">Số điện thoại</label>
              <input id="co-phone" className="input" required type="tel" value={shippingInfo.phone_number} onChange={e => setShippingInfo({ ...shippingInfo, phone_number: e.target.value })} />
            </div>
          </div>

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
              placeholder="VD: 123 Nguyễn Huệ"
              value={detailAddress}
              onChange={e => setDetailAddress(e.target.value)}
            />
          </div>

          <p className="checkout-form__preview">
            Giao đến: {shippingInfo.shipping_address || "chưa đủ thông tin địa chỉ"}
          </p>

          <div className="summary-total">
            <span>Tổng thanh toán</span>
            <strong className="price">{formatVnd(total)}</strong>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? <><span className="spinner spinner--sm" /> Đang đặt hàng…</> : "Đặt hàng"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

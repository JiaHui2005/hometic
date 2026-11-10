import React, { useState, useEffect, useRef } from "react";
import { User, Package, KeyRound, Pencil, Camera, ArrowLeft, Ticket, TicketPercent, ChevronRight } from "lucide-react";
import { formatVnd } from "../utils/format";
import alertService from "../services/alertService";
import { orderService, authService, getImgUrl, setSession } from "../services/api";
import { Reviews, StatusBadge } from "../components/common";
import CouponWallet from "../components/account/CouponWallet";
import "./Profile.css";

const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";

const PASSWORD_FIELDS = [
  ["old_password", "Mật khẩu hiện tại", "current-password"],
  ["new_password", "Mật khẩu mới", "new-password"],
  ["confirm_password", "Nhập lại mật khẩu mới", "new-password"],
];

const genderLabel = (g) => g || "Chưa cập nhật";

export default function Profile({ user, setUser, setActiveTab }) {
  const [activeSubTab, setActiveSubTab] = useState("profile");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewingProductId, setViewingProductId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    birthday: "",
    gender: "",
    avatar_url: ""
  });

  // Đồng bộ dữ liệu người dùng
  useEffect(() => {
    if (user) {
      setEditForm({
        full_name: user.full_name || "",
        phone: user.phone || "",
        birthday: user.birthday || "",
        gender: user.gender || "",
        avatar_url: user.avatar_url || ""
      });
    }
  }, [user, isEditing]);


  // Gọi danh sách đơn hàng
  useEffect(() => {
    if (activeSubTab === "orders" && user && !selectedOrder) {
      setLoading(true);
      orderService.getMyOrders()
        .then(setOrders)
        .catch(err => console.error("Lỗi lấy đơn hàng:", err))
        .finally(() => setLoading(false));
    }
  }, [activeSubTab, user, selectedOrder]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const response = await authService.uploadAvatar(formData);
      setEditForm({ ...editForm, avatar_url: response.url });
      alertService.success("Thành công!", "Ảnh đại diện đã được cập nhật.");
    } catch (error) {
      alertService.error("Lỗi!", "Lỗi tải ảnh: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (typeof setUser !== 'function') return;
    try {
      setLoading(true);
      const payload = {
        ...editForm,
        gender: editForm.gender,
        birthday: editForm.birthday || null
      };
      const updatedUser = await authService.updateMe(payload);
      setUser(updatedUser);
      localStorage.setItem("hometic_user", JSON.stringify(updatedUser));
      setIsEditing(false);
      alertService.success("Thành công!", "Cập nhật hồ sơ thành công!");
    } catch (error) {
      alertService.error("Lỗi!", "Lỗi cập nhật: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alertService.warning("Cảnh báo!", "Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      setLoading(true);
      // Đổi mật khẩu đăng xuất mọi phiên cũ; lưu token mới để phiên này vẫn đăng nhập
      const session = await authService.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      });
      setSession(session, session.user);
      alertService.success("Thành công!", "Đã đổi mật khẩu. Các thiết bị khác cần đăng nhập lại.");
      setIsChangingPassword(false);
      setPasswordForm({ old_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      alertService.error("Lỗi!", error.message || "Mật khẩu cũ không chính xác");
    } finally {
      setLoading(false);
    }
  };

  const openTab = (tab) => {
    setActiveSubTab(tab);
    setIsEditing(false);
    setIsChangingPassword(false);
    setSelectedOrder(null);
  };

  if (viewingProductId) {
    return (
      <div className="container page profile-review">
        <button className="btn btn-ghost btn-sm" onClick={() => setViewingProductId(null)}>
          <ArrowLeft size={16} /> Quay lại đơn hàng
        </button>
        <Reviews productId={viewingProductId} showForm={true} />
      </div>
    );
  }

  const avatarSrc = editForm.avatar_url ? getImgUrl(editForm.avatar_url, 192) : DEFAULT_AVATAR;

  return (
    <div className="container page">
      <div className="profile">
        <aside className="profile__side">
          <div className="profile__card">
            <div className="profile__avatar">
              <img
                src={avatarSrc}
                alt=""
                onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
              />
              {isEditing && (
                <button className="profile__camera" onClick={() => fileInputRef.current.click()} aria-label="Đổi ảnh đại diện">
                  <Camera size={16} />
                </button>
              )}
            </div>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
            <div className="profile__who">
              <h2>{user?.full_name || "Thành viên Hometic"}</h2>
              <p>{user?.email}</p>
            </div>
          </div>

          <nav className="profile__nav">
            <button className={activeSubTab === "profile" ? "is-active" : ""} onClick={() => openTab("profile")}>
              <User size={18} /> Hồ sơ cá nhân
            </button>
            <button className={activeSubTab === "orders" ? "is-active" : ""} onClick={() => openTab("orders")}>
              <Package size={18} /> Đơn hàng của tôi
            </button>
            <button className={activeSubTab === "coupons" ? "is-active" : ""} onClick={() => openTab("coupons")}>
              <TicketPercent size={18} /> Mã giảm giá
            </button>
          </nav>
        </aside>

        <section className="profile__main" key={activeSubTab + (selectedOrder ? "-detail" : "")}>
          {activeSubTab === "coupons" ? (
            <>
              <header className="profile__head">
                <div>
                  <h1>Mã giảm giá</h1>
                  <p>Lưu mã nhận được để dùng khi đặt hàng.</p>
                </div>
              </header>
              <CouponWallet onShop={() => setActiveTab("shop")} />
            </>
          ) : activeSubTab === "profile" ? (
            <>
              <header className="profile__head">
                <div>
                  <h1>{isChangingPassword ? "Đổi mật khẩu" : isEditing ? "Sửa thông tin" : "Thông tin tài khoản"}</h1>
                  <p>{isChangingPassword ? "Dùng mật khẩu có ít nhất 8 ký tự." : "Thông tin này dùng để giao hàng và liên hệ với bạn."}</p>
                </div>
                {!isEditing && !isChangingPassword && (
                  <div className="profile__head-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => setIsChangingPassword(true)}>
                      <KeyRound size={15} /> Đổi mật khẩu
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
                      <Pencil size={15} /> Sửa thông tin
                    </button>
                  </div>
                )}
              </header>

              {isChangingPassword ? (
                <form className="profile__form profile__form--narrow" onSubmit={(e) => { e.preventDefault(); handleUpdatePassword(); }}>
                  {PASSWORD_FIELDS.map(([key, label, autoComplete]) => (
                    <div className="field" key={key}>
                      <label htmlFor={`pw-${key}`}>{label}</label>
                      <input
                        id={`pw-${key}`}
                        className="input"
                        type="password"
                        autoComplete={autoComplete}
                        required
                        value={passwordForm[key]}
                        onChange={e => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                      />
                    </div>
                  ))}
                  <div className="profile__actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Đang lưu…" : "Lưu mật khẩu mới"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => { setIsChangingPassword(false); setPasswordForm({ old_password: "", new_password: "", confirm_password: "" }); }}
                    >
                      Huỷ
                    </button>
                  </div>
                </form>
              ) : isEditing ? (
                <form className="profile__form" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                  <div className="profile__grid">
                    <div className="field">
                      <label htmlFor="pf-name">Họ và tên</label>
                      <input id="pf-name" className="input" value={editForm.full_name} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="pf-phone">Số điện thoại</label>
                      <input id="pf-phone" className="input" type="tel" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="pf-birthday">Ngày sinh</label>
                      <input id="pf-birthday" className="input" type="date" value={editForm.birthday} onChange={e => setEditForm({ ...editForm, birthday: e.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="pf-gender">Giới tính</label>
                      <select id="pf-gender" className="select" value={editForm.gender} onChange={e => setEditForm({ ...editForm, gender: e.target.value })}>
                        <option value="">Chưa chọn</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>
                  <p className="muted profile__hint">Bấm vào biểu tượng máy ảnh trên ảnh đại diện để đổi ảnh.</p>
                  <div className="profile__actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Đang lưu…" : "Lưu thay đổi"}
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>Huỷ</button>
                  </div>
                </form>
              ) : (
                <dl className="profile__info">
                  {[
                    ["Email", user?.email],
                    ["Số điện thoại", user?.phone],
                    ["Ngày sinh", user?.birthday ? new Date(user.birthday).toLocaleDateString("vi-VN") : null],
                    ["Giới tính", genderLabel(user?.gender)],
                  ].map(([label, value]) => (
                    <div key={label} className="profile__info-row">
                      <dt>{label}</dt>
                      <dd className={value ? "" : "is-empty"}>{value || "Chưa cập nhật"}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </>
          ) : selectedOrder ? (
            <>
              <header className="profile__head">
                <div>
                  <button className="btn btn-ghost btn-sm profile__back" onClick={() => setSelectedOrder(null)}>
                    <ArrowLeft size={16} /> Tất cả đơn hàng
                  </button>
                  <h1>Đơn #{selectedOrder.order_code || selectedOrder.id}</h1>
                </div>
                <StatusBadge status={selectedOrder.status} />
              </header>

              <div className="order-meta">
                <div>
                  <h3>Giao đến</h3>
                  <p><strong>{selectedOrder.recipient_name}</strong></p>
                  <p>{selectedOrder.phone_number}</p>
                  <p>{selectedOrder.shipping_address}</p>
                </div>
                <div>
                  <h3>Thanh toán</h3>
                  <p>{selectedOrder.payment_method?.toUpperCase() === "COD" ? "Thanh toán khi nhận hàng" : selectedOrder.payment_method?.toUpperCase()}</p>
                </div>
              </div>

              <ul className="order-items">
                {selectedOrder.items?.map((item, idx) => (
                  <li key={idx} className="order-item">
                    <img src={getImgUrl(item.product?.image_url, 160)} alt="" />
                    <div className="order-item__info">
                      <strong>{item.product_name || item.product?.name}</strong>
                      <span>Số lượng: {item.quantity}</span>
                      {selectedOrder.status === "delivered" && (
                        <button className="order-item__review" onClick={() => setViewingProductId(item.product?.id)}>
                          Viết đánh giá
                        </button>
                      )}
                    </div>
                    <span className="price">{formatVnd(item.price_at_purchase)}</span>
                  </li>
                ))}
              </ul>

              <div className="order-total">
                <div className="summary-row">
                  <span>Tạm tính</span>
                  <span className="price">{formatVnd(selectedOrder.subtotal || selectedOrder.total_amount + (selectedOrder.discount_amount || 0))}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="summary-row summary-row--discount">
                    <span><Ticket size={14} /> Mã giảm giá {selectedOrder.coupon?.code ? `(${selectedOrder.coupon.code})` : ""}</span>
                    <span>−{formatVnd(selectedOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="summary-total">
                  <span>Tổng thanh toán</span>
                  <strong className="price">{formatVnd(selectedOrder.total_amount)}</strong>
                </div>
              </div>
            </>
          ) : (
            <>
              <header className="profile__head">
                <div>
                  <h1>Đơn hàng của tôi</h1>
                  <p>Theo dõi trạng thái và xem lại các đơn đã đặt.</p>
                </div>
              </header>

              {loading ? (
                <div className="loading-block"><div className="spinner" /></div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon"><Package size={26} /></span>
                  <h3>Chưa có đơn hàng nào</h3>
                  <button className="btn btn-primary" onClick={() => setActiveTab("shop")}>Bắt đầu mua sắm</button>
                </div>
              ) : (
                <ul className="order-list">
                  {orders.map((order) => (
                    <li key={order.id}>
                      <button className="order-row" onClick={() => orderService.getMyOrder(order.id).then(setSelectedOrder)}>
                        <span className="order-row__code">
                          <strong>#{order.order_code}</strong>
                          <small>{new Date(order.created_at).toLocaleDateString("vi-VN")}</small>
                        </span>
                        <StatusBadge status={order.status} />
                        <span className="price">{formatVnd(order.total_amount)}</span>
                        <ChevronRight size={18} className="order-row__chev" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

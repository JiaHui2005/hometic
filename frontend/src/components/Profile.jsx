import React, { useState, useEffect, useRef } from "react";
import { User, Package, Eye, EyeOff, Phone, Mail, Calendar, CreditCard, MessageSquare, Edit2, Save, X, Camera, ShieldCheck, Star, Send, Ticket } from "lucide-react";
import { formatVnd } from "../constants";
import alertService from "../services/alertService";
import { orderService, authService, getImgUrl } from "../services/api";
import Reviews from "./Reviews";

export default function Profile({ user, setUser, setActiveTab }) {
  const [activeSubTab, setActiveSubTab] = useState("profile");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewingProductId, setViewingProductId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    birthday: "",
    gender: "Other",
    avatar_url: ""
  });

  // Đồng bộ dữ liệu người dùng
  useEffect(() => {
    if (user) {
      setEditForm({
        full_name: user.full_name || "",
        phone: user.phone || "",
        birthday: user.birthday || "",
        gender: user.gender || "Other",
        avatar_url: user.avatar_url || ""
      });
    }
  }, [user, isEditing]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      console.log(payload)
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
      await authService.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      });
      alertService.success("Thành công!", "Đổi mật khẩu thành công!");
      setIsChangingPassword(false);
      setPasswordForm({ old_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      alertService.error("Lỗi!", error.message || "Mật khẩu cũ không chính xác");
    } finally {
      setLoading(false);
    }
  };

  const brand = {
    primary: "#234a4a",
    secondary: "#ed7f1a",
    accent: "#008481",
    bg: "#f9f5ed",
    white: "#ffffff",
    border: "#e5e1d8",
    text: "#1a1a1a",
    muted: "#71717a"
  };

  const styles = {
    container: { padding: isMobile ? "20px" : "60px 5%", backgroundColor: brand.bg, minHeight: "100vh" },
    layout: { display: "flex", flexDirection: isMobile ? "column" : "row", gap: "40px", maxWidth: "1200px", margin: "0 auto" },
    sidebar: { flex: "0 0 320px", display: "flex", flexDirection: "column", gap: "20px" },
    mainContent: { flex: 1, backgroundColor: brand.white, borderRadius: "30px", padding: isMobile ? "25px" : "40px", boxShadow: "0 10px 50px rgba(35, 74, 74, 0.05)", border: `1px solid ${brand.border}`, position: 'relative' },
    profileCard: { backgroundColor: brand.primary, borderRadius: "30px", padding: "40px 20px", color: "white", textAlign: "center", position: 'relative', overflow: 'hidden' },
    avatarContainer: { position: 'relative', width: "120px", height: "120px", margin: "0 auto 20px" },
    avatar: { width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", border: '4px solid rgba(255,255,255,0.2)', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' },
    cameraIcon: { position: 'absolute', bottom: '5px', right: '5px', background: brand.secondary, padding: '10px', borderRadius: '50%', cursor: 'pointer', border: '3px solid #234a4a', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    infoGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px', marginTop: '30px' },
    infoItem: { padding: '20px', borderRadius: '20px', backgroundColor: '#fdfcf9', border: `1px solid ${brand.border}`, display: 'flex', alignItems: 'center', gap: '15px', transition: '0.3s' },
    iconBox: (color) => ({ width: '50px', height: '50px', borderRadius: '15px', backgroundColor: color, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }),
    label: { fontSize: '12px', fontWeight: '800', color: brand.accent, letterSpacing: '0.5px', marginBottom: '4px', textTransform: 'uppercase' },
    value: { fontSize: '15px', fontWeight: '600', color: brand.text },
    btnEdit: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'transparent', color: brand.primary, border: `2px solid ${brand.primary}`, borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: '0.3s' },
    input: { width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${brand.border}`, fontSize: '15px', outline: 'none', transition: '0.3s', boxSizing: 'border-box' },
    navBtn: (active) => ({ padding: "18px 25px", borderRadius: "18px", backgroundColor: active ? brand.white : "transparent", color: active ? brand.primary : brand.muted, cursor: 'pointer', display: 'flex', gap: '12px', fontWeight: '700', border: active ? `1px solid ${brand.border}` : '1px solid transparent', transition: "0.3s", boxShadow: active ? "0 4px 15px rgba(0,0,0,0.05)" : "none", textAlign: 'left', width: '100%', borderStyle: 'solid', borderWidth: '1px' }),
    btnAction: (isPrimary) => ({ padding: "14px 28px", borderRadius: "15px", border: isPrimary ? "none" : `2px solid ${brand.border}`, backgroundColor: isPrimary ? brand.primary : "transparent", color: isPrimary ? "white" : brand.text, fontWeight: "700", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "0.3s", minWidth: isMobile ? "100%" : "160px", boxShadow: isPrimary ? "0 4px 12px rgba(35, 74, 74, 0.2)" : "none" })
  };

  if (viewingProductId) {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setViewingProductId(null)}
          style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100, padding: '10px 20px', backgroundColor: brand.primary, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}
        >
          ← Quay lại hồ sơ
        </button>
        <Reviews productId={viewingProductId} showForm={true} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <div style={styles.profileCard}>
            <div style={styles.avatarContainer}>
              <div style={styles.avatar}>
                <img
                  src={editForm.avatar_url ? getImgUrl(editForm.avatar_url) : "https://www.w3schools.com/howto/img_avatar.png"}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  alt="avatar"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://www.w3schools.com/howto/img_avatar.png"; }}
                />
              </div>
              {isEditing && (
                <div style={styles.cameraIcon} onClick={() => fileInputRef.current.click()}>
                  <Camera size={18} color="white" />
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
            <h3 style={{ margin: "0 0 8px", fontSize: '22px', fontWeight: "800" }}>{user?.full_name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', opacity: 0.8 }}>
              <ShieldCheck size={14} color={brand.secondary} /> Thành viên Hometic
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button style={styles.navBtn(activeSubTab === "profile")} onClick={() => { setActiveSubTab("profile"); setIsEditing(false); setSelectedOrder(null); }}>
              <User size={20} /> Hồ sơ cá nhân
            </button>
            <button style={styles.navBtn(activeSubTab === "orders")} onClick={() => { setActiveSubTab("orders"); setSelectedOrder(null); }}>
              <Package size={20} /> Đơn hàng của tôi
            </button>
          </div>
        </div>

        <div style={styles.mainContent}>
          {activeSubTab === "profile" ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '28px', color: brand.primary }}>Thông tin tài khoản</h2>
                  <p style={{ color: brand.muted, margin: '5px 0 0', fontSize: '14px' }}>Quản lý thông tin cá nhân để bảo mật tài khoản</p>
                </div>
                {!isEditing && !isChangingPassword && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setIsChangingPassword(true)} style={{ ...styles.btnEdit, borderColor: brand.secondary, color: brand.secondary }}>
                      <CreditCard size={16} /> Đổi mật khẩu
                    </button>
                    <button onClick={() => setIsEditing(true)} style={styles.btnEdit}>
                      <Edit2 size={16} /> Chỉnh sửa
                    </button>
                  </div>
                )}
              </div>

              {isChangingPassword ? (
                <div style={{ display: 'grid', gap: '20px', maxWidth: '450px' }}>
                  {['old', 'new', 'confirm'].map((key) => (
                    <div key={key}>
                      <label style={styles.label}>{key === 'old' ? 'Mật khẩu hiện tại' : key === 'new' ? 'Mật khẩu mới' : 'Xác nhận mật khẩu mới'}</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPasswords[key] ? "text" : "password"}
                          style={styles.input}
                          placeholder={key === 'new' ? "Tối thiểu 6 ký tự" : "••••••••"}
                          value={passwordForm[`${key}_password`]}
                          onChange={e => setPasswordForm({ ...passwordForm, [`${key}_password`]: e.target.value })}
                        />
                        <div
                          style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: brand.muted, display: 'flex' }}
                          onClick={() => setShowPasswords({ ...showPasswords, [key]: !showPasswords[key] })}
                        >
                          {showPasswords[key] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    <button style={styles.btnAction(true)} disabled={loading} onClick={handleUpdatePassword}>
                      {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                    </button>
                    <button style={styles.btnAction(false)} onClick={() => { setIsChangingPassword(false); setPasswordForm({ old_password: "", new_password: "", confirm_password: "" }); }}>
                      Hủy
                    </button>
                  </div>
                </div>
              ) : isEditing ? (
                <div style={{ display: 'grid', gap: '25px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                    <div><label style={styles.label}>Họ và tên</label><input style={styles.input} value={editForm.full_name} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} /></div>
                    <div><label style={styles.label}>Số điện thoại</label><input style={styles.input} value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                    <div><label style={styles.label}>Ngày sinh</label><input type="date" style={styles.input} value={editForm.birthday} onChange={e => setEditForm({ ...editForm, birthday: e.target.value })} /></div>
                    <div>
                      <label style={styles.label}>Giới tính</label>
                      <select value={editForm.gender} style={styles.input} onChange={e => setEditForm({ ...editForm, gender: e.target.value })}>
                        <option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button onClick={handleSaveProfile} disabled={loading} style={{ padding: '16px 40px', background: brand.primary, color: 'white', border: 'none', borderRadius: '15px', fontWeight: '700', cursor: 'pointer', flex: isMobile ? 1 : 'none' }}>
                      {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button onClick={() => setIsEditing(false)} style={{ padding: '16px 40px', background: '#f4f4f5', color: brand.text, border: 'none', borderRadius: '15px', fontWeight: '700', cursor: 'pointer', flex: isMobile ? 1 : 'none' }}>
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}><div style={styles.iconBox(brand.accent)}><Mail size={22} /></div><div><div style={styles.label}>Email</div><div style={styles.value}>{user?.email}</div></div></div>
                  <div style={styles.infoItem}><div style={styles.iconBox("#3b82f6")}><Phone size={22} /></div><div><div style={styles.label}>Số điện thoại</div><div style={styles.value}>{user?.phone || "Chưa cập nhật"}</div></div></div>
                  <div style={styles.infoItem}><div style={styles.iconBox("#ec4899")}><Calendar size={22} /></div><div><div style={styles.label}>Ngày sinh</div><div style={styles.value}>{user?.birthday ? new Date(user.birthday).toLocaleDateString('vi-VN') : "Chưa cập nhật"}</div></div></div>
                  <div style={styles.infoItem}><div style={styles.iconBox(brand.secondary)}><User size={22} /></div><div><div style={styles.label}>Giới tính</div><div style={styles.value}>{user?.gender === "Male" || user?.gender === "Nam" ? "Nam" : user?.gender === "Female" || user?.gender === "Nữ" ? "Nữ" : "Khác"}</div></div></div>
                </div>
              )}
            </div>
          ) : (
            /* TAB ĐƠN HÀNG */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: brand.primary }}>{selectedOrder ? "Chi tiết đơn hàng" : "Lịch sử đơn hàng"}</h2>
                {selectedOrder && <button onClick={() => setSelectedOrder(null)} style={styles.btnEdit}>← Quay lại</button>}
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
              ) : selectedOrder ? (
                /* CHI TIẾT ĐƠN HÀNG */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                    <div style={{ padding: '20px', borderRadius: '20px', backgroundColor: '#fdfcf9', border: `1px solid ${brand.border}` }}>
                      <div style={styles.label}>Thông tin nhận hàng</div>
                      <div style={{ ...styles.value, marginTop: '10px' }}><strong>{selectedOrder.recipient_name}</strong><br />{selectedOrder.phone_number}<br />{selectedOrder.shipping_address}</div>
                    </div>
                    <div style={{ padding: '20px', borderRadius: '20px', backgroundColor: '#fdfcf9', border: `1px solid ${brand.border}` }}>
                      <div style={styles.label}>Thanh toán</div>
                      <div style={{ ...styles.value, marginTop: '10px' }}>Phương thức: {selectedOrder.payment_method?.toUpperCase()}<br />Trạng thái: <span style={{ color: brand.secondary }}>{selectedOrder.status}</span></div>
                    </div>
                  </div>
                  <div style={{ border: `1px solid ${brand.border}`, borderRadius: '20px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ backgroundColor: brand.bg }}><tr><th style={{ padding: '15px', textAlign: 'left' }}>Sản phẩm</th><th style={{ padding: '15px' }}>SL</th><th style={{ padding: '15px', textAlign: 'right' }}>Đơn giá</th></tr></thead>
                      <tbody>
                        {selectedOrder.items?.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: `1px solid ${brand.border}` }}>
                            <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img src={getImgUrl(item.product?.image_url)} style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                              <div>
                                <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.product?.name}</div>
                                {selectedOrder.status === "delivered" && (
                                  <button
                                    onClick={() => setViewingProductId(item.product?.id)}
                                    style={{ color: brand.secondary, border: 'none', background: 'none', padding: 0, fontSize: '12px', fontWeight: '700', cursor: 'pointer', marginTop: '5px', textDecoration: 'underline' }}
                                  > Đánh giá ngay </button>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: '15px', textAlign: 'center' }}>{item.quantity}</td>
                            <td style={{ padding: '15px', textAlign: 'right', fontWeight: '700' }}>{formatVnd(item.price_at_purchase)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* TỔNG KẾT ĐƠN HÀNG CÓ HIỆN MÃ GIẢM GIÁ */}
                    <div style={{ padding: '20px', backgroundColor: '#fdfcf9', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
                        <span style={{ color: brand.muted }}>Tạm tính:</span>
                        <span style={{ fontWeight: '600', minWidth: '100px', textAlign: 'right' }}>{formatVnd(selectedOrder.subtotal || selectedOrder.total_amount + (selectedOrder.discount_amount || 0))}</span>
                      </div>

                      {selectedOrder.discount_amount > 0 && (
                        <div style={{ display: 'flex', gap: '20px', fontSize: '14px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: brand.secondary, fontWeight: '700' }}>
                            <Ticket size={14} />
                            Mã giảm giá {selectedOrder.coupon?.code ? `(${selectedOrder.coupon.code})` : ""}:
                          </div>
                          <span style={{ fontWeight: '600', color: brand.secondary, minWidth: '100px', textAlign: 'right' }}>
                            -{formatVnd(selectedOrder.discount_amount)}
                          </span>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', borderTop: `1px solid ${brand.border}`, paddingTop: '10px', marginTop: '5px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: brand.primary }}>Tổng thanh toán:</span>
                        <span style={{ fontSize: '24px', fontWeight: '900', color: brand.secondary, minWidth: '100px', textAlign: 'right' }}>
                          {formatVnd(selectedOrder.total_amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}><Package size={60} color={brand.border} /><h3 style={{ color: brand.muted }}>Chưa có đơn hàng nào</h3></div>
              ) : (
                /* DANH SÁCH ĐƠN HÀNG */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {orders.map((order) => (
                    <div key={order.id} style={{ padding: '20px', borderRadius: '20px', border: `1px solid ${brand.border}`, backgroundColor: '#fdfcf9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><div style={{ fontWeight: '800' }}>#{order.order_code}</div><div style={{ fontSize: '13px', color: brand.muted }}>{new Date(order.created_at).toLocaleDateString('vi-VN')} - {formatVnd(order.total_amount)}</div></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: brand.secondary }}>{order.status.toUpperCase()}</span>
                        <button onClick={() => orderService.getMyOrder(order.id).then(setSelectedOrder)} style={{ ...styles.btnEdit, padding: '8px 16px' }}>Chi tiết</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
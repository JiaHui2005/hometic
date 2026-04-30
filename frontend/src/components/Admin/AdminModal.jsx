import React, { useEffect, useState } from "react";
import { brand } from "./AdminStyles";
import { catalogService } from "../../services/api";
import { formatVnd } from "../../constants";
import { X, ShoppingBag, Clock, Package, Truck, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function AdminModal({
  isModalOpen,
  setIsModalOpen,
  modalType,
  editingItem,
  formData,
  setFormData,
  modalTab,
  setModalTab,
  submitting,
  handleSave,
  handleImageUpload,
  categories: initialCategories = [],
  customerOrders = [],
  loadingOrders = false
}) {
  const [internalCategories, setInternalCategories] = useState([]);

  useEffect(() => {
    if (isModalOpen && !["Đơn hàng", "Khách hàng"].includes(modalType)) {
      const fetchCats = async () => {
        try {
          const data = await catalogService.getCategories();
          setInternalCategories(data || []);
        } catch (error) {
          console.error("Lỗi fetch categories:", error);
        }
      };
      fetchCats();
    }
  }, [isModalOpen, modalType]);

  if (!isModalOpen) return null;

  const displayCategories = internalCategories.length > 0 ? internalCategories : initialCategories;

  // --- LOGIC STATUS BADGE (Đồng bộ với Dashboard/DataList) ---
  const getOrderStatus = (status) => {
    switch (status) {
      case 'pending': return { bg: '#fff7ed', text: '#c2410c', icon: <Clock size={14} />, label: 'Chờ xử lý' };
      case 'processing': return { bg: '#eff6ff', text: '#1d4ed8', icon: <Package size={14} />, label: 'Đang chuẩn bị' };
      case 'shipped': return { bg: '#f5f3ff', text: '#6d28d9', icon: <Truck size={14} />, label: 'Đang giao' };
      case 'delivered': return { bg: '#f0fdf4', text: '#15803d', icon: <CheckCircle size={14} />, label: 'Đã giao' };
      case 'cancelled': return { bg: '#fef2f2', text: '#b91c1c', icon: <AlertCircle size={14} />, label: 'Đã hủy' };
      default: return { bg: '#f4f4f5', text: '#71717a', icon: <AlertCircle size={14} />, label: status };
    }
  };

  // --- STYLE HELPERS ---
  const rowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' };
  const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
  const inputStyle = { padding: '12px 16px', borderRadius: '12px', border: `1px solid ${brand.border}`, outline: 'none', fontSize: '14px', backgroundColor: brand.panel, width: '100%', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '11px', fontWeight: '800', color: brand.muted, letterSpacing: '0.5px', textTransform: 'uppercase' };
  const readOnlyStyle = { ...inputStyle, backgroundColor: '#f4f4f5', color: brand.muted, cursor: 'not-allowed' };

  const availableParents = displayCategories.filter(cat => cat.id !== editingItem?.id);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '28px',
        width: ["Đơn hàng", "Khách hàng"].includes(modalType) ? '850px' : '1000px',
        maxWidth: '95%', height: 'auto', maxHeight: '90vh',
        boxShadow: '0 25px 80px rgba(0,0,0,0.2)', position: 'relative',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>

        {/* Header */}
        <div style={{ padding: '20px 30px', borderBottom: `1px solid ${brand.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: brand.sidebar }}>
              {modalType === "Đơn hàng" && `Đơn hàng #${formData?.order_code}`}
              {modalType === "Khách hàng" && `Lịch sử mua hàng: ${editingItem?.full_name}`}
              {!["Đơn hàng", "Khách hàng"].includes(modalType) && `${editingItem ? 'Chỉnh sửa' : 'Thêm mới'} ${modalType}`}
            </h2>
            {modalType === "Khách hàng" && (
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: brand.muted, fontWeight: '600' }}>{editingItem?.email}</p>
            )}
          </div>

          {modalType !== "Khách hàng" && (
            <div style={{ display: 'flex', backgroundColor: brand.panel, padding: '4px', borderRadius: '12px' }}>
              <button type="button" onClick={() => setModalTab("Cơ bản")} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: modalTab === "Cơ bản" ? brand.primary : 'transparent', color: modalTab === "Cơ bản" ? 'white' : brand.muted, fontWeight: '700', fontSize: '13px' }}>
                {modalType === "Đơn hàng" ? "Chi tiết đơn" : "Cơ bản"}
              </button>
              {modalType === "Sản phẩm" && (
                <button type="button" onClick={() => setModalTab("Chi tiết")} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: modalTab === "Chi tiết" ? brand.primary : 'transparent', color: modalTab === "Chi tiết" ? 'white' : brand.muted, fontWeight: '700', fontSize: '13px' }}>Thông số</button>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '25px 30px' }}>

          {/* --- CASE 1: LỊCH SỬ MUA HÀNG (KHÁCH HÀNG) --- */}
          {modalType === "Khách hàng" ? (
            loadingOrders ? (
              <div style={{ textAlign: 'center', padding: '100px' }}>
                <Loader2 size={40} color={brand.primary} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                <p style={{ marginTop: '15px', color: brand.muted, fontWeight: '600' }}>Đang truy xuất dữ liệu đơn hàng...</p>
              </div>
            ) : customerOrders?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {customerOrders.map((order) => {
                  const status = getOrderStatus(order.status);
                  return (
                    <div key={order.id} style={{ padding: '20px', borderRadius: '18px', border: `1px solid ${brand.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: brand.panel + '40' }}>
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ padding: '8px 12px', backgroundColor: 'white', borderRadius: '10px', border: `1px solid ${brand.border}`, textAlign: 'center' }}>
                          <div style={{ fontSize: '10px', color: brand.muted, fontWeight: '800' }}>MÃ ĐƠN</div>
                          <div style={{ fontWeight: '900', color: brand.primary }}>#{order.order_code}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '800', color: brand.sidebar }}>{new Date(order.created_at).toLocaleDateString('vi-VN')}</div>
                          <div style={{ fontSize: '12px', color: brand.muted }}>Phương thức: {order.payment_method?.toUpperCase()}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: '900', color: brand.orange }}>{formatVnd(order.total_amount)}</div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', backgroundColor: status.bg, color: status.text, marginTop: '5px' }}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: brand.panel, borderRadius: '24px' }}>
                <ShoppingBag size={50} color={brand.border} style={{ marginBottom: '15px' }} />
                <h3 style={{ margin: 0, color: brand.sidebar }}>Chưa có giao dịch</h3>
                <p style={{ color: brand.muted, fontSize: '14px' }}>Khách hàng này chưa thực hiện đơn hàng nào trên hệ thống.</p>
              </div>
            )
          ) : modalType === "Đơn hàng" ? (
            /* --- CASE 2: CHI TIẾT ĐƠN HÀNG (GIỮ NGUYÊN FORM CỦA BẠN) --- */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={rowStyle}>
                <div style={inputGroupStyle}><label style={labelStyle}>Tên người nhận</label><input style={readOnlyStyle} value={formData?.recipient_name || ""} readOnly /></div>
                <div style={inputGroupStyle}><label style={labelStyle}>Số điện thoại</label><input style={readOnlyStyle} value={formData?.phone_number || ""} readOnly /></div>
              </div>
              <div style={inputGroupStyle}><label style={labelStyle}>Địa chỉ nhận hàng</label><input style={readOnlyStyle} value={formData?.shipping_address || ""} readOnly /></div>
              <div style={rowStyle}>
                <div style={inputGroupStyle}><label style={labelStyle}>Ngày đặt hàng</label><input style={readOnlyStyle} value={new Date(formData?.created_at).toLocaleString('vi-VN')} readOnly /></div>
                <div style={inputGroupStyle}>
                  <label style={{ ...labelStyle, color: brand.orange }}>Trạng thái xử lý</label>
                  <select style={{ ...inputStyle, border: `2px solid ${brand.orange}`, fontWeight: '700' }} value={formData?.status || "pending"} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang chuẩn bị hàng</option>
                    <option value="shipped">Đang giao hàng</option>
                    <option value="delivered">Đã giao hàng</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>
              <div style={{ border: `1px solid ${brand.border}`, borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead style={{ backgroundColor: brand.panel }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Sản phẩm</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>SL</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData?.items?.map((item, index) => (
                      <tr key={index} style={{ borderTop: `1px solid ${brand.border}` }}>
                        <td style={{ padding: '12px' }}><strong>{item.product?.name}</strong></td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>{formatVnd(item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: '15px', textAlign: 'right', backgroundColor: brand.panel, fontWeight: '900', fontSize: '18px', color: brand.primary }}>
                  TỔNG CỘNG: {formatVnd(formData?.total_amount || 0)}
                </div>
              </div>
            </div>
          ) : (
            /* --- CASE 3: FORM SẢN PHẨM & DANH MỤC --- */
            <form onSubmit={handleSave}>
              {modalTab === "Cơ bản" ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
                  <div>
                    <div style={{ ...inputGroupStyle, marginBottom: '15px' }}><label style={labelStyle}>TÊN {modalType.toUpperCase()}</label><input type="text" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} required /></div>
                    {modalType === "Sản phẩm" ? (
                      <>
                        <div style={rowStyle}>
                          <div style={inputGroupStyle}><label style={labelStyle}>GIÁ GỐC</label><input type="number" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} style={inputStyle} required /></div>
                          <div style={inputGroupStyle}><label style={labelStyle}>GIÁ GIẢM</label><input type="number" value={formData.sale_price || ""} onChange={(e) => setFormData({ ...formData, sale_price: e.target.value ? Number(e.target.value) : null })} style={inputStyle} /></div>
                        </div>
                        <div style={rowStyle}>
                          <div style={inputGroupStyle}><label style={labelStyle}>TỒN KHO</label><input type="number" value={formData.stock || 0} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} style={inputStyle} /></div>
                          <div style={inputGroupStyle}>
                            <label style={labelStyle}>DANH MỤC</label>
                            <select value={formData.category_id || ""} onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })} style={inputStyle} required>
                              <option value="">-- Chọn danh mục --</option>
                              {displayCategories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                            </select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={rowStyle}>
                        <div style={inputGroupStyle}><label style={labelStyle}>SLUG</label><input type="text" value={formData.slug || ""} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} style={inputStyle} /></div>
                        <div style={inputGroupStyle}>
                          <label style={labelStyle}>DANH MỤC CHA</label>
                          <select value={formData.parent_id || ""} onChange={(e) => setFormData({ ...formData, parent_id: e.target.value ? Number(e.target.value) : null })} style={inputStyle}>
                            <option value="">Gốc</option>
                            {availableParents.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                          </select>
                        </div>
                      </div>
                    )}
                    <div style={inputGroupStyle}><label style={labelStyle}>MÔ TẢ NGẮN</label><textarea value={formData.detail?.description || ""} onChange={(e) => setFormData({ ...formData, detail: { ...formData.detail, description: e.target.value } })} style={{ ...inputStyle, minHeight: '80px', resize: 'none' }} /></div>
                  </div>
                  <div>
                    <label style={labelStyle}>ẢNH ĐẠI DIỆN</label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                      <input type="text" value={formData.image_url || ""} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} style={inputStyle} />
                      <label style={{ padding: '12px', backgroundColor: brand.panel, borderRadius: '12px', cursor: 'pointer', border: `1px dashed ${brand.primary}`, fontSize: '11px', fontWeight: '800', color: brand.primary }}>
                        UP<input type="file" hidden onChange={(e) => handleImageUpload(e, "image_url")} />
                      </label>
                    </div>
                    <div style={{ width: '100%', height: '200px', marginTop: '15px', borderRadius: '20px', overflow: 'hidden', border: `1px solid ${brand.border}`, backgroundColor: brand.panel }}>
                      {formData.image_url && <img src={formData.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                  <div>
                    <div style={inputGroupStyle}><label style={labelStyle}>HEADLINE</label><input type="text" value={formData.detail?.description || ""} onChange={(e) => setFormData({ ...formData, detail: { ...formData.detail, description: e.target.value } })} style={inputStyle} /></div>
                    <div style={{ ...inputGroupStyle, marginTop: '15px' }}><label style={labelStyle}>NỘI DUNG (HTML)</label><textarea value={formData.detail?.content || ""} onChange={(e) => setFormData({ ...formData, detail: { ...formData.detail, content: e.target.value } })} style={{ ...inputStyle, minHeight: '180px', resize: 'none' }} /></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={inputGroupStyle}><label style={labelStyle}>THÔNG SỐ (JSON)</label><textarea value={typeof formData.detail?.specifications === 'object' ? JSON.stringify(formData.detail?.specifications, null, 2) : formData.detail?.specifications || ""} onChange={(e) => setFormData({ ...formData, detail: { ...formData.detail, specifications: e.target.value } })} style={{ ...inputStyle, minHeight: '125px', fontFamily: 'monospace', fontSize: '12px' }} /></div>
                    <div style={rowStyle}>
                      <div style={inputGroupStyle}><label style={labelStyle}>BẢO HÀNH</label><input type="text" value={formData.detail?.warranty_info || ""} onChange={(e) => setFormData({ ...formData, detail: { ...formData.detail, warranty_info: e.target.value } })} style={inputStyle} /></div>
                      <div style={inputGroupStyle}><label style={labelStyle}>XUẤT XỨ</label><input type="text" value={formData.detail?.origin || ""} onChange={(e) => setFormData({ ...formData, detail: { ...formData.detail, origin: e.target.value } })} style={inputStyle} /></div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 30px', borderTop: `1px solid ${brand.border}`, display: 'flex', gap: '15px' }}>
          <button type="button" onClick={() => setIsModalOpen(false)} style={{ color: brand.text, flex: 1, padding: '14px', borderRadius: '14px', border: `1px solid ${brand.border}`, backgroundColor: 'white', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
            {modalType === "Khách hàng" ? "ĐÓNG" : "HỦY BỎ"}
          </button>

          {modalType !== "Khách hàng" && (
            <button type="button" onClick={handleSave} disabled={submitting} style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: brand.primary, color: 'white', fontWeight: '800', fontSize: '14px', cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "ĐANG LƯU..." : "XÁC NHẬN"}
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
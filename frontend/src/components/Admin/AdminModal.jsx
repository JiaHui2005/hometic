import React from "react";
import { brand } from "./AdminStyles";

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
  handleImageUpload
}) {
  if (!isModalOpen) return null;

  // Style dùng chung để tối ưu không gian
  const rowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' };
  const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
  const inputStyle = {
    padding: '12px 16px',
    borderRadius: '12px',
    border: `1px solid ${brand.border}`,
    outline: 'none',
    fontSize: '14px',
    backgroundColor: brand.panel,
    width: '100%',
    boxSizing: 'border-box'
  };
  const labelStyle = { fontSize: '11px', fontWeight: '800', color: brand.muted, letterSpacing: '0.5px', textTransform: 'uppercase' };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '28px',
        width: '1000px', maxWidth: '95%', height: 'auto', maxHeight: '90vh',
        boxShadow: '0 25px 80px rgba(0,0,0,0.2)', position: 'relative',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header - Thu gọn padding */}
        <div style={{ padding: '20px 30px', borderBottom: `1px solid ${brand.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: brand.sidebar }}>
            {editingItem ? 'Chỉnh sửa' : 'Thêm mới'} {modalType}
          </h2>
          <div style={{ display: 'flex', backgroundColor: brand.panel, padding: '4px', borderRadius: '12px' }}>
            <button type="button" onClick={() => setModalTab("Cơ bản")} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: modalTab === "Cơ bản" ? brand.primary : 'transparent', color: modalTab === "Cơ bản" ? 'white' : brand.muted, fontWeight: '700', fontSize: '13px' }}>Cơ bản</button>
            {modalType === "Sản phẩm" && (
              <button type="button" onClick={() => setModalTab("Chi tiết")} style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: modalTab === "Chi tiết" ? brand.primary : 'transparent', color: modalTab === "Chi tiết" ? 'white' : brand.muted, fontWeight: '700', fontSize: '13px' }}>Thông số</button>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '25px 30px' }}>
            {modalTab === "Cơ bản" ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
                {/* Cột trái */}
                <div>
                  <div style={{ ...inputGroupStyle, marginBottom: '15px' }}>
                    <label style={labelStyle}>TÊN {modalType.toUpperCase()}</label>
                    <input type="text" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} required />
                  </div>

                  {modalType === "Sản phẩm" ? (
                    <>
                      <div style={rowStyle}>
                        <div style={inputGroupStyle}><label style={labelStyle}>GIÁ GỐC</label><input type="number" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={inputStyle} required /></div>
                        <div style={inputGroupStyle}><label style={labelStyle}>GIÁ GIẢM</label><input type="number" value={formData.sale_price || ""} onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })} style={inputStyle} /></div>
                      </div>
                      <div style={rowStyle}>
                        <div style={inputGroupStyle}><label style={labelStyle}>TỒN KHO</label><input type="number" value={formData.stock || 0} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} style={inputStyle} /></div>
                        <div style={inputGroupStyle}><label style={labelStyle}>DANH MỤC ID</label><input type="number" value={formData.category_id || ""} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} style={inputStyle} /></div>
                      </div>
                    </>
                  ) : (
                    <div style={{ ...inputGroupStyle, marginBottom: '15px' }}><label style={labelStyle}>SLUG</label><input type="text" value={formData.slug || ""} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} style={inputStyle} /></div>
                  )}

                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>MÔ TẢ NGẮN</label>
                    <textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, minHeight: '80px', resize: 'none' }} />
                  </div>
                </div>

                {/* Cột phải - Ảnh */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>ẢNH ĐẠI DIỆN</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={formData.image_url || ""} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="Link ảnh..." style={inputStyle} />
                      <label style={{ padding: '0 12px', backgroundColor: 'white', borderRadius: '12px', cursor: 'pointer', border: `1px dashed ${brand.primary}`, display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: '800', color: brand.primary }}>UP<input type="file" hidden onChange={(e) => handleImageUpload(e, "image_url")} /></label>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '215px', borderRadius: '20px', overflow: 'hidden', border: `1px solid ${brand.border}`, backgroundColor: brand.panel }}>
                    {formData.image_url && <img src={formData.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                  <div style={{ ...inputGroupStyle, marginBottom: '15px' }}>
                    <label style={labelStyle}>HEADLINE CHI TIẾT</label>
                    <input type="text" value={formData.detail?.description || ""} onChange={(e) => setFormData({ ...formData, detail: { ...formData.detail, description: e.target.value } })} style={inputStyle} />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>NỘI DUNG (HTML)</label>
                    <textarea value={formData.detail?.content || ""} onChange={(e) => setFormData({ ...formData, detail: { ...formData.detail, content: e.target.value } })} style={{ ...inputStyle, minHeight: '180px', resize: 'none' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>THÔNG SỐ (JSON)</label>
                    <textarea
                      value={typeof formData.detail?.specifications === 'object' ? JSON.stringify(formData.detail?.specifications, null, 2) : formData.detail?.specifications || ""}
                      onChange={(e) => setFormData({ ...formData, detail: { ...formData.detail, specifications: e.target.value } })}
                      style={{ ...inputStyle, minHeight: '125px', fontFamily: 'monospace', fontSize: '12px', resize: 'none' }}
                    />
                  </div>
                  <div style={rowStyle}>
                    <div style={inputGroupStyle}><label style={labelStyle}>BẢO HÀNH</label><input type="text" value={formData.detail?.warranty_info || ""} onChange={(e) => setFormData({ ...formData, detail: { ...formData.detail, warranty_info: e.target.value } })} style={inputStyle} /></div>
                    <div style={inputGroupStyle}><label style={labelStyle}>XUẤT XỨ</label><input type="text" value={formData.detail?.origin || ""} onChange={(e) => setFormData({ ...formData, detail: { ...formData.detail, origin: e.target.value } })} style={inputStyle} /></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Thu gọn padding */}
          <div style={{ padding: '20px 30px', borderTop: `1px solid ${brand.border}`, display: 'flex', gap: '15px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ color: brand.text, flex: 1, padding: '14px', borderRadius: '14px', border: `1px solid ${brand.border}`, backgroundColor: 'white', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>HỦY BỎ</button>
            <button type="submit" disabled={submitting} style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: brand.primary, color: 'white', fontWeight: '800', fontSize: '14px', cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
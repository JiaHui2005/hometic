import React, { useEffect, useState } from "react";
import { ImagePlus, ShoppingBag, Upload } from "lucide-react";
import { catalogService, getImgUrl } from "../../services/api";
import { formatVnd } from "../../utils/format";
import { Modal, StatusBadge, ORDER_STATUS } from "../common";

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
  const availableParents = displayCategories.filter(cat => cat.id !== editingItem?.id);
  const close = () => setIsModalOpen(false);

  const setField = (key, parse = (v) => v) => (e) => setFormData({ ...formData, [key]: parse(e.target.value) });
  const setDetail = (key) => (e) => setFormData({ ...formData, detail: { ...formData.detail, [key]: e.target.value } });

  // --- Lịch sử mua hàng của khách ---
  if (modalType === "Khách hàng") {
    return (
      <Modal
        open
        onClose={close}
        size="lg"
        title={`Lịch sử mua hàng của ${editingItem?.full_name || "khách"}`}
        footer={<button className="btn btn-outline" onClick={close}>Đóng</button>}
      >
        <p className="muted" style={{ fontSize: 14, marginBottom: 16 }}>{editingItem?.email}</p>
        {loadingOrders ? (
          <div className="loading-block"><div className="spinner" /><p>Đang tải đơn hàng…</p></div>
        ) : customerOrders?.length > 0 ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Mã đơn</th><th>Ngày đặt</th><th>Thanh toán</th><th style={{ textAlign: "right" }}>Tổng tiền</th><th>Trạng thái</th></tr>
              </thead>
              <tbody>
                {customerOrders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>#{order.order_code}</strong></td>
                    <td className="muted">{new Date(order.created_at).toLocaleDateString("vi-VN")}</td>
                    <td className="muted">{order.payment_method?.toUpperCase()}</td>
                    <td className="price" style={{ textAlign: "right" }}>{formatVnd(order.total_amount)}</td>
                    <td><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><ShoppingBag size={26} /></span>
            <h3>Chưa có đơn hàng</h3>
            <p>Khách hàng này chưa đặt đơn nào.</p>
          </div>
        )}
      </Modal>
    );
  }

  // --- Chi tiết đơn hàng: chỉ đổi trạng thái ---
  if (modalType === "Đơn hàng") {
    return (
      <Modal
        open
        onClose={close}
        size="lg"
        title={`Đơn hàng #${formData?.order_code || ""}`}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={close}>Huỷ</button>
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={submitting}>
              {submitting ? "Đang lưu…" : "Lưu trạng thái"}
            </button>
          </>
        }
      >
        <div className="admin-form">
          <dl className="info-list">
            <div><dt>Người nhận</dt><dd>{formData?.recipient_name || "—"}</dd></div>
            <div><dt>Số điện thoại</dt><dd>{formData?.phone_number || "—"}</dd></div>
            <div className="admin-form__full"><dt>Địa chỉ</dt><dd>{formData?.shipping_address || "—"}</dd></div>
            <div><dt>Ngày đặt</dt><dd>{formData?.created_at ? new Date(formData.created_at).toLocaleString("vi-VN") : "—"}</dd></div>
            <div className="field">
              <label htmlFor="am-status">Trạng thái</label>
              <select id="am-status" className="select" value={formData?.status || "pending"} onChange={setField("status")}>
                {Object.entries(ORDER_STATUS).map(([value, { label }]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </dl>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Sản phẩm</th><th style={{ textAlign: "center" }}>SL</th><th style={{ textAlign: "right" }}>Đơn giá</th></tr>
              </thead>
              <tbody>
                {formData?.items?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product_name || item.product?.name}</td>
                    <td style={{ textAlign: "center" }}>{item.quantity}</td>
                    <td className="price" style={{ textAlign: "right" }}>{formatVnd(item.price_at_purchase)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="summary-total">
            <span>Tổng cộng</span>
            <strong className="price">{formatVnd(formData?.total_amount || 0)}</strong>
          </div>
        </div>
      </Modal>
    );
  }

  // --- Form Sản phẩm & Danh mục ---
  const isProduct = modalType === "Sản phẩm";

  return (
    <Modal
      open
      onClose={close}
      size="lg"
      title={`${editingItem ? "Sửa" : "Thêm"} ${modalType.toLowerCase()}`}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={close}>Huỷ</button>
          <button type="submit" form="admin-item-form" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Đang lưu…" : editingItem ? "Lưu thay đổi" : `Tạo ${modalType.toLowerCase()}`}
          </button>
        </>
      }
    >
      {isProduct && (
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={modalTab === "Cơ bản"} className={modalTab === "Cơ bản" ? "is-active" : ""} onClick={() => setModalTab("Cơ bản")}>Thông tin cơ bản</button>
          <button type="button" role="tab" aria-selected={modalTab === "Chi tiết"} className={modalTab === "Chi tiết" ? "is-active" : ""} onClick={() => setModalTab("Chi tiết")}>Mô tả & thông số</button>
        </div>
      )}

      <form id="admin-item-form" className="admin-form" onSubmit={handleSave}>
        {modalTab === "Cơ bản" || !isProduct ? (
          <>
            <div className="field">
              <label htmlFor="am-name">Tên {modalType.toLowerCase()}</label>
              <input id="am-name" className="input" value={formData.name || ""} onChange={setField("name")} placeholder={isProduct ? "VD: Robot hút bụi Hometic S9" : "VD: Gia dụng nhà bếp"} required />
            </div>

            {isProduct ? (
              <div className="admin-form__grid">
                <div className="field">
                  <label htmlFor="am-price">Giá gốc (đ)</label>
                  <input id="am-price" className="input" type="number" min="0" value={formData.price || ""} onChange={setField("price", Number)} required />
                </div>
                <div className="field">
                  <label htmlFor="am-sale">Giá khuyến mãi (đ)</label>
                  <input id="am-sale" className="input" type="number" min="0" value={formData.sale_price || ""} onChange={setField("sale_price", v => (v ? Number(v) : null))} placeholder="Để trống nếu không giảm" />
                </div>
                <div className="field">
                  <label htmlFor="am-slug">Đường dẫn (slug)</label>
                  <input id="am-slug" className="input" value={formData.slug || ""} onChange={setField("slug")} placeholder="robot-hut-bui-s9" required />
                </div>
                <div className="field">
                  <label htmlFor="am-brand">Thương hiệu</label>
                  <input id="am-brand" className="input" value={formData.brand || "Hometic"} onChange={setField("brand")} />
                </div>
                <div className="field">
                  <label htmlFor="am-stock">Tồn kho</label>
                  <input id="am-stock" className="input" type="number" min="0" value={formData.stock || 0} onChange={setField("stock", Number)} />
                </div>
                <div className="field">
                  <label htmlFor="am-cat">Danh mục</label>
                  <select id="am-cat" className="select" value={formData.category_id || ""} onChange={setField("category_id", Number)} required>
                    <option value="">Chọn danh mục</option>
                    {displayCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <div className="admin-form__grid">
                <div className="field">
                  <label htmlFor="am-slug">Đường dẫn (slug)</label>
                  <input id="am-slug" className="input" value={formData.slug || ""} onChange={setField("slug")} placeholder="gia-dung-nha-bep" />
                </div>
                <div className="field">
                  <label htmlFor="am-parent">Danh mục cha</label>
                  <select id="am-parent" className="select" value={formData.parent_id || ""} onChange={setField("parent_id", v => (v ? Number(v) : null))}>
                    <option value="">Không có (danh mục gốc)</option>
                    {availableParents.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor="am-desc">Mô tả ngắn</label>
              <textarea id="am-desc" className="textarea" value={formData.detail?.description || ""} onChange={setDetail("description")} placeholder="Đặc điểm nổi bật, 1–2 câu" />
            </div>

            <div className="field">
              <span className="field-label">Ảnh đại diện</span>
              <div className="image-picker">
                {formData.image_url
                  ? <img className="image-picker__preview" src={getImgUrl(formData.image_url)} alt="" />
                  : <span className="image-picker__preview"><ImagePlus size={24} /></span>}
                <div className="image-picker__body">
                  <input className="input" value={formData.image_url || ""} onChange={setField("image_url")} placeholder="Dán URL ảnh" aria-label="URL ảnh đại diện" />
                  <label className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start", cursor: "pointer" }}>
                    <Upload size={15} /> Tải ảnh lên
                    <input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload(e, "image_url")} />
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="field">
              <label htmlFor="am-headline">Tiêu đề phần mô tả</label>
              <input id="am-headline" className="input" value={formData.detail?.description || ""} onChange={setDetail("description")} />
            </div>
            <div className="field">
              <label htmlFor="am-content">Nội dung chi tiết (HTML)</label>
              <textarea id="am-content" className="textarea" style={{ minHeight: 160 }} value={formData.detail?.content || ""} onChange={setDetail("content")} placeholder="Có thể dùng thẻ <b>, <i>, <p>…" />
            </div>
            <div className="field">
              <label htmlFor="am-specs">Thông số kỹ thuật (JSON)</label>
              <textarea
                id="am-specs"
                className="textarea"
                style={{ fontFamily: "ui-monospace, monospace", fontSize: 12 }}
                value={typeof formData.detail?.specifications === "object" ? JSON.stringify(formData.detail?.specifications, null, 2) : formData.detail?.specifications || ""}
                onChange={setDetail("specifications")}
                placeholder='{"Dung tích": "5L", "Công suất": "1500W"}'
              />
            </div>
            <div className="admin-form__grid">
              <div className="field">
                <label htmlFor="am-warranty">Bảo hành</label>
                <input id="am-warranty" className="input" value={formData.detail?.warranty_info || ""} onChange={setDetail("warranty_info")} placeholder="12 tháng" />
              </div>
              <div className="field">
                <label htmlFor="am-origin">Xuất xứ</label>
                <input id="am-origin" className="input" value={formData.detail?.origin || ""} onChange={setDetail("origin")} placeholder="Việt Nam" />
              </div>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}

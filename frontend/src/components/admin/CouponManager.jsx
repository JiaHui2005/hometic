import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Inbox } from "lucide-react";
import { orderService } from "../../services/api";
import alertService from "../../services/alertService";
import { describeCoupon } from "../../utils/coupon";
import { formatVnd } from "../../utils/format";
import { Modal } from "../common";

const EMPTY_FORM = {
  code: "",
  discount_type: "percent",
  discount_value: "",
  max_discount_value: "",
  min_order_value: "",
  usage_limit: 100,
  start_date: "",
  end_date: "",
};

// Trạng thái hiển thị của một mã, suy ra từ dữ liệu backend
function couponState(c, now = new Date()) {
  if (!c.is_active) return { tone: "neutral", label: "Ngưng" };
  if (c.used_count >= c.usage_limit) return { tone: "neutral", label: "Hết lượt" };
  if (c.end_date && new Date(c.end_date) < now) return { tone: "danger", label: "Hết hạn" };
  if (c.start_date && new Date(c.start_date) > now) return { tone: "info", label: "Chưa bắt đầu" };
  return { tone: "success", label: "Đang chạy" };
}

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : null);

function validate(f) {
  const errors = {};
  if (!f.code.trim()) errors.code = "Nhập mã giảm giá.";
  else if (!/^[A-Za-z0-9_-]{3,30}$/.test(f.code.trim())) errors.code = "Chỉ dùng chữ, số, gạch ngang, 3–30 ký tự.";
  const v = Number(f.discount_value);
  if (!f.discount_value || v <= 0) errors.discount_value = "Nhập mức giảm lớn hơn 0.";
  else if (f.discount_type === "percent" && v > 100) errors.discount_value = "Phần trăm giảm tối đa 100.";
  if (Number(f.usage_limit) < 1) errors.usage_limit = "Ít nhất 1 lượt.";
  if (f.start_date && f.end_date && new Date(f.end_date) <= new Date(f.start_date)) errors.end_date = "Ngày kết thúc phải sau ngày bắt đầu.";
  return errors;
}

// Quản lý mã giảm giá: GET / POST / DELETE /admin/coupons
export default function CouponManager({ searchTerm = "" }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    orderService.getCoupons()
      .then(setCoupons)
      .catch(err => alertService.error("Không tải được mã giảm giá", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const shown = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return q ? coupons.filter(c => c.code.toLowerCase().includes(q)) : coupons;
  }, [coupons, searchTerm]);

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(err => ({ ...err, [key]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        max_discount_value: form.discount_type === "percent" && form.max_discount_value ? Number(form.max_discount_value) : null,
        min_order_value: Number(form.min_order_value) || 0,
        usage_limit: Number(form.usage_limit),
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      };
      const created = await orderService.createCoupon(payload);
      setCoupons(list => [created, ...list]);
      setOpen(false);
      setForm(EMPTY_FORM);
      alertService.success("Đã tạo mã", `${created.code}: ${describeCoupon(created)}.`);
    } catch (err) {
      setErrors({ code: err.message });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c) => {
    const msg = c.used_count > 0
      ? `Mã ${c.code} đã được dùng trong đơn hàng nên sẽ được chuyển sang "Ngưng" thay vì xoá hẳn. Tiếp tục?`
      : `Xoá mã ${c.code}? Khách đã lưu mã này sẽ không dùng được nữa.`;
    if (!window.confirm(msg)) return;
    try {
      await orderService.deleteCoupon(c.id);
      alertService.success(c.used_count > 0 ? "Đã ngưng mã" : "Đã xoá mã", c.code);
      load();
    } catch (err) {
      alertService.error("Không xoá được mã", err.message);
    }
  };

  const preview = form.discount_value ? describeCoupon({
    ...form,
    code: form.code,
    discount_value: Number(form.discount_value),
    max_discount_value: Number(form.max_discount_value) || null,
    min_order_value: Number(form.min_order_value) || 0,
  }) : null;

  return (
    <section className="panel">
      <div className="data-toolbar">
        <p className="muted" style={{ fontSize: 14 }}>{loading ? "Đang tải…" : `${shown.length} mã giảm giá`}</p>
        <button className="btn btn-primary btn-sm" onClick={() => { setForm(EMPTY_FORM); setErrors({}); setOpen(true); }}>
          <Plus size={16} aria-hidden="true" /> Tạo mã giảm giá
        </button>
      </div>

      {loading ? (
        <div className="loading-block"><div className="spinner" /></div>
      ) : shown.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><Inbox size={28} aria-hidden="true" /></span>
          <h3>{searchTerm ? "Không có mã khớp tìm kiếm" : "Chưa có mã giảm giá"}</h3>
          {!searchTerm && <p>Tạo mã đầu tiên để khách nhập ở giỏ hàng hoặc lưu vào ví.</p>}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Ưu đãi</th>
                <th>Đã dùng</th>
                <th>Thời hạn</th>
                <th>Trạng thái</th>
                <th><span className="sr-only">Thao tác</span></th>
              </tr>
            </thead>
            <tbody>
              {shown.map(c => {
                const st = couponState(c);
                const pct = Math.min(100, Math.round((c.used_count / Math.max(c.usage_limit, 1)) * 100));
                return (
                  <tr key={c.id} className={c.is_active ? "" : "row-muted"}>
                    <td><strong className="coupon-code">{c.code}</strong></td>
                    <td>{describeCoupon(c)}</td>
                    <td>
                      <div className="usage" title={`${c.used_count}/${c.usage_limit} lượt`}>
                        <span>{c.used_count}/{c.usage_limit}</span>
                        <span className="usage__bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></span>
                      </div>
                    </td>
                    <td className="muted">
                      {c.start_date || c.end_date
                        ? `${fmtDate(c.start_date) || "Ngay"} – ${fmtDate(c.end_date) || "không hạn"}`
                        : "Không giới hạn"}
                    </td>
                    <td><span className={`tag tag-${st.tone}`}>{st.label}</span></td>
                    <td>
                      <div className="cell-actions">
                        {c.is_active && (
                          <button className="icon-btn is-danger" onClick={() => remove(c)} title="Xoá / ngưng mã" aria-label={`Xoá mã ${c.code}`}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Tạo mã giảm giá"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Huỷ</button>
            <button type="submit" form="coupon-form" className="btn btn-primary" disabled={saving}>
              {saving ? "Đang tạo…" : "Tạo mã"}
            </button>
          </>
        }
      >
        <form id="coupon-form" className="admin-form" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="cp-code">Mã</label>
            <input
              id="cp-code"
              className="input coupon-code-input"
              placeholder="VD: HOMETIC10"
              value={form.code}
              onChange={set("code")}
              aria-invalid={!!errors.code}
              aria-describedby="cp-code-msg"
            />
            <span id="cp-code-msg" className={errors.code ? "field-error" : "field-hint"}>
              {errors.code || "Khách nhập đúng mã này ở giỏ hàng, không phân biệt hoa thường."}
            </span>
          </div>

          <fieldset className="field" style={{ border: 0 }}>
            <legend className="field-label">Kiểu giảm</legend>
            <div className="seg">
              {[["percent", "Theo %"], ["fixed", "Số tiền cố định"]].map(([v, label]) => (
                <label key={v} className={form.discount_type === v ? "is-active" : ""}>
                  <input type="radio" name="discount_type" value={v} checked={form.discount_type === v} onChange={set("discount_type")} />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="admin-form__grid">
            <div className="field">
              <label htmlFor="cp-value">{form.discount_type === "percent" ? "Phần trăm giảm" : "Số tiền giảm (đ)"}</label>
              <input id="cp-value" className="input" type="number" min="0" inputMode="numeric" value={form.discount_value} onChange={set("discount_value")} aria-invalid={!!errors.discount_value} />
              {errors.discount_value && <span className="field-error">{errors.discount_value}</span>}
            </div>
            {form.discount_type === "percent" ? (
              <div className="field">
                <label htmlFor="cp-max">Giảm tối đa (đ)</label>
                <input id="cp-max" className="input" type="number" min="0" inputMode="numeric" placeholder="Không giới hạn" value={form.max_discount_value} onChange={set("max_discount_value")} />
              </div>
            ) : <div />}
            <div className="field">
              <label htmlFor="cp-min">Đơn tối thiểu (đ)</label>
              <input id="cp-min" className="input" type="number" min="0" inputMode="numeric" placeholder="0" value={form.min_order_value} onChange={set("min_order_value")} />
            </div>
            <div className="field">
              <label htmlFor="cp-limit">Tổng số lượt dùng</label>
              <input id="cp-limit" className="input" type="number" min="1" inputMode="numeric" value={form.usage_limit} onChange={set("usage_limit")} aria-invalid={!!errors.usage_limit} />
              {errors.usage_limit && <span className="field-error">{errors.usage_limit}</span>}
            </div>
            <div className="field">
              <label htmlFor="cp-start">Bắt đầu</label>
              <input id="cp-start" className="input" type="datetime-local" value={form.start_date} onChange={set("start_date")} />
              <span className="field-hint">Để trống: dùng được ngay.</span>
            </div>
            <div className="field">
              <label htmlFor="cp-end">Kết thúc</label>
              <input id="cp-end" className="input" type="datetime-local" value={form.end_date} onChange={set("end_date")} aria-invalid={!!errors.end_date} />
              <span className={errors.end_date ? "field-error" : "field-hint"}>{errors.end_date || "Để trống: không hết hạn."}</span>
            </div>
          </div>

          {preview && (
            <p className="coupon-preview">
              Khách sẽ thấy <strong>{form.code.trim().toUpperCase() || "MÃ"}</strong>: {preview}
              {form.discount_type === "fixed" && Number(form.min_order_value) > 0 && Number(form.discount_value) >= Number(form.min_order_value)
                ? `. Lưu ý: mức giảm ${formatVnd(Number(form.discount_value))} bằng hoặc lớn hơn đơn tối thiểu.`
                : ""}
            </p>
          )}
        </form>
      </Modal>
    </section>
  );
}

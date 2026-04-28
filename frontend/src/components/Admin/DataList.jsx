import React from "react";
import { Package, Edit3, Trash2, Loader2 } from "lucide-react";
import { brand, adminStyles as styles } from "./AdminStyles";
import { formatVnd } from "../../constants";

export default function DataList({ activeMenu, data, loading, handleAddNew, handleEdit }) {
  return (
    <div style={styles.tableWrapper}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ margin: 0, color: brand.sidebar, fontSize: '28px', fontWeight: '900' }}>Quản lý {activeMenu}</h2>
          <p style={{ color: brand.muted, fontSize: '14px', marginTop: '5px' }}>Chỉnh sửa, xóa và quản lý các {activeMenu.toLowerCase()} trong hệ thống.</p>
        </div>
        {activeMenu !== "Khách hàng" && activeMenu !== "Đơn hàng" && (
          <button
            onClick={() => handleAddNew(activeMenu)}
            style={{ backgroundColor: brand.orange, color: 'white', border: 'none', padding: '15px 30px', borderRadius: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 20px rgba(218, 143, 72, 0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <Package size={20} /> Thêm mới
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={40} color={brand.primary} style={{ margin: '0 auto' }} /></div>
      ) : (
        <table style={styles.table}>
          <thead>
            {activeMenu === "Sản phẩm" && <tr><th style={styles.th}>Hình ảnh</th><th style={styles.th}>Tên sản phẩm</th><th style={styles.th}>Giá bán</th><th style={styles.th}>Tồn kho</th><th style={styles.th}>Hành động</th></tr>}
            {activeMenu === "Danh mục" && <tr><th style={styles.th}>ID</th><th style={styles.th}>Tên danh mục</th><th style={styles.th}>Đường dẫn (Slug)</th><th style={styles.th}>Thao tác</th></tr>}
            {activeMenu === "Đơn hàng" && <tr><th style={styles.th}>Mã ĐH</th><th style={styles.th}>Khách hàng</th><th style={styles.th}>Tổng tiền</th><th style={styles.th}>Trạng thái</th><th style={styles.th}>Ngày tạo</th></tr>}
            {activeMenu === "Khách hàng" && <tr><th style={styles.th}>Họ và tên</th><th style={styles.th}>Địa chỉ Email</th><th style={styles.th}>Vai trò</th><th style={styles.th}>Ngày tham gia</th></tr>}
          </thead>
          <tbody>
            {data.length > 0 ? data.map((item) => (
              <tr key={item.id}>
                {activeMenu === "Sản phẩm" && (
                  <>
                    <td style={styles.td}><img src={item.image_url} style={{ width: '60px', height: '60px', borderRadius: '15px', objectFit: 'cover', border: `1px solid ${brand.border}` }} alt={item.name} /></td>
                    <td style={styles.td}><strong style={{ fontSize: '15px' }}>{item.name}</strong></td>
                    <td style={styles.td}><strong style={{ color: brand.orange }}>{formatVnd(item.sale_price || item.price)}</strong></td>
                    <td style={styles.td}><span style={{ padding: '4px 10px', backgroundColor: item.stock < 10 ? '#fdeded' : '#eafaf1', color: item.stock < 10 ? brand.danger : brand.success, borderRadius: '8px', fontWeight: '800', fontSize: '12px' }}>{item.stock} cái</span></td>
                    <td style={styles.td}><div style={{ display: 'flex', gap: '15px' }}><Edit3 size={20} color={brand.primary} style={{ cursor: 'pointer' }} onClick={() => handleEdit(item, "Sản phẩm")} /><Trash2 size={20} color={brand.danger} style={{ cursor: 'pointer' }} /></div></td>
                  </>
                )}
                {activeMenu === "Danh mục" && (
                  <>
                    <td style={styles.td}><span style={{ color: brand.muted }}>#{item.id}</span></td>
                    <td style={styles.td}><strong>{item.name}</strong></td>
                    <td style={styles.td}><code>{item.slug}</code></td>
                    <td style={styles.td}><div style={{ display: 'flex', gap: '15px' }}><Edit3 size={20} color={brand.primary} style={{ cursor: 'pointer' }} onClick={() => handleEdit(item, "Danh mục")} /><Trash2 size={20} color={brand.danger} style={{ cursor: 'pointer' }} /></div></td>
                  </>
                )}
                {activeMenu === "Đơn hàng" && (
                  <>
                    <td style={styles.td}><strong>#{item.order_code}</strong></td>
                    <td style={styles.td}>{item.recipient_name}</td>
                    <td style={styles.td}><strong>{formatVnd(item.total_amount)}</strong></td>
                    <td style={styles.td}><span style={styles.badge(item.status)}>{item.status}</span></td>
                    <td style={styles.td}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                  </>
                )}
                {activeMenu === "Khách hàng" && (
                  <>
                    <td style={styles.td}><strong>{item.full_name}</strong></td>
                    <td style={styles.td}><span style={{ color: brand.muted }}>{item.email}</span></td>
                    <td style={styles.td}><span style={{ padding: '6px 12px', borderRadius: '10px', backgroundColor: item.role === 'admin' ? `${brand.primary}15` : '#eee', color: item.role === 'admin' ? brand.primary : brand.text, fontWeight: '800', fontSize: '11px', textTransform: 'uppercase' }}>{item.role}</span></td>
                    <td style={styles.td}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                  </>
                )}
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: brand.muted }}>Hệ thống chưa ghi nhận dữ liệu cho mục này.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

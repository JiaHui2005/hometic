import React, { useState } from "react";
import {
  Package, Edit3, Trash2, Loader2, CheckCircle2, XCircle,
  RotateCcw, Eye, Clock, Truck, CheckCircle, AlertCircle,
  Layers, User, Hash, Tag, Search
} from "lucide-react";
import { brand, adminStyles as styles } from "./AdminStyles";
import { formatVnd } from "../../constants";
import { catalogService, orderService } from "../../services/api";

export default function DataList({
  activeMenu,
  data,
  loading,
  handleAddNew,
  handleEdit,
  handleViewCustomerOrders,
  refreshData
}) {
  // --- STATE TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- LOGIC LỌC DỮ LIỆU TẠI CHỖ ---
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();

    switch (activeMenu) {
      case "Sản phẩm":
        return item.name?.toLowerCase().includes(s) || item.category?.name?.toLowerCase().includes(s);
      case "Danh mục":
        return item.name?.toLowerCase().includes(s) || item.slug?.toLowerCase().includes(s);
      case "Đơn hàng":
        return item.order_code?.toLowerCase().includes(s) || item.recipient_name?.toLowerCase().includes(s);
      case "Khách hàng":
        return item.full_name?.toLowerCase().includes(s) || item.email?.toLowerCase().includes(s);
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const actionBtnStyle = (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: color,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: `1.5px solid ${color}`,
    padding: 0
  });

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Ngừng bán sản phẩm "${product.name}"?`)) {
      try { await catalogService.deleteProduct(product.id); if (refreshData) refreshData(); } catch (error) { alert(error.message); }
    }
  };

  const handleRestoreProduct = async (product) => {
    try { await catalogService.restoreProduct(product.id); if (refreshData) refreshData(); } catch (error) { alert(error.message); }
  };

  const handleDeleteCategory = async (cat) => {
    if (window.confirm(`Bạn có chắc muốn ẩn danh mục "${cat.name}"?`)) {
      try { await catalogService.deleteCategory(cat.id); if (refreshData) refreshData(); } catch (error) { alert(error.message); }
    }
  };

  const handleRestoreCategory = async (cat) => {
    try { await catalogService.restoreCategory(cat.id); if (refreshData) refreshData(); } catch (error) { alert(error.message); }
  };

  const handleViewOrder = async (order) => {
    try {
      const orderDetail = await orderService.getAdminOrderDetail(order.id);
      handleEdit(orderDetail, "Đơn hàng");
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  return (
    <div style={styles.tableWrapper}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0, color: brand.sidebar, fontSize: '28px', fontWeight: '900' }}>Quản lý {activeMenu}</h2>
          <p style={{ color: brand.muted, fontSize: '14px', marginTop: '5px' }}>Hệ thống quản trị Hometic cao cấp.</p>
        </div>
        {activeMenu !== "Khách hàng" && activeMenu !== "Đơn hàng" && (
          <button
            onClick={() => handleAddNew(activeMenu)}
            style={{ backgroundColor: brand.orange, color: 'white', border: 'none', padding: '15px 30px', borderRadius: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 20px rgba(218, 143, 72, 0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <Package size={20} /> Thêm {activeMenu} mới
          </button>
        )}
      </div>

      {/* --- THANH TÌM KIẾM --- */}
      <div style={{ position: 'relative', marginBottom: '30px', maxWidth: '400px' }}>
        <Search
          size={18}
          style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: brand.muted }}
        />
        <input
          type="text"
          placeholder={`Tìm kiếm ${activeMenu.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 15px 12px 45px',
            borderRadius: '12px',
            border: `1px solid ${brand.border}`,
            outline: 'none',
            fontSize: '14px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = brand.primary}
          onBlur={(e) => e.target.style.borderColor = brand.border}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={40} color={brand.primary} style={{ margin: '0 auto' }} /></div>
      ) : (
        <table style={styles.table}>
          <thead>
            {activeMenu === "Sản phẩm" && (
              <tr>
                <th style={styles.th}>Sản phẩm</th>
                <th style={styles.th}>Phân loại</th>
                <th style={styles.th}>Giá bán</th>
                <th style={styles.th}>Kho hàng</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Thao tác</th>
              </tr>
            )}
            {activeMenu === "Danh mục" && (
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Tên danh mục</th>
                <th style={styles.th}>Slug</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Thao tác</th>
              </tr>
            )}
            {activeMenu === "Đơn hàng" && (
              <tr>
                <th style={styles.th}>Mã đơn</th>
                <th style={styles.th}>Khách hàng</th>
                <th style={styles.th}>Ngày đặt</th>
                <th style={styles.th}>Tổng tiền</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Thao tác</th>
              </tr>
            )}
            {activeMenu === "Khách hàng" && (
              <tr>
                <th style={styles.th}>Khách hàng</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Vai trò</th>
                <th style={styles.th}>Ngày tham gia</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Thao tác</th>
              </tr>
            )}
          </thead>
          <tbody>
            {paginatedData.length > 0 ? paginatedData.map((item) => {
              const orderStatus = activeMenu === "Đơn hàng" ? getOrderStatus(item.status) : null;

              return (
                <tr key={item.id} className="admin-tr">
                  {/* --- TAB SẢN PHẨM --- */}
                  {activeMenu === "Sản phẩm" && (
                    <>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <img src={item.image_url} style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover' }} alt="" />
                          <div style={{ fontWeight: '700', color: brand.sidebar }}>{item.name}</div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontSize: '13px' }}>{item.category?.name || '---'}</div>
                      </td>
                      <td style={styles.td}><strong style={{ color: brand.primary }}>{formatVnd(item.sale_price || item.price)}</strong></td>
                      <td style={styles.td}><div style={{ fontWeight: '700' }}>{item.stock} cái</div></td>
                      <td style={styles.td}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                          backgroundColor: item.is_active ? '#eafaf1' : '#f4f4f5',
                          color: item.is_active ? brand.success : brand.muted,
                          border: `1px solid ${item.is_active ? brand.success : brand.muted}40`
                        }}>{item.is_active ? "ĐANG BÁN" : "NGỪNG BÁN"}</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button onClick={() => handleEdit(item, "Sản phẩm")} style={actionBtnStyle(brand.primary)} title="Sửa"><Edit3 size={16} /></button>
                          {item.is_active ?
                            <button onClick={() => handleDeleteProduct(item)} style={actionBtnStyle(brand.danger)} title="Ngừng bán"><Trash2 size={16} /></button> :
                            <button onClick={() => handleRestoreProduct(item)} style={actionBtnStyle(brand.success)} title="Bán lại"><RotateCcw size={16} /></button>
                          }
                        </div>
                      </td>
                    </>
                  )}

                  {/* --- TAB DANH MỤC --- */}
                  {activeMenu === "Danh mục" && (
                    <>
                      <td style={styles.td}><div style={{ backgroundColor: '#f4f4f5', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>#{item.id}</div></td>
                      <td style={styles.td}><strong>{item.name}</strong></td>
                      <td style={styles.td}><code style={{ color: brand.orange }}>/{item.slug}</code></td>
                      <td style={styles.td}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                          backgroundColor: Boolean(item.is_active) ? '#eafaf1' : '#fef2f2',
                          color: Boolean(item.is_active) ? brand.success : brand.danger,
                          border: `1px solid ${Boolean(item.is_active) ? brand.success : brand.danger}40`
                        }}>{Boolean(item.is_active) ? "HOẠT ĐỘNG" : "ĐÃ ẨN"}</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button onClick={() => handleEdit(item, "Danh mục")} style={actionBtnStyle(brand.primary)} title="Sửa"><Edit3 size={16} /></button>
                          {Boolean(item.is_active) ?
                            <button onClick={() => handleDeleteCategory(item)} style={actionBtnStyle(brand.danger)} title="Ẩn"><XCircle size={16} /></button> :
                            <button onClick={() => handleRestoreCategory(item)} style={actionBtnStyle(brand.success)} title="Hiện"><RotateCcw size={16} /></button>
                          }
                        </div>
                      </td>
                    </>
                  )}

                  {/* --- TAB ĐƠN HÀNG --- */}
                  {activeMenu === "Đơn hàng" && (
                    <>
                      <td style={styles.td}><div style={{ color: brand.primary, fontWeight: '800' }}>#{item.order_code}</div></td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '700' }}>{item.recipient_name}</div>
                        <div style={{ fontSize: '11px', color: brand.muted }}>{item.recipient_phone}</div>
                      </td>
                      <td style={styles.td}><div style={{ fontSize: '13px' }}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</div></td>
                      <td style={styles.td}><strong style={{ color: brand.orange }}>{formatVnd(item.total_amount)}</strong></td>
                      <td style={styles.td}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                          backgroundColor: orderStatus.bg, color: orderStatus.text, border: `1px solid ${orderStatus.text}40`
                        }}>{orderStatus.label}</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <button onClick={() => handleViewOrder(item)} style={actionBtnStyle(brand.orange)} title="Xem chi tiết"><Eye size={18} /></button>
                      </td>
                    </>
                  )}

                  {/* --- TAB KHÁCH HÀNG --- */}
                  {activeMenu === "Khách hàng" && (
                    <>
                      <td style={styles.td}><strong>{item.full_name}</strong></td>
                      <td style={styles.td}>{item.email}</td>
                      <td style={styles.td}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '900',
                          backgroundColor: item.role === 'admin' ? brand.primary : '#eee',
                          color: item.role === 'admin' ? 'white' : brand.muted
                        }}>{item.role?.toUpperCase()}</span>
                      </td>
                      <td style={styles.td}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <button onClick={() => handleViewCustomerOrders(item)} style={actionBtnStyle(brand.primary)} title="Xem lịch sử mua hàng">
                          <Eye size={16} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            }) : (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '80px', color: brand.muted }}>Không tìm thấy dữ liệu phù hợp.</td></tr>
            )}
          </tbody>
        </table>
      )}

      {/* --- PHÂN TRANG --- */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${brand.border}`, backgroundColor: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? brand.muted : brand.primary, fontWeight: '700' }}
          >
            Trước
          </button>
          <div style={{ fontSize: '14px', fontWeight: '800', color: brand.sidebar }}>
            Trang {currentPage} / {totalPages}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${brand.border}`, backgroundColor: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? brand.muted : brand.primary, fontWeight: '700' }}
          >
            Sau
          </button>
        </div>
      )}
      <style>{`
        .admin-tr:hover { background-color: #fcfaf6 !important; }
        button:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
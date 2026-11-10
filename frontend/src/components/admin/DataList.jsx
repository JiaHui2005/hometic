import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, EyeOff, RotateCcw, Eye, Inbox } from "lucide-react";
import { formatVnd } from "../../utils/format";
import { catalogService, orderService, getImgUrl } from "../../services/api";
import alertService from "../../services/alertService";
import { StatusBadge } from "../common";

const COLUMNS = {
  "Sản phẩm": ["Sản phẩm", "Danh mục", "Giá bán", "Tồn kho", "Trạng thái", ""],
  "Danh mục": ["Mã", "Tên danh mục", "Đường dẫn", "Trạng thái", ""],
  "Đơn hàng": ["Mã đơn", "Khách hàng", "Ngày đặt", "Tổng tiền", "Trạng thái", ""],
  "Khách hàng": ["Khách hàng", "Email", "Vai trò", "Ngày tham gia", ""],
};

const ITEMS_PER_PAGE = 10;

export default function DataList({
  activeMenu,
  data,
  loading,
  searchTerm = "",
  handleAddNew,
  handleEdit,
  handleViewCustomerOrders,
  refreshData
}) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

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

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const canAdd = activeMenu === "Sản phẩm" || activeMenu === "Danh mục";
  const columns = COLUMNS[activeMenu] || [];

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Ngừng bán sản phẩm "${product.name}"?`)) {
      try { 
        await catalogService.deleteProduct(product.id); 
        alertService.success("Thành công!", `Đã ngừng bán "${product.name}"`);
        if (refreshData) refreshData(); 
      } catch (error) { 
        alertService.error("Lỗi!", error.message); 
      }
    }
  };

  const handleRestoreProduct = async (product) => {
    try { 
      await catalogService.restoreProduct(product.id); 
      alertService.success("Thành công!", `Đã khôi phục sản phẩm "${product.name}"`);
      if (refreshData) refreshData(); 
    } catch (error) { 
      alertService.error("Lỗi!", error.message); 
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (window.confirm(`Bạn có chắc muốn ẩn danh mục "${cat.name}"?`)) {
      try { 
        await catalogService.deleteCategory(cat.id); 
        alertService.success("Thành công!", `Đã ẩn danh mục "${cat.name}"`);
        if (refreshData) refreshData(); 
      } catch (error) { 
        alertService.error("Lỗi!", error.message); 
      }
    }
  };

  const handleRestoreCategory = async (cat) => {
    try { 
      await catalogService.restoreCategory(cat.id); 
      alertService.success("Thành công!", `Đã hiển thị danh mục "${cat.name}"`);
      if (refreshData) refreshData(); 
    } catch (error) { 
      alertService.error("Lỗi!", error.message); 
    }
  };

  const handleViewOrder = async (order) => {
    try {
      const orderDetail = await orderService.getAdminOrderDetail(order.id);
      handleEdit(orderDetail, "Đơn hàng");
    } catch (error) {
      alertService.error("Lỗi!", error.message);
    }
  };

  const renderRow = (item) => {
    if (activeMenu === "Sản phẩm") {
      return (
        <tr key={item.id} className={item.is_active ? "" : "row-muted"}>
          <td>
            <div className="cell-product">
              <img src={getImgUrl(item.image_url, 120)} alt="" />
              <strong>{item.name}</strong>
            </div>
          </td>
          <td className="muted">{item.category?.name || "—"}</td>
          <td className="price">{formatVnd(item.sale_price || item.price)}</td>
          <td>{item.stock}</td>
          <td>
            <span className={`tag ${item.is_active ? "tag-success" : "tag-neutral"}`}>
              {item.is_active ? "Đang bán" : "Ngừng bán"}
            </span>
          </td>
          <td>
            <div className="cell-actions">
              <button className="icon-btn" onClick={() => handleEdit(item, "Sản phẩm")} title="Sửa" aria-label={`Sửa ${item.name}`}><Pencil size={16} /></button>
              {item.is_active
                ? <button className="icon-btn is-danger" onClick={() => handleDeleteProduct(item)} title="Ngừng bán" aria-label={`Ngừng bán ${item.name}`}><Trash2 size={16} /></button>
                : <button className="icon-btn is-success" onClick={() => handleRestoreProduct(item)} title="Bán lại" aria-label={`Bán lại ${item.name}`}><RotateCcw size={16} /></button>}
            </div>
          </td>
        </tr>
      );
    }

    if (activeMenu === "Danh mục") {
      const active = Boolean(item.is_active);
      return (
        <tr key={item.id} className={active ? "" : "row-muted"}>
          <td className="muted">#{item.id}</td>
          <td><strong>{item.name}</strong></td>
          <td className="muted">/{item.slug}</td>
          <td>
            <span className={`tag ${active ? "tag-success" : "tag-neutral"}`}>{active ? "Đang hiện" : "Đã ẩn"}</span>
          </td>
          <td>
            <div className="cell-actions">
              <button className="icon-btn" onClick={() => handleEdit(item, "Danh mục")} title="Sửa" aria-label={`Sửa ${item.name}`}><Pencil size={16} /></button>
              {active
                ? <button className="icon-btn is-danger" onClick={() => handleDeleteCategory(item)} title="Ẩn" aria-label={`Ẩn ${item.name}`}><EyeOff size={16} /></button>
                : <button className="icon-btn is-success" onClick={() => handleRestoreCategory(item)} title="Hiện lại" aria-label={`Hiện lại ${item.name}`}><RotateCcw size={16} /></button>}
            </div>
          </td>
        </tr>
      );
    }

    if (activeMenu === "Đơn hàng") {
      return (
        <tr key={item.id} style={{ cursor: "pointer" }} onClick={() => handleViewOrder(item)}>
          <td><strong>#{item.order_code}</strong></td>
          <td>
            {item.recipient_name}
            {item.recipient_phone && <div className="muted" style={{ fontSize: 12 }}>{item.recipient_phone}</div>}
          </td>
          <td className="muted">{new Date(item.created_at).toLocaleDateString("vi-VN")}</td>
          <td className="price">{formatVnd(item.total_amount)}</td>
          <td><StatusBadge status={item.status} /></td>
          <td>
            <div className="cell-actions">
              <button className="icon-btn" onClick={(e) => { e.stopPropagation(); handleViewOrder(item); }} title="Xem chi tiết" aria-label={`Xem đơn ${item.order_code}`}><Eye size={16} /></button>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <tr key={item.id}>
        <td><strong>{item.full_name}</strong></td>
        <td className="muted">{item.email}</td>
        <td>
          <span className={`tag ${item.role === "admin" ? "tag-info" : "tag-neutral"}`}>
            {item.role === "admin" ? "Quản trị" : "Khách hàng"}
          </span>
        </td>
        <td className="muted">{new Date(item.created_at).toLocaleDateString("vi-VN")}</td>
        <td>
          <div className="cell-actions">
            <button className="icon-btn" onClick={() => handleViewCustomerOrders(item)} title="Lịch sử mua hàng" aria-label={`Lịch sử mua hàng của ${item.full_name}`}><Eye size={16} /></button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <section className="panel">
      <div className="data-toolbar">
        <p className="muted" style={{ fontSize: 14 }}>
          {loading ? "Đang tải…" : `${filteredData.length} ${activeMenu.toLowerCase()}`}
        </p>
        {canAdd && (
          <button className="btn btn-primary btn-sm" onClick={() => handleAddNew(activeMenu)}>
            <Plus size={16} /> Thêm {activeMenu.toLowerCase()}
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-block"><div className="spinner" /></div>
      ) : paginatedData.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><Inbox size={26} /></span>
          <h3>{searchTerm ? "Không có kết quả phù hợp" : "Chưa có dữ liệu"}</h3>
          {searchTerm && <p>Thử từ khoá khác.</p>}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>{columns.map((c, i) => <th key={i}>{c}</th>)}</tr>
            </thead>
            <tbody>{paginatedData.map(renderRow)}</tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Phân trang">
          <span>Trang {currentPage} / {totalPages}</span>
          <div className="pagination__pages">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Trước</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
              .map((n, i, arr) => (
                <React.Fragment key={n}>
                  {i > 0 && n - arr[i - 1] > 1 && <span aria-hidden="true">…</span>}
                  <button className={n === currentPage ? "is-active" : ""} onClick={() => setCurrentPage(n)}>{n}</button>
                </React.Fragment>
              ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Sau</button>
          </div>
        </nav>
      )}
    </section>
  );
}

import React, { useState, useEffect } from "react";
import alertService from "../services/alertService";
import { adminService, catalogService, orderService, api } from "../services/api";
import { adminStyles as styles } from "./Admin/AdminStyles";
import Sidebar from "./Admin/Sidebar";
import Header from "./Admin/Header";
import Dashboard from "./Admin/Dashboard";
import DataList from "./Admin/DataList";
import AdminModal from "./Admin/AdminModal";

export default function Admin({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState("Tổng quan");
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allCategories, setAllCategories] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [modalTab, setModalTab] = useState("Cơ bản");

  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    fetchData();
    catalogService.getCategories().then(setAllCategories).catch(() => { });
  }, [activeMenu]);

  const fetchData = async () => {
    setLoading(true);
    setData([]);
    try {
      if (activeMenu === "Tổng quan") {
        const [dashRes, chartRes] = await Promise.all([
          adminService.getDashboard().catch(e => ({ error: e })),
          adminService.getCharts().catch(e => ({ error: e }))
        ]);
        if (!dashRes.error) setStats(dashRes);
        if (!chartRes.error) setChartData(chartRes);
      } else if (activeMenu === "Sản phẩm") {
        const res = await catalogService.getProducts();
        setData(res || []);
      } else if (activeMenu === "Danh mục") {
        const res = await catalogService.getCategories();
        setData(res || []);
      } else if (activeMenu === "Đơn hàng") {
        const res = await orderService.getAllOrders();
        setData(res || []);
      } else if (activeMenu === "Khách hàng") {
        const res = await adminService.getUsers();
        setData(res || []);
      }
    } catch (err) {
      console.error("Lỗi API Admin:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    if (!searchQuery) return true;
    const s = searchQuery.toLowerCase();
    if (activeMenu === "Sản phẩm") return item.name?.toLowerCase().includes(s);
    if (activeMenu === "Danh mục") return item.name?.toLowerCase().includes(s);
    if (activeMenu === "Đơn hàng") return item.order_code?.toLowerCase().includes(s) || item.recipient_name?.toLowerCase().includes(s);
    if (activeMenu === "Khách hàng") return item.full_name?.toLowerCase().includes(s) || item.email?.toLowerCase().includes(s);
    return true;
  });

  const handleViewCustomerOrders = async (customer) => {
    setModalType("Khách hàng");
    setEditingItem(customer);
    setIsModalOpen(true);
    setLoadingOrders(true);

    try {
      const response = await api(`/admin/users/${customer.id}/orders`);
      setCustomerOrders(response || []);
    } catch (error) {
      alert("Không thể lấy lịch sử đơn hàng: " + error.message);
      setIsModalOpen(false);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleEdit = async (item, type) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
    setModalTab("Cơ bản");
    setLoading(true);
    try {
      let detail;
      if (type === "Sản phẩm") {
        detail = await catalogService.getProduct(item.id);
        if (!detail.detail) detail.detail = { warranty_info: "12 tháng", origin: "Việt Nam" };
      } else if (type === "Danh mục") {
        detail = await catalogService.getCategory(item.id);
      } else if (type === "Đơn hàng") {
        detail = await orderService.getAdminOrderDetail(item.id);
      } else {
        detail = item;
      }
      setFormData(detail);
    } catch (err) {
      console.error("Lỗi lấy chi tiết:", err);
      setFormData(item);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setEditingItem(null);
    setModalTab("Cơ bản");
    setFormData(type === "Sản phẩm" ? {
      is_active: true,
      detail: { warranty_info: "12 tháng", origin: "Việt Nam", specifications: {}, gallery_urls: [] }
    } : { is_active: true });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e, fieldPath) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await adminService.uploadImage(file);
      const newFormData = { ...formData };
      if (fieldPath.includes('.')) {
        const [parent, child] = fieldPath.split('.');
        newFormData[parent] = { ...newFormData[parent], [child]: res.url };
      } else {
        newFormData[fieldPath] = res.url;
      }
      setFormData(newFormData);
    } catch (err) {
      alertService.error("Lỗi upload!", err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const submitData = { ...formData };
      if (modalType === "Sản phẩm") {
        if (editingItem) {
          await catalogService.updateProduct(editingItem.id, submitData);
          alertService.success("Thành công!", "Cập nhật sản phẩm thành công.");
        } else {
          await catalogService.createProduct(submitData);
          alertService.success("Thành công!", "Tạo sản phẩm mới thành công.");
        }
      } else if (modalType === "Danh mục") {
        if (editingItem) {
          await catalogService.updateCategory(editingItem.id, submitData);
          alertService.success("Thành công!", "Cập nhật danh mục thành công.");
        } else {
          await catalogService.createCategory(submitData);
          alertService.success("Thành công!", "Tạo danh mục mới thành công.");
        }
      } else if (modalType === "Đơn hàng") {
        // Chỉ cập nhật trạng thái
        await orderService.updateOrderStatus(editingItem.id, submitData.status);
        alertService.success("Thành công!", "Cập nhật trạng thái đơn hàng thành công.");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alertService.error("Lỗi!", err.response?.data?.detail || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={onLogout}
      />

      <main style={styles.main}>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {activeMenu === "Tổng quan" ? (
          <Dashboard stats={stats} chartData={chartData} setActiveMenu={setActiveMenu} />
        ) : (
          <DataList
            activeMenu={activeMenu}
            data={filteredData}
            loading={loading}
            handleAddNew={handleAddNew}
            handleEdit={handleEdit}
            refreshData={fetchData}
            handleViewCustomerOrders={handleViewCustomerOrders}
          />
        )}
      </main>

      <AdminModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalType={modalType}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        modalTab={modalTab}
        setModalTab={setModalTab}
        submitting={submitting}
        handleSave={handleSave}
        handleImageUpload={handleImageUpload}
        categories={allCategories}
        customerOrders={customerOrders}
        loadingOrders={loadingOrders}
      />
    </div>
  );
}

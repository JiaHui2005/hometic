import React, { useState, useEffect } from "react";
import { adminService, catalogService, orderService } from "../services/api";
import { adminStyles as styles } from "./Admin/AdminStyles";

// Sub-components
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

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "Sản phẩm" or "Danh mục"
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [modalTab, setModalTab] = useState("Cơ bản"); // "Cơ bản" or "Chi tiết"

  useEffect(() => {
    fetchData();
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
      } else {
        detail = await catalogService.getCategory(item.id);
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
      alert("Lỗi upload: " + err.message);
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
        } else {
          await catalogService.createProduct(submitData);
        }
      } else {
        if (editingItem) {
          await catalogService.updateCategory(editingItem.id, submitData);
        } else {
          await catalogService.createCategory(submitData);
        }
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.detail || err.message));
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
        <Header />
        
        {activeMenu === "Tổng quan" ? (
          <Dashboard stats={stats} chartData={chartData} />
        ) : (
          <DataList 
            activeMenu={activeMenu} 
            data={data} 
            loading={loading} 
            handleAddNew={handleAddNew} 
            handleEdit={handleEdit} 
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
      />
    </div>
  );
}
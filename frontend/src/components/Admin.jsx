import React, { useState } from "react";
import {
  LayoutDashboard, Package, ListTree, ShoppingCart,
  Users, FileBarChart, Search, Bell, User,
  CircleDollarSign, Smartphone, ChevronDown,
  CreditCard, Trash2, Edit3, Download, Calendar
} from "lucide-react";

export default function Admin({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState("Tổng quan");

  // --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
  const mockProducts = [
    { id: "P001", name: "Robot hút bụi Hometic V10", price: "7.990.000đ", stock: 12, category: "Gia dụng", img: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=50" },
    { id: "P002", name: "Nồi chiên không dầu SmartCook", price: "2.490.000đ", stock: 45, category: "Nhà bếp", img: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=50" },
    { id: "P003", name: "Máy lọc không khí Hometic Pure", price: "4.200.000đ", stock: 8, category: "Gia dụng", img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=50" },
  ];

  const mockCategories = [
    { id: 1, name: "Gia dụng thông minh", slug: "gia-dung", count: 24 },
    { id: 2, name: "Dụng cụ nhà bếp", slug: "nha-bep", count: 18 },
    { id: 3, name: "Thiết bị điện tử", slug: "dien-tu", count: 12 },
  ];

  const mockOrders = [
    { id: "#ORD-7721", customer: "Nguyễn Văn A", total: "1.230.000đ", status: "Thành công", date: "26/04/2026" },
    { id: "#ORD-7722", customer: "Trần Thị B", total: "850.000đ", status: "Đang xử lý", date: "27/04/2026" },
    { id: "#ORD-7723", customer: "Lê Minh C", total: "4.200.000đ", status: "Đã hủy", date: "25/04/2026" },
  ];

  const mockUsers = [
    { name: "Nguyễn Văn A", email: "a@gmail.com", phone: "0901234567", join: "12/01/2026", orders: 5, spent: "12.500.000đ" },
    { name: "Trần Thị B", email: "b@yahoo.com", phone: "0987654321", join: "15/02/2026", orders: 2, spent: "3.200.000đ" },
    { name: "Lê Minh C", email: "c@hometic.vn", phone: "0912123123", join: "20/03/2026", orders: 12, spent: "45.000.000đ" },
  ];

  // --- HỆ THỐNG MÀU ---
  const brand = {
    bg: "#f9f5ed", sidebar: "#234a4a", primary: "#008080",
    orange: "#da8f48", white: "#ffffff", panel: "#e5e5e5",
    text: "#1a1a1a", muted: "#666", success: "#27ae60",
    warning: "#f39c12", danger: "#e74c3c"
  };

  const styles = {
    container: { display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: brand.bg, fontFamily: '"Inter", sans-serif', color: brand.text, overflow: 'hidden' },
    sidebar: { width: '260px', backgroundColor: brand.sidebar, color: brand.white, display: 'flex', flexDirection: 'column', padding: '30px 15px', height: '100vh', position: 'sticky', top: 0, boxSizing: 'border-box' },
    main: { flex: 1, height: '100vh', overflowY: 'auto', padding: '25px 35px', boxSizing: 'border-box' },
    navButton: (active) => ({ width: '100%', padding: '12px 15px', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent', color: active ? brand.orange : brand.white, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', transition: '0.2s' }),
    card: { backgroundColor: brand.white, borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { textAlign: 'left', padding: '12px 15px', color: brand.muted, fontSize: '13px', borderBottom: '1px solid #eee' },
    td: { padding: '15px', fontSize: '14px', borderBottom: '1px solid #f9f9f9' },
    badge: (status) => {
      let bg = '#eee', color = '#666';
      if (status === 'Thành công') { bg = '#eafaf1'; color = brand.success; }
      else if (status === 'Đang xử lý') { bg = '#fff8e1'; color = brand.orange; }
      else if (status === 'Đã hủy') { bg = '#fdeded'; color = brand.danger; }
      return { backgroundColor: bg, color: color, padding: '4px 10px', borderRadius: '6px', fontWeight: '600', fontSize: '12px' };
    }
  };

  // --- DASHBOARD RENDER (GIỮ NGUYÊN) ---
  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      {/* 3 Stats Cards at Top */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: brand.muted, fontSize: '18px', fontWeight: '600' }}>Tổng doanh thu</div>
              <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '10px' }}>
                1.20M VNĐ <span style={{ fontSize: '14px', color: brand.primary, backgroundColor: '#e0f2f1', padding: '2px 6px', borderRadius: '4px' }}>+16%</span>
              </div>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#e0f2f1', borderRadius: '8px' }}>
              <CreditCard size={24} color={brand.primary} />
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: brand.muted, fontSize: '18px', fontWeight: '600' }}>Đơn hàng mới</div>
              <div style={{ fontSize: '36px', fontWeight: '800', marginTop: '5px' }}>156</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#e0f2f1', borderRadius: '8px' }}>
              <ShoppingCart size={24} color={brand.primary} />
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: brand.muted, fontSize: '18px', fontWeight: '600' }}>Sản phẩm bán chạy</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                <div style={{ backgroundColor: brand.orange, padding: '8px', borderRadius: '8px' }}>
                  <Smartphone size={24} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>Robot hút bụi Hometic</div>
                  <div style={{ fontSize: '12px', color: brand.muted }}>Hot product</div>
                </div>
              </div>
            </div>
            <div style={{ padding: '10px', backgroundColor: '#e0f2f1', borderRadius: '8px' }}>
              <Package size={24} color={brand.primary} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row - Bổ sung trục tọa độ và đơn vị */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '25px' }}>
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Biến động doanh thu 30 ngày</h3>
            <div style={{ display: 'flex', gap: '15px', fontSize: '13px' }}>
              <span><i style={{ display: 'inline-block', width: '20px', height: '3px', backgroundColor: brand.primary, verticalAlign: 'middle', marginRight: '5px' }}></i> doanh thu</span>
              <span><i style={{ display: 'inline-block', width: '20px', height: '3px', backgroundColor: brand.orange, verticalAlign: 'middle', marginRight: '5px' }}></i> ngày</span>
            </div>
          </div>

          <div style={{ display: 'flex', height: '240px' }}>
            {/* Trục Y - Đơn vị triệu VNĐ */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              paddingRight: '15px',
              color: brand.muted,
              fontSize: '11px',
              textAlign: 'right',
              width: '45px',
              borderRight: `1px solid ${brand.panel}`
            }}>
              <span>8.00M</span>
              <span>6.00M</span>
              <span>4.00M</span>
              <span>2.00M</span>
              <span>0</span>
            </div>

            <div style={{ flex: 1, position: 'relative', paddingLeft: '10px' }}>
              <svg viewBox="0 0 500 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {/* Grid Lines ngang */}
                {[0, 37.5, 75, 112.5, 150].map((line) => (
                  <line key={line} x1="0" y1={line} x2="500" y2={line} stroke="#eee" strokeWidth="1" />
                ))}

                {/* Đường biểu đồ Doanh thu (Teal) */}
                <path
                  d="M0,120 Q50,60 100,90 T200,40 T300,80 T400,30 T500,70"
                  fill="none"
                  stroke={brand.primary}
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Đường biểu đồ Ngày (Orange) */}
                <path
                  d="M0,140 Q50,120 100,130 T200,100 T300,110 T400,90 T500,120"
                  fill="none"
                  stroke={brand.orange}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              {/* Trục X - Mốc thời gian (Ngày) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: brand.muted, fontSize: '11px', marginTop: '12px', paddingLeft: '5px' }}>
                <span>1</span><span>3</span><span>5</span><span>7</span><span>9</span><span>11</span><span>13</span><span>15</span><span>17</span><span>19</span><span>21</span><span>24</span><span>26</span><span>30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ tròn - Bổ sung nhãn tỷ lệ % */}
        <div style={styles.card}>
          <h3 style={{ margin: '0 0 20px 0' }}>Doanh thu theo danh mục</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px', position: 'relative' }}>
            <div style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: `conic-gradient(${brand.primary} 0% 45%, ${brand.orange} 45% 75%, #f3d2a2 75% 92%, #95a5a6 92% 100%)`,
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
            }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i style={{ width: '10px', height: '10px', borderRadius: '50%', background: brand.primary }}></i> Kitchenware
              </span>
              <span style={{ fontWeight: '700' }}>45%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i style={{ width: '10px', height: '10px', borderRadius: '50%', background: brand.orange }}></i> Bedroom
              </span>
              <span style={{ fontWeight: '700' }}>30%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f3d2a2' }}></i> Utilities
              </span>
              <span style={{ fontWeight: '700' }}>17%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#95a5a6' }}></i> Cleaning
              </span>
              <span style={{ fontWeight: '700' }}>8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Đơn hàng gần đây */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '25px' }}>
        <div style={styles.card}>
          <h3 style={{ margin: '0 0 20px 0' }}>Đơn hàng gần đây</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: brand.muted, fontSize: '13px', borderBottom: `1px solid ${brand.panel}` }}>
                <th style={{ padding: '12px 10px' }}>Order ID</th>
                <th style={{ padding: '12px 10px' }}>Khách hàng</th>
                <th style={{ padding: '12px 10px' }}>Sản phẩm</th>
                <th style={{ padding: '12px 10px' }}>Ngày</th>
                <th style={{ padding: '12px 10px' }}>Trạng thái</th>
                <th style={{ padding: '12px 10px' }}>Tổng</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              {[
                { id: "0001245", user: "Nguyễn A", prod: "Hũ gia vị Hometic", date: "18/04", status: "Thành công", total: "1.23M", stColor: brand.success, stBg: '#eafaf1' },
                { id: "0001245", user: "Nguyễn A", prod: "Hũ gia vị Hometic", date: "18/04", status: "Đang xử lý", total: "1.23M", stColor: brand.orange, stBg: '#fff8e1' },
                { id: "0001245", user: "Nguyễn A", prod: "Hũ gia vị Hometic", date: "18/04", status: "Thất bại", total: "1.23M", stColor: brand.danger, stBg: '#fdeded' },
              ].map((order, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '15px 10px' }}>{order.id}</td>
                  <td style={{ padding: '15px 10px' }}>{order.user}</td>
                  <td style={{ padding: '15px 10px' }}>{order.prod}</td>
                  <td style={{ padding: '15px 10px' }}>{order.date}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <span style={{ backgroundColor: order.stBg, color: order.stColor, padding: '4px 8px', borderRadius: '4px', fontWeight: '600', fontSize: '12px' }}>{order.status}</span>
                  </td>
                  <td style={{ padding: '15px 10px', fontWeight: '600' }}>{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={styles.card}>
          <h3 style={{ margin: '0 0 20px 0' }}>Cảnh báo tồn kho</h3>
          <div style={{ textAlign: 'center', padding: '60px 0', color: brand.muted }}>
            <Package size={48} style={{ opacity: 0.1, marginBottom: '10px' }} />
            <p style={{ fontSize: '14px' }}>Hiện tại không có mặt hàng nào<br />dưới ngưỡng tồn kho tối thiểu.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // --- RENDER BÁO CÁO ---
  const renderReports = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
        {[
          { label: "Lợi nhuận", value: "342.000.000đ", color: brand.success },
          { label: "Giá trị TB", value: "1.250.000đ", color: brand.primary },
          { label: "Tỉ lệ hủy", value: "2.4%", color: brand.danger },
          { label: "Lượt truy cập", value: "12.842", color: brand.warning }
        ].map(item => (
          <div key={item.label} style={{ ...styles.card, textAlign: 'center' }}>
            <div style={{ color: brand.muted, fontSize: '14px' }}>{item.label}</div>
            <div style={{ fontSize: '20px', fontWeight: '800', marginTop: '5px', color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Báo cáo tăng trưởng</h3>
          <button style={{ backgroundColor: 'transparent', border: '1px solid #ccc', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Download size={16} /> Xuất Excel
          </button>
        </div>
        <div style={{ height: '300px', backgroundColor: brand.bg, borderRadius: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '20px' }}>
          {[45, 60, 55, 80, 70, 95, 85].map((h, i) => (
            <div key={i} style={{ width: '40px', height: `${h}%`, backgroundColor: brand.primary, borderRadius: '4px 4px 0 0', position: 'relative' }}>
              <small style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '10px' }}>T{i + 1}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTable = (title, headers, data, type) => (
    <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button style={{ backgroundColor: brand.orange, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>+ Thêm mới</button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>{headers.map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {type === 'products' && (
                <>
                  <td style={styles.td}><img src={row.img} alt="p" style={{ borderRadius: '8px', width: '40px' }} /></td>
                  <td style={styles.td}><strong>{row.name}</strong><br /><small style={{ color: '#999' }}>{row.id}</small></td>
                  <td style={styles.td}>{row.price}</td>
                  <td style={styles.td}>{row.stock}</td>
                  <td style={styles.td}><Edit3 size={18} style={{ color: brand.primary, cursor: 'pointer' }} /></td>
                </>
              )}
              {type === 'categories' && (
                <>
                  <td style={styles.td}>{row.id}</td>
                  <td style={styles.td}><strong>{row.name}</strong></td>
                  <td style={styles.td}>{row.slug}</td>
                  <td style={styles.td}>{row.count}</td>
                  <td style={styles.td}><Trash2 size={18} style={{ color: brand.danger, cursor: 'pointer' }} /></td>
                </>
              )}
              {type === 'orders' && (
                <>
                  <td style={styles.td}><strong>{row.id}</strong></td>
                  <td style={styles.td}>{row.customer}</td>
                  <td style={styles.td}>{row.total}</td>
                  <td style={styles.td}><span style={styles.badge(row.status)}>{row.status}</span></td>
                  <td style={styles.td}>{row.date}</td>
                </>
              )}
              {type === 'users' && (
                <>
                  <td style={styles.td}><strong>{row.name}</strong><br /><small>{row.email}</small></td>
                  <td style={styles.td}>{row.phone}</td>
                  <td style={styles.td}>{row.orders} đơn</td>
                  <td style={styles.td}><span style={{ fontWeight: '700', color: brand.primary }}>{row.spent}</span></td>
                  <td style={styles.td}>{row.join}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', paddingLeft: '10px' }}>
          <div style={{ width: '35px', height: '35px', backgroundColor: brand.orange, borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Package color="white" size={20} />
          </div>
          <strong style={{ fontSize: '20px', letterSpacing: '-1px' }}>HOMETIC</strong>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <button style={styles.navButton(activeMenu === "Tổng quan")} onClick={() => setActiveMenu("Tổng quan")}><LayoutDashboard size={18} /> Tổng quan</button>
          <button style={styles.navButton(activeMenu === "Sản phẩm")} onClick={() => setActiveMenu("Sản phẩm")}><Package size={18} /> Sản phẩm</button>
          <button style={styles.navButton(activeMenu === "Danh mục")} onClick={() => setActiveMenu("Danh mục")}><ListTree size={18} /> Danh mục</button>
          <button style={styles.navButton(activeMenu === "Đơn hàng")} onClick={() => setActiveMenu("Đơn hàng")}><ShoppingCart size={18} /> Đơn hàng</button>
          <button style={styles.navButton(activeMenu === "Khách hàng")} onClick={() => setActiveMenu("Khách hàng")}><Users size={18} /> Khách hàng</button>
          <button style={styles.navButton(activeMenu === "Báo cáo")} onClick={() => setActiveMenu("Báo cáo")}><FileBarChart size={18} /> Báo cáo</button>
        </nav>

        <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }} onClick={onLogout}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: brand.orange, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><User size={16} color="white" /></div>
            <span style={{ fontSize: '14px' }}>Đăng xuất</span>
          </div>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: brand.muted }} />
            <input type="text" placeholder="Tìm kiếm hệ thống..." style={{ width: '100%', padding: '12px 15px 12px 45px', borderRadius: '10px', border: 'none', backgroundColor: '#eee', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Bell size={22} color={brand.sidebar} />
            <div style={{ fontWeight: '700', fontSize: '15px' }}>Jane Admin</div>
          </div>
        </header>

        <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '30px' }}>{activeMenu}</h1>

        {activeMenu === "Tổng quan" && renderDashboard()}
        {activeMenu === "Sản phẩm" && renderTable("Kho hàng", ["Ảnh", "Tên sản phẩm", "Giá", "Tồn", "HĐ"], mockProducts, 'products')}
        {activeMenu === "Danh mục" && renderTable("Phân loại", ["ID", "Tên danh mục", "Slug", "Số SP", "HĐ"], mockCategories, 'categories')}
        {activeMenu === "Đơn hàng" && renderTable("Đơn hàng mới", ["Mã ĐH", "Khách hàng", "Tổng", "Trạng thái", "Ngày"], mockOrders, 'orders')}
        {activeMenu === "Khách hàng" && renderTable("Hội viên Hometic", ["Họ tên", "Số điện thoại", "Số đơn", "Chi tiêu", "Tham gia"], mockUsers, 'users')}
        {activeMenu === "Báo cáo" && renderReports()}
      </main>
    </div>
  );
}
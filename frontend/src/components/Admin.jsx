import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Package, ListTree, ShoppingCart,
  Users, Search, Bell, User, CreditCard, Trash2,
  Edit3, Loader2, LogOut, TrendingUp, BarChart3, Calendar
} from "lucide-react";
import { adminService, catalogService, orderService } from "../services/api";
import { formatVnd } from "../constants";

export default function Admin({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState("Tổng quan");
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const brand = {
    bg: "#fdfbf7",
    sidebar: "#234a4a",
    primary: "#008080",
    orange: "#da8f48",
    white: "#ffffff",
    border: "#ece9e0",
    text: "#2d3436",
    muted: "#808e9b",
    success: "#2ecc71",
    danger: "#e74c3c",
    accent: "#f39c12",
    panel: "#f8f6f0"
  };

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

  const styles = {
    container: {
      display: 'flex',
      width: '100vw',
      height: '100vh',
      backgroundColor: brand.bg,
      fontFamily: '"Outfit", "Inter", sans-serif',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      position: 'fixed', // Đảm bảo không bị lề trình duyệt
      top: 0,
      left: 0
    },
    sidebar: {
      width: '280px',
      backgroundColor: brand.sidebar,
      color: brand.white,
      display: 'flex',
      flexDirection: 'column',
      padding: '40px 24px',
      height: '100%',
      boxSizing: 'border-box',
      flexShrink: 0,
      boxShadow: '10px 0 30px rgba(35, 74, 74, 0.05)'
    },
    navContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '40px'
    },
    main: {
      flex: 1,
      height: '100%',
      overflowY: 'auto',
      padding: '40px 50px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      scrollBehavior: 'smooth'
    },
    navButton: (active) => ({
      width: '100%',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
      color: active ? '#fff' : 'rgba(255,255,255,0.6)',
      border: 'none',
      borderRadius: '18px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: active ? '700' : '500',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textAlign: 'left'
    }),
    card: {
      backgroundColor: brand.white,
      borderRadius: '30px',
      padding: '30px',
      boxShadow: '0 15px 40px rgba(35, 74, 74, 0.04)',
      border: `1px solid ${brand.border}`,
      transition: 'transform 0.3s ease'
    },
    statsCard: {
      backgroundColor: brand.white,
      borderRadius: '28px',
      padding: '25px 30px',
      boxShadow: '0 10px 30px rgba(35, 74, 74, 0.03)',
      border: `1px solid ${brand.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    tableWrapper: {
      backgroundColor: brand.white,
      borderRadius: '32px',
      padding: '35px',
      border: `1px solid ${brand.border}`,
      boxShadow: '0 20px 50px rgba(35, 74, 74, 0.05)'
    },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' },
    th: { textAlign: 'left', padding: '15px 20px', color: brand.muted, fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' },
    td: { padding: '20px', fontSize: '14px', backgroundColor: '#fff', borderBottom: `1px solid ${brand.panel}`, color: brand.text },
    badge: (status) => {
      const colors = { 'delivered': '#27ae60', 'pending': '#ed7f1a', 'cancelled': '#e74c3c', 'shipping': '#3498db', 'processing': '#3498db' };
      const color = colors[status] || '#666';
      return {
        backgroundColor: `${color}12`,
        color: color,
        padding: '8px 14px',
        borderRadius: '12px',
        fontWeight: '800',
        fontSize: '10px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
      };
    }
  };

  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: brand.sidebar, margin: 0 }}>Chào mừng trở lại, Admin!</h1>
          <p style={{ color: brand.muted, marginTop: '8px', fontSize: '15px' }}>Dưới đây là thống kê tình hình kinh doanh của Hometic hôm nay.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
        <div style={styles.statsCard}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', background: `radial-gradient(circle, ${brand.primary}10 0%, transparent 70%)`, borderRadius: '50%' }}></div>
          <div>
            <div style={{ color: brand.muted, fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px' }}>TỔNG DOANH THU</div>
            <div style={{ fontSize: '28px', fontWeight: '900', marginTop: '12px', color: brand.primary }}>{formatVnd(stats?.total_revenue || 0)}</div>
            <div style={{ fontSize: '12px', color: brand.success, fontWeight: '700', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            </div>
          </div>
          <div style={{ padding: '15px', borderRadius: '20px', backgroundColor: `${brand.primary}10` }}>
            <CreditCard size={32} color={brand.primary} />
          </div>
        </div>

        <div style={styles.statsCard}>
          <div>
            <div style={{ color: brand.muted, fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px' }}>ĐƠN HÀNG MỚI</div>
            <div style={{ fontSize: '32px', fontWeight: '900', marginTop: '12px', color: brand.primary }}>{stats?.total_orders || 0}</div>
          </div>
          <div style={{ padding: '15px', borderRadius: '20px', backgroundColor: `${brand.orange}10` }}>
            <ShoppingCart size={32} color={brand.orange} />
          </div>
        </div>

        <div style={styles.statsCard}>
          <div>
            <div style={{ color: brand.muted, fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px' }}>KHÁCH HÀNG MỚI</div>
            <div style={{ fontSize: '32px', fontWeight: '900', marginTop: '12px', color: brand.primary }}>{stats?.total_customers || 0}</div>
          </div>
          <div style={{ padding: '15px', borderRadius: '20px', backgroundColor: `${brand.accent}15`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Users size={32} color={brand.accent} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px' }}>
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: brand.sidebar }}>Biến động doanh thu 30 ngày</h3>
            <div style={{ fontSize: '12px', color: brand.muted, fontWeight: '600' }}>Đơn vị: VNĐ</div>
          </div>
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '6px', paddingBottom: '20px', borderBottom: `1px solid ${brand.border}`, position: 'relative' }}>
            {[0, 25, 50, 75, 100].map(val => (
              <div key={val} style={{ position: 'absolute', bottom: `${val}%`, left: 0, right: 0, borderBottom: `1px dashed ${brand.border}`, zIndex: 0 }}></div>
            ))}

            {chartData?.revenue_by_day?.length > 0 ? chartData.revenue_by_day.map((point, i) => {
              const maxVal = Math.max(...chartData.revenue_by_day.map(p => p.value)) || 1;
              const height = (point.value / maxVal) * 100;
              return (
                <div key={i} style={{ flex: 1, maxWidth: '40px', position: 'relative', zIndex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${Math.max(height, 5)}%`, // Đảm bảo có chiều cao tối thiểu để thấy thanh
                      background: `linear-gradient(to top, ${brand.primary}, ${brand.primary}cc)`,
                      borderRadius: '8px 8px 0 0',
                      transition: '0.4s all ease',
                      cursor: 'pointer'
                    }}
                    title={`${point.label}: ${formatVnd(point.value)}`}
                  ></div>
                </div>
              );
            }) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: brand.muted }}>Đang tải dữ liệu biểu đồ...</div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: brand.muted, fontSize: '10px', fontWeight: '700' }}>
            <span>Ngày 1</span>
            <span>Ngày 15</span>
            <span>Hôm nay</span>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{ margin: '0 0 25px 0', fontSize: '18px', fontWeight: '900', color: brand.sidebar }}>Phân bổ danh mục</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: `conic-gradient(${brand.primary} 0% 40%, ${brand.orange} 40% 70%, ${brand.accent} 70% 90%, #eee 90% 100%)`,
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.05)',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{ width: '100px', height: '100px', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '800', color: brand.muted }}>CATEGORY</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: brand.primary }}>Hometic</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '15px' }}>
            {chartData?.revenue_by_category?.length > 0 ? chartData.revenue_by_category.slice(0, 4).map((cat, i) => {
              const colors = [brand.primary, brand.orange, brand.accent, '#95a5a6'];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: colors[i % 4] }}></div>
                  <div style={{ flex: 1, fontSize: '13px', fontWeight: '600', color: brand.text }}>{cat.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: '900', color: brand.sidebar }}>{formatVnd(cat.value)}</div>
                </div>
              );
            }) : (
              <p style={{ color: brand.muted, textAlign: 'center', fontSize: '13px' }}>Chưa có số liệu danh mục.</p>
            )}
          </div>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: brand.sidebar }}>Đơn hàng mới nhất</h3>
          <button style={{ color: brand.primary, background: 'none', border: 'none', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Xem tất cả <BarChart3 size={16} />
          </button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Mã đơn hàng</th>
              <th style={styles.th}>Khách hàng</th>
              <th style={styles.th}>Tổng cộng</th>
              <th style={styles.th}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recent_orders?.length > 0 ? stats.recent_orders.map(order => (
              <tr key={order.id}>
                <td style={styles.td}><span style={{ fontWeight: '900', color: brand.primary }}>#{order.order_code}</span></td>
                <td style={styles.td}>
                  <div style={{ fontWeight: '700' }}>{order.recipient_name}</div>
                  <div style={{ fontSize: '11px', color: brand.muted }}>{new Date(order.created_at).toLocaleTimeString('vi-VN')}</div>
                </td>
                <td style={styles.td}><strong style={{ fontSize: '15px' }}>{formatVnd(order.total_amount)}</strong></td>
                <td style={styles.td}><span style={styles.badge(order.status)}>{order.status?.toUpperCase()}</span></td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: brand.muted }}>Dữ liệu đơn hàng đang trống.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderList = () => (
    <div style={styles.tableWrapper}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ margin: 0, color: brand.sidebar, fontSize: '28px', fontWeight: '900' }}>Quản lý {activeMenu}</h2>
          <p style={{ color: brand.muted, fontSize: '14px', marginTop: '5px' }}>Chỉnh sửa, xóa và quản lý các {activeMenu.toLowerCase()} trong hệ thống.</p>
        </div>
        <button style={{ backgroundColor: brand.orange, color: 'white', border: 'none', padding: '15px 30px', borderRadius: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 20px rgba(218, 143, 72, 0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Package size={20} /> Thêm mới
        </button>
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
                    <td style={styles.td}><div style={{ display: 'flex', gap: '15px' }}><Edit3 size={20} color={brand.primary} style={{ cursor: 'pointer' }} /><Trash2 size={20} color={brand.danger} style={{ cursor: 'pointer' }} /></div></td>
                  </>
                )}
                {activeMenu === "Danh mục" && (
                  <>
                    <td style={styles.td}><span style={{ color: brand.muted }}>#{item.id}</span></td>
                    <td style={styles.td}><strong>{item.name}</strong></td>
                    <td style={styles.td}><code>{item.slug}</code></td>
                    <td style={styles.td}><div style={{ display: 'flex', gap: '15px' }}><Edit3 size={20} color={brand.primary} style={{ cursor: 'pointer' }} /><Trash2 size={20} color={brand.danger} style={{ cursor: 'pointer' }} /></div></td>
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

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '60px', flexShrink: 0 }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: brand.orange, borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, boxShadow: '0 8px 15px rgba(218, 143, 72, 0.2)' }}>
            <Package color="white" size={28} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1.5px', color: brand.white, lineHeight: 1 }}>HOMETIC</div>
            <div style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginTop: '4px' }}>DASHBOARD</div>
          </div>
        </div>

        <nav style={styles.navContainer}>
          <button style={styles.navButton(activeMenu === "Tổng quan")} onClick={() => setActiveMenu("Tổng quan")}>
            <LayoutDashboard size={22} /> <span>Tổng quan</span>
          </button>
          <button style={styles.navButton(activeMenu === "Sản phẩm")} onClick={() => setActiveMenu("Sản phẩm")}>
            <Package size={22} /> <span>Sản phẩm</span>
          </button>
          <button style={styles.navButton(activeMenu === "Danh mục")} onClick={() => setActiveMenu("Danh mục")}>
            <ListTree size={22} /> <span>Danh mục</span>
          </button>
          <button style={styles.navButton(activeMenu === "Đơn hàng")} onClick={() => setActiveMenu("Đơn hàng")}>
            <ShoppingCart size={22} /> <span>Đơn hàng</span>
          </button>
          <button style={styles.navButton(activeMenu === "Khách hàng")} onClick={() => setActiveMenu("Khách hàng")}>
            <Users size={22} /> <span>Khách hàng</span>
          </button>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '30px' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '15px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '14px', backgroundColor: brand.orange, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: '900' }}>H</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Hometic Master</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Quản trị viên</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ ...styles.navButton(false), color: brand.danger, padding: '12px 20px' }}>
            <LogOut size={20} /> <span>Đăng xuất hệ thống</span>
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexShrink: 0 }}>
          <div style={{ position: 'relative', width: '450px' }}>
            <Search size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: brand.muted }} />
            <input
              type="text"
              placeholder="Tìm kiếm nhanh đơn hàng, sản phẩm..."
              style={{ width: '100%', padding: '16px 20px 16px 55px', borderRadius: '22px', border: 'none', backgroundColor: 'white', outline: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', fontSize: '15px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={26} color={brand.sidebar} />
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', backgroundColor: brand.danger, borderRadius: '50%', border: '2px solid white' }}></div>
            </div>
            <div style={{ height: '30px', width: '1px', backgroundColor: brand.border }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: brand.sidebar }}>Hometic Store</div>
                <div style={{ fontSize: '11px', color: brand.muted }}>Online Status</div>
              </div>
              <div style={{ width: '45px', height: '45px', borderRadius: '15px', backgroundColor: brand.panel, display: 'flex', justifyContent: 'center', alignItems: 'center', border: `1px solid ${brand.border}` }}>
                <User size={24} color={brand.sidebar} />
              </div>
            </div>
          </div>
        </header>

        {activeMenu === "Tổng quan" ? renderDashboard() : renderList()}
      </main>
    </div>
  );
}
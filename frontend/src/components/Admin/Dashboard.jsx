import React, { useState, useEffect } from "react";
import { CreditCard, ShoppingCart, Users, BarChart3, Clock, ArrowUpRight } from "lucide-react";
import { brand, adminStyles as styles } from "./AdminStyles";
import { formatVnd } from "../../constants";

export default function Dashboard({ stats, chartData, setActiveMenu }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [isPhone, setIsPhone] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      setIsPhone(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getOrderStatus = (status) => {
    switch (status) {
      case 'pending': return { bg: '#fff7ed', text: '#c2410c', label: 'Chờ xử lý' };
      case 'processing': return { bg: '#eff6ff', text: '#1d4ed8', label: 'Đang chuẩn bị' };
      case 'shipped': return { bg: '#f5f3ff', text: '#6d28d9', label: 'Đang giao' };
      case 'delivered': return { bg: '#f0fdf4', text: '#15803d', label: 'Đã giao' };
      case 'cancelled': return { bg: '#fef2f2', text: '#b91c1c', label: 'Đã hủy' };
      default: return { bg: '#f4f4f5', text: '#71717a', label: status };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: brand.sidebar, margin: 0 }}>Tổng quan hệ thống</h1>
          <p style={{ color: brand.muted, marginTop: '8px', fontSize: '15px' }}>Dữ liệu kinh doanh thời gian thực của Hometic.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isPhone ? '1fr' : isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: isPhone ? '15px' : '30px' }}>
        <div style={{ ...styles.statsCard, border: `1px solid ${brand.border}` }}>
          <div>
            <div style={{ color: brand.muted, fontSize: '12px', fontWeight: '800', letterSpacing: '1px' }}>TỔNG DOANH THU</div>
            <div style={{ fontSize: '28px', fontWeight: '900', marginTop: '12px', color: brand.primary }}>{formatVnd(stats?.total_revenue || 0)}</div>
          </div>
          <div style={{ padding: '15px', borderRadius: '18px', backgroundColor: `${brand.primary}10`, color: brand.primary }}>
            <CreditCard size={32} />
          </div>
        </div>

        <div style={{ ...styles.statsCard, border: `1px solid ${brand.border}` }}>
          <div>
            <div style={{ color: brand.muted, fontSize: '12px', fontWeight: '800', letterSpacing: '1px' }}>ĐƠN HÀNG MỚI</div>
            <div style={{ fontSize: '32px', fontWeight: '900', marginTop: '12px', color: brand.orange }}>{stats?.total_orders || 0}</div>
          </div>
          <div style={{ padding: '15px', borderRadius: '18px', backgroundColor: `${brand.orange}15`, color: brand.orange }}>
            <ShoppingCart size={32} />
          </div>
        </div>

        <div style={{ ...styles.statsCard, border: `1px solid ${brand.border}` }}>
          <div>
            <div style={{ color: brand.muted, fontSize: '12px', fontWeight: '800', letterSpacing: '1px' }}>KHÁCH HÀNG MỚI</div>
            <div style={{ fontSize: '32px', fontWeight: '900', marginTop: '12px', color: brand.sidebar }}>{stats?.total_customers || 0}</div>
          </div>
          <div style={{ padding: '15px', borderRadius: '18px', backgroundColor: `${brand.sidebar}10`, color: brand.sidebar }}>
            <Users size={32} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: '30px' }}>
        <div style={{ ...styles.card, borderRadius: '24px', border: `1px solid ${brand.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: brand.sidebar, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart3 size={20} color={brand.orange} /> Biến động doanh thu (30 ngày)
            </h3>
            <span style={{ fontSize: '12px', fontWeight: '800', color: brand.muted, backgroundColor: brand.bg, padding: '4px 12px', borderRadius: '8px' }}>VNĐ</span>
          </div>

          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '10px', position: 'relative' }}>
            {[0, 25, 50, 75, 100].map(val => (
              <div key={val} style={{ position: 'absolute', bottom: `${val}%`, left: 0, right: 0, borderBottom: `1px dashed ${brand.border}`, zIndex: 0 }}></div>
            ))}

            {chartData?.revenue_by_day?.length > 0 ? chartData.revenue_by_day.map((point, i) => {
              const maxVal = Math.max(...chartData.revenue_by_day.map(p => p.value)) || 1;
              const height = (point.value / maxVal) * 100;
              return (
                <div key={i} className="bar-container" style={{ flex: 1, position: 'relative', zIndex: 1, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  {/* Tooltip hiển thị khi hover */}
                  <div className="custom-tooltip">
                    <div style={{ fontWeight: '800' }}>{formatVnd(point.value)}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>{point.label}</div>
                  </div>

                  <div
                    className="revenue-bar"
                    style={{
                      width: '100%', maxWidth: '30px', height: `${Math.max(height, 5)}%`,
                      background: `linear-gradient(to top, ${brand.primary}, ${brand.primary}aa)`,
                      borderRadius: '6px 6px 2px 2px', cursor: 'pointer', transition: '0.3s'
                    }}
                  ></div>
                </div>
              );
            }) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: brand.muted }}>Chưa có dữ liệu biểu đồ.</div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', color: brand.muted, fontSize: '11px', fontWeight: '800' }}>
            <span>ĐẦU THÁNG</span>
            <span>GIỮA THÁNG</span>
            <span>HÔM NAY</span>
          </div>
        </div>

        {/* Category Allocation (Giữ nguyên) */}
        <div style={{ ...styles.card, borderRadius: '24px', border: `1px solid ${brand.border}` }}>
          <h3 style={{ margin: '0 0 30px 0', fontSize: '18px', fontWeight: '900', color: brand.sidebar }}>Phân bổ danh mục</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '200px', height: '200px', borderRadius: '50%',
              background: `conic-gradient(${brand.primary} 0% 40%, ${brand.orange} 40% 70%, ${brand.sidebar} 70% 90%, #e2e8f0 90% 100%)`,
              position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
              <div style={{ width: '130px', height: '130px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '11px', fontWeight: '900', color: brand.muted }}>TOTAL</div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: brand.primary }}>100%</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {chartData?.revenue_by_category?.length > 0 ? chartData.revenue_by_category.slice(0, 4).map((cat, i) => {
              const colors = [brand.primary, brand.orange, brand.sidebar, '#94a3b8'];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '12px', backgroundColor: brand.bg }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: colors[i % 4] }}></div>
                  <div style={{ flex: 1, fontSize: '13px', fontWeight: '700', color: brand.primary }}>{cat.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: '900', color: brand.sidebar }}>{formatVnd(cat.value)}</div>
                </div>
              );
            }) : (
              <p style={{ color: brand.muted, textAlign: 'center', fontSize: '13px' }}>Chưa có số liệu.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ ...styles.tableWrapper, border: `1px solid ${brand.border}`, padding: isPhone ? '20px' : '35px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: isPhone ? 'column' : 'row', justifyContent: 'space-between', alignItems: isPhone ? 'flex-start' : 'center', gap: '15px', marginBottom: '30px' }}>
          <h3 style={{ margin: 0, fontSize: isPhone ? '18px' : '20px', fontWeight: '900', color: brand.sidebar }}>Đơn hàng mới nhất</h3>
          <button
            onClick={() => setActiveMenu("Đơn hàng")}
            style={{ color: brand.primary, background: brand.bg, border: `1px solid ${brand.border}`, padding: '8px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', width: isPhone ? '100%' : 'auto', justifyContent: 'center' }}
          >
            Tất cả đơn hàng <ArrowUpRight size={16} />
          </button>
        </div>
        <div style={{ width: '100%' }}>
          {!isPhone ? (
            <table style={{ ...styles.table, minWidth: isMobile ? '600px' : 'auto' }}>
              <thead>
                <tr>
                  <th style={styles.th}>Mã đơn hàng</th>
                  <th style={styles.th}>Khách hàng</th>
                  <th style={styles.th}>Tổng tiền</th>
                  <th style={styles.th}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent_orders?.length > 0 ? stats.recent_orders.map(order => {
                  const status = getOrderStatus(order.status);
                  return (
                    <tr key={order.id} className="admin-tr" style={{ cursor: 'pointer' }} onClick={() => setActiveMenu("Đơn hàng")}>
                      <td style={styles.td}>
                        <div style={{ backgroundColor: brand.primary + '10', padding: '6px 12px', borderRadius: '8px', display: 'inline-block', color: brand.primary, fontWeight: '800', fontSize: '13px' }}>
                          #{order.order_code}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '700', color: brand.sidebar }}>{order.recipient_name}</div>
                        <div style={{ fontSize: '11px', color: brand.muted }}><Clock size={10} style={{ marginRight: '4px' }} /> {new Date(order.created_at).toLocaleTimeString('vi-VN')}</div>
                      </td>
                      <td style={styles.td}><strong style={{ fontSize: '15px', color: brand.orange }}>{formatVnd(order.total_amount)}</strong></td>
                      <td style={styles.td}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                          backgroundColor: status.bg, color: status.text, border: `1px solid ${status.text}20`
                        }}>
                          {status.label?.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '60px', color: brand.muted }}>Chưa có đơn hàng mới nào.</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            /* Card layout for mobile admin dashboard */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {stats?.recent_orders?.length > 0 ? stats.recent_orders.map(order => {
                const status = getOrderStatus(order.status);
                return (
                  <div 
                    key={order.id} 
                    onClick={() => setActiveMenu("Đơn hàng")}
                    style={{ 
                      padding: '15px', 
                      borderRadius: '16px', 
                      border: `1px solid ${brand.border}`,
                      backgroundColor: brand.white,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ backgroundColor: brand.primary + '10', padding: '4px 10px', borderRadius: '6px', color: brand.primary, fontWeight: '800', fontSize: '12px' }}>
                        #{order.order_code}
                      </div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800',
                        backgroundColor: status.bg, color: status.text, border: `1px solid ${status.text}20`
                      }}>
                        {status.label?.toUpperCase()}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ fontWeight: '700', color: brand.sidebar, fontSize: '14px' }}>{order.recipient_name}</div>
                        <div style={{ fontSize: '11px', color: brand.muted, marginTop: '2px' }}>
                          <Clock size={10} style={{ marginRight: '4px' }} /> {new Date(order.created_at).toLocaleTimeString('vi-VN')}
                        </div>
                      </div>
                      <strong style={{ fontSize: '16px', color: brand.orange }}>{formatVnd(order.total_amount)}</strong>
                    </div>
                  </div>
                )
              }) : (
                <div style={{ textAlign: 'center', padding: '40px', color: brand.muted }}>Chưa có đơn hàng mới nào.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .bar-container {
          position: relative;
        }

        .custom-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-10px);
          background-color: ${brand.primary};
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: 0.3s;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          z-index: 10;
        }

        .custom-tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: ${brand.primary} transparent transparent transparent;
        }

        .bar-container:hover .custom-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(-5px);
        }

        .revenue-bar:hover { 
          filter: brightness(1.2); 
          transform: scaleX(1.1); 
        }

        .admin-tr:hover { 
          background-color: #fcfaf6 !important; 
        }
      `}</style>
    </div>
  );
}
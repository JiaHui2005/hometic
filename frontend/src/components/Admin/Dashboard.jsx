import React from "react";
import { CreditCard, ShoppingCart, Users, BarChart3 } from "lucide-react";
import { brand, adminStyles as styles } from "./AdminStyles";
import { formatVnd } from "../../constants";

export default function Dashboard({ stats, chartData }) {
  return (
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
                      height: `${Math.max(height, 5)}%`,
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
              width: '180px', height: '180px', borderRadius: '50%',
              background: `conic-gradient(${brand.primary} 0% 40%, ${brand.orange} 40% 70%, ${brand.accent} 70% 90%, #eee 90% 100%)`,
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.05)',
              position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'
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
}

import React from "react";
import { formatVnd } from "../../utils/format";
import { StatusBadge } from "../common";

export default function Dashboard({ stats, chartData, setActiveMenu }) {
  const revenue = stats?.total_revenue || 0;
  const orderCount = stats?.total_orders || 0;
  const avgOrder = orderCount ? revenue / orderCount : 0;

  const days = chartData?.revenue_by_day || [];
  const maxDay = Math.max(...days.map(p => p.value), 1);
  const peakIndex = days.findIndex(p => p.value === maxDay);
  // Chỉ in nhãn ngày thưa ra để không chồng chữ
  const labelEvery = Math.max(1, Math.ceil(days.length / 6));

  const categories = (chartData?.revenue_by_category || []).slice(0, 5);
  const maxCat = Math.max(...categories.map(c => c.value), 1);

  const statCards = [
    ["Doanh thu", formatVnd(revenue), true],
    ["Đơn hàng", orderCount],
    ["Khách hàng", stats?.total_customers || 0],
    ["Giá trị đơn trung bình", formatVnd(avgOrder)],
  ];

  return (
    <>
      <div className="stat-grid">
        {statCards.map(([label, value, feature]) => (
          <div key={label} className={`stat${feature ? " stat--feature" : ""}`}>
            <div className="stat__label">{label}</div>
            <div className="stat__value">{value}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <section className="panel">
          <div className="panel__head">
            <div>
              <h2>Doanh thu theo ngày</h2>
              <p>30 ngày gần nhất, đơn vị VNĐ</p>
            </div>
          </div>
          {days.length > 0 ? (
            <div className="bar-chart" role="img" aria-label="Biểu đồ doanh thu theo ngày">
              {days.map((point, i) => (
                <div key={i} className={`bar-chart__col${i === peakIndex ? " is-peak" : ""}`}>
                  <div
                    className="bar-chart__bar"
                    style={{ height: `${Math.max((point.value / maxDay) * 100, 2)}%`, animationDelay: `${i * 18}ms` }}
                  >
                    <span className="bar-chart__tip">{point.label}: {formatVnd(point.value)}</span>
                  </div>
                  <span className="bar-chart__label">{i % labelEvery === 0 ? point.label : " "}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"><p>Chưa có dữ liệu doanh thu.</p></div>
          )}
        </section>

        <section className="panel">
          <div className="panel__head">
            <div>
              <h2>Doanh thu theo danh mục</h2>
              <p>5 danh mục cao nhất</p>
            </div>
          </div>
          {categories.length > 0 ? (
            <ul className="hbar-list">
              {categories.map((cat) => (
                <li key={cat.label} title={formatVnd(cat.value)}>
                  <div className="hbar-list__row">
                    <span>{cat.label}</span>
                    <strong>{formatVnd(cat.value)}</strong>
                  </div>
                  <div className="hbar-list__track">
                    <div className="hbar-list__fill" style={{ width: `${(cat.value / maxCat) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state"><p>Chưa có số liệu.</p></div>
          )}
        </section>
      </div>

      <section className="panel">
        <div className="panel__head">
          <h2>Đơn hàng mới nhất</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => setActiveMenu("Đơn hàng")}>
            Xem tất cả đơn
          </button>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th className="hide-sm">Thời gian</th>
                <th style={{ textAlign: "right" }}>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent_orders?.length > 0 ? stats.recent_orders.map(order => (
                <tr key={order.id} style={{ cursor: "pointer" }} onClick={() => setActiveMenu("Đơn hàng")}>
                  <td><strong>#{order.order_code}</strong></td>
                  <td>{order.recipient_name}</td>
                  <td className="muted hide-sm">{new Date(order.created_at).toLocaleString("vi-VN")}</td>
                  <td className="price" style={{ textAlign: "right" }}>{formatVnd(order.total_amount)}</td>
                  <td><StatusBadge status={order.status} /></td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="muted" style={{ textAlign: "center", padding: 48 }}>Chưa có đơn hàng mới.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

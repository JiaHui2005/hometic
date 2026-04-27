import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { formatVnd } from "../constants";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => { 
    api("/orders/me").then(setOrders).catch(() => setOrders([])); 
  }, []);
  
  return (
    <main>
      <h2>Lịch sử đơn hàng</h2>
      <div className="table-list">
        {orders.map((order) => (
          <article className="order-row" key={order.id}>
            <strong>#{order.id} - {order.status}</strong>
            <span>{order.address}</span>
            <b>{formatVnd(order.total_amount)}</b>
          </article>
        ))}
      </div>
    </main>
  );
}

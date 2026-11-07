import React from "react";
import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";

// Trạng thái đơn hàng — khớp enum OrderStatus ở backend
export const ORDER_STATUS = {
  pending: { label: "Chờ xử lý", tone: "warning", Icon: Clock },
  processing: { label: "Đang chuẩn bị", tone: "info", Icon: Package },
  shipped: { label: "Đang giao", tone: "neutral", Icon: Truck },
  delivered: { label: "Đã giao", tone: "success", Icon: CheckCircle },
  cancelled: { label: "Đã huỷ", tone: "danger", Icon: XCircle },
};

export default function StatusBadge({ status }) {
  const config = ORDER_STATUS[status] || { label: status, tone: "neutral", Icon: Clock };
  const { Icon } = config;
  return (
    <span className={`tag tag-${config.tone}`}>
      <Icon size={13} />
      {config.label}
    </span>
  );
}

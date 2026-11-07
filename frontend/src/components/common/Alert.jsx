import React, { useEffect } from "react";
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from "lucide-react";

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export default function Alert({ type = "info", title, message, onClose, autoClose = 5000 }) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const Icon = ICONS[type] || Info;

  return (
    <div className={`toast toast--${type}`} role={type === "error" ? "alert" : "status"}>
      <Icon className="toast__icon" size={20} />
      <div className="toast__body">
        {title && <p className="toast__title">{title}</p>}
        {message && <p className="toast__message">{message}</p>}
      </div>
      <button className="toast__close" onClick={onClose} aria-label="Đóng thông báo">
        <X size={16} />
      </button>
      {autoClose && <span className="toast__progress" style={{ animationDuration: `${autoClose}ms` }} />}
    </div>
  );
}

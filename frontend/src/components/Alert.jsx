import React, { useEffect } from "react";
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from "lucide-react";

export default function Alert({ id, type = "info", title, message, onClose, autoClose = 5000 }) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const typeConfig = {
    success: {
      bg: "#dcfce7",
      border: "#86efac",
      icon: <CheckCircle size={20} color="#16a34a" strokeWidth={2.5} />,
      textColor: "#166534",
      iconBg: "#f0fdf4"
    },
    error: {
      bg: "#fee2e2",
      border: "#fca5a5",
      icon: <AlertCircle size={20} color="#dc2626" strokeWidth={2.5} />,
      textColor: "#7f1d1d",
      iconBg: "#fef2f2"
    },
    warning: {
      bg: "#fef3c7",
      border: "#fcd34d",
      icon: <AlertTriangle size={20} color="#d97706" strokeWidth={2.5} />,
      textColor: "#78350f",
      iconBg: "#fffbeb"
    },
    info: {
      bg: "#dbeafe",
      border: "#93c5fd",
      icon: <Info size={20} color="#2563eb" strokeWidth={2.5} />,
      textColor: "#1e40af",
      iconBg: "#f0f9ff"
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  const styles = {
    container: {
      position: "fixed",
      top: "100px",
      right: "20px",
      maxWidth: "380px",
      backgroundColor: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: "12px",
      padding: "16px 20px",
      display: "flex",
      gap: "12px",
      alignItems: "flex-start",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      zIndex: 9999,
      animation: "slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fontFamily: '"Inter", sans-serif'
    },
    iconBox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      width: "40px",
      height: "40px",
      backgroundColor: config.iconBg,
      borderRadius: "8px"
    },
    contentBox: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    },
    title: {
      fontSize: "15px",
      fontWeight: "700",
      color: config.textColor,
      margin: 0
    },
    message: {
      fontSize: "13px",
      color: config.textColor,
      margin: 0,
      opacity: 0.85,
      lineHeight: "1.4"
    },
    closeBtn: {
      background: "none",
      border: "none",
      padding: "0",
      cursor: "pointer",
      color: config.textColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.6,
      transition: "opacity 0.2s",
      flexShrink: 0
    },
    progressBar: {
      position: "absolute",
      bottom: "0",
      left: "0",
      height: "3px",
      backgroundColor: config.border,
      borderRadius: "0 0 12px 12px",
      animation: `progress ${autoClose}ms linear`
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
      <div style={styles.container}>
        <div style={styles.iconBox}>{config.icon}</div>
        <div style={styles.contentBox}>
          {title && <h4 style={styles.title}>{title}</h4>}
          {message && <p style={styles.message}>{message}</p>}
        </div>
        <button style={styles.closeBtn} onClick={onClose}>
          <X size={18} />
        </button>
        {autoClose && <div style={styles.progressBar}></div>}
      </div>
    </>
  );
}

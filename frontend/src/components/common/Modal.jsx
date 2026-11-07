import React, { useEffect } from "react";
import { X } from "lucide-react";
import "./Modal.css";

// Hộp thoại dùng chung: nền mờ, đóng bằng Esc / click ra ngoài / nút X
export default function Modal({ open, onClose, title, icon, size = "md", children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={`modal modal--${size}`} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined}>
        <header className="modal__head">
          {icon && <span className="modal__icon">{icon}</span>}
          <h2 className="modal__title">{title}</h2>
          <button type="button" className="icon-btn icon-btn-sm modal__close" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__foot">{footer}</footer>}
      </div>
    </div>
  );
}

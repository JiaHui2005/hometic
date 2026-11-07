import React from "react";
import { LayoutDashboard, Package, ListTree, ShoppingCart, Users, LogOut, X } from "lucide-react";

const MENU = [
  ["Tổng quan", LayoutDashboard],
  ["Sản phẩm", Package],
  ["Danh mục", ListTree],
  ["Đơn hàng", ShoppingCart],
  ["Khách hàng", Users],
];

export default function Sidebar({ activeMenu, setActiveMenu, onLogout, isOpen, onClose }) {
  return (
    <>
      <div className={`admin-backdrop${isOpen ? " is-open" : ""}`} onClick={onClose} aria-hidden="true" />
      <aside className={`admin-sidebar${isOpen ? " is-open" : ""}`}>
        <div className="admin-sidebar__brand">
          <img src="/logo1.png" alt="" />
          <div>
            <strong>Hometic</strong>
            <span>Quản trị cửa hàng</span>
          </div>
          <button className="icon-btn icon-btn-sm admin-sidebar__close" onClick={onClose} aria-label="Đóng menu">
            <X size={18} />
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {MENU.map(([label, Icon]) => (
            <button
              key={label}
              className={activeMenu === label ? "is-active" : ""}
              aria-current={activeMenu === label ? "page" : undefined}
              onClick={() => setActiveMenu(label)}
            >
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar__foot">
          <div className="admin-sidebar__user">
            <span className="admin-sidebar__avatar">H</span>
            <div>
              <strong>Hometic Master</strong>
              <span>Quản trị viên</span>
            </div>
          </div>
          <button className="admin-sidebar__logout" onClick={onLogout}>
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}

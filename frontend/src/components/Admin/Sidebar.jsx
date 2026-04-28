import React from "react";
import { LayoutDashboard, Package, ListTree, ShoppingCart, Users, LogOut } from "lucide-react";
import { brand, adminStyles as styles } from "./AdminStyles";

export default function Sidebar({ activeMenu, setActiveMenu, onLogout }) {
  return (
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
  );
}

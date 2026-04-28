import React from "react";
import { Search, User } from "lucide-react";
import { brand } from "./AdminStyles";

export default function Header() {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexShrink: 0 }}>
      <div style={{ position: 'relative', width: '450px' }}>
        <Search size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: brand.muted }} />
        <input
          type="text"
          placeholder="Tìm kiếm nhanh đơn hàng, sản phẩm..."
          style={{ width: '100%', padding: '16px 20px 16px 55px', borderRadius: '22px', border: 'none', backgroundColor: 'white', outline: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', fontSize: '15px' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <div style={{ height: '30px', width: '1px', backgroundColor: brand.border }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: brand.sidebar }}>Hometic Store</div>
            <div style={{ fontSize: '11px', color: brand.muted }}>Online Status</div>
          </div>
          <div style={{ width: '45px', height: '45px', borderRadius: '15px', backgroundColor: brand.panel, display: 'flex', justifyContent: 'center', alignItems: 'center', border: `1px solid ${brand.border}` }}>
            <User size={24} color={brand.sidebar} />
          </div>
        </div>
      </div>
    </header>
  );
}

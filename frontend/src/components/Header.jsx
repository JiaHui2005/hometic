import React from "react";
import { LogOut, Search, ShoppingCart } from "lucide-react";

const megaMenus = {
  kitchen: [
    ["Thiết bị nhà bếp", "Nồi cơm điện", "Bếp từ", "Máy chiên"],
    ["Dụng cụ làm bếp", "Bộ nồi", "Chảo chống dính", "Dao"],
    ["Đồ uống ăn uống", "Bát đĩa", "Bộ dao nĩa", "Ly thủy tinh"],
    ["Bảo quản thực phẩm", "Tủ lạnh", "Hộp đựng thực phẩm", "Màng bọc"],
  ],
  living: [
    ["Âm thanh", "Loa kéo", "Dàn âm thanh", "Micro"],
    ["Trang trí phòng ở", "Đồng hồ treo tường", "Khung treo tranh", "Tranh ảnh"],
    ["Đồ dùng tiện ích", "Kệ đồ", "Bộ bàn ăn", "Tủ giày"],
  ],
  bedroom: [
    ["Chăn ga gối", "Ga giường & vỏ gối", "Chăn & ruột chăn", "Gối ôm"],
    ["Lưu trữ & Tổ chức", "Tủ quần áo mini", "Hộp lưu trữ", "Móc treo quần áo"],
    ["Trang trí, ánh sáng", "Đèn ngủ", "Rèm chống nắng", "Thảm"],
  ],
  homecare: [
    ["Dụng cụ vệ sinh", "Máy hút bụi", "Máy lau nhà thông minh", "Bàn chải điện"],
    ["Phòng tắm", "Kệ nhà tắm", "Tinh dầu", "Sồ đựng khăn"],
    ["Giặt giũ", "Máy giặt mini", "Bàn ủi", "Giàn phơi đồ"],
  ],
  utilities: [
    ["Thiết bị điện", "Ổ cắm điện", "Bóng LED", "Đèn pin"],
    ["Vệ sinh & Chăm sóc", "Máy sấy tóc", "Bàn ủi hơi", "Các sản phẩm chăm sóc"],
    ["Sức khỏe & An toàn", "Máy đo nhiệt độ", "Cân điện tử", "Thiết bị báo cháy mini"],
  ],
};

export default function Header({ user, cartCount, activeTab, setActiveTab, onLogout, filters, setFilters }) {
  const navItems = [
    ["shop", "Nhà bếp", "kitchen"],
    ["shop", "Phòng khách", "living"],
    ["shop", "Phòng ngủ", "bedroom"],
    ["shop", "Nhà cửa & Đời sống", "homecare"],
    ["shop", "Tiện ích đa dụng", "utilities"],
  ];

  return (
    <header className="site-header">
      <div className="brand" onClick={() => setActiveTab("shop")}>
        <div className="brand-mark">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 5L5 18V35H35V18L20 5Z" fill="#008481" />
            <path d="M12 22H28V30H12V22Z" fill="#ed7f1a" />
          </svg>
        </div>
        <strong>Hometic</strong>
      </div>
      
      <nav>
        {navItems.map(([id, label, menuKey]) => (
          <div className="nav-item" key={label}>
            <button className={activeTab === "category_detail" && label === "Nhà bếp" ? "active" : ""} onClick={() => setActiveTab("category_detail")}>
              {label}
            </button>
            <div className="mega-menu">
              {megaMenus[menuKey].map((column) => (
                <div key={column[0]}>
                  <h4>{column[0]}</h4>
                  {column.slice(1).map((item) => <span key={item} onClick={() => setActiveTab("category_detail")}>{item}</span>)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="header-actions-container">
        <div className="top-auth-links">
          {user ? (
            <span onClick={onLogout}>{user.full_name.split(' ').pop()} | Thoát</span>
          ) : (
            <span onClick={() => setActiveTab("auth")}>Đăng nhập | Đăng ký</span>
          )}
        </div>
        <div className="header-actions">
          <div className="header-search">
            <Search size={16} color="var(--text-muted)" />
            <input
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              placeholder="Bạn đang muốn tìm kiếm gì?"
            />
          </div>
          <button className="icon-button" title="Giỏ hàng" onClick={() => setActiveTab("cart")}>
            <ShoppingCart size={24} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

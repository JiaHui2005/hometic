import React from "react";
import { Menu, Search } from "lucide-react";

const SUBTITLES = {
  "Tổng quan": "Tình hình kinh doanh của cửa hàng hôm nay",
  "Sản phẩm": "Thêm, sửa và quản lý tồn kho sản phẩm",
  "Danh mục": "Sắp xếp sản phẩm theo nhóm",
  "Đơn hàng": "Theo dõi và cập nhật trạng thái đơn",
  "Khách hàng": "Danh sách tài khoản và lịch sử mua hàng",
  "Mã giảm giá": "Tạo mã khuyến mãi và theo dõi lượt dùng",
};

export default function AdminHeader({ title, searchQuery, setSearchQuery, showSearch, onToggleSidebar }) {
  return (
    <header className="admin-header">
      <button className="icon-btn admin-header__menu" onClick={onToggleSidebar} aria-label="Mở menu">
        <Menu size={22} />
      </button>

      <div className="admin-header__title">
        <h1>{title}</h1>
        <p>{SUBTITLES[title]}</p>
      </div>

      {showSearch && (
        <div className="input-group admin-header__search">
          <Search size={17} />
          <input
            className="input"
            type="search"
            placeholder={`Tìm trong ${title.toLowerCase()}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}
    </header>
  );
}

import React from "react";

export default function Footer() {
  return (
    <footer className="home-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="brand">
            <div className="brand-mark">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5L5 18V35H35V18L20 5Z" fill="#008481" />
                <path d="M12 22H28V30H12V22Z" fill="#ed7f1a" />
              </svg>
            </div>
            <strong>Hometic</strong>
          </div>
        </div>
        <div>
          <h4>Về Hometic</h4>
          <span>Hometic</span>
          <span>Thông báo</span>
          <span>Câu hỏi thường gặp</span>
        </div>
        <div>
          <h4>Chính sách bán lẻ</h4>
          <span>Chính sách đổi trả</span>
          <span>Danh sách cửa hàng</span>
        </div>
        <div>
          <h4>Cửa hàng trực tuyến</h4>
          <span>Chính sách bán hàng</span>
          <span>Chính sách giao hàng</span>
          <span>Chính sách bảo hành</span>
        </div>
        <div className="footer-newsletter">
          <p>Đăng ký nhận bản tin từ Hometic</p>
          <div className="newsletter-box">
            <input placeholder="Nhập email" />
            <button className="btn-newsletter">Đăng ký</button>
          </div>
        </div>
      </div>
      <div className="footer-company-info">
        <p>CÔNG TY TNHH HOMETIC RETAIL (VIỆT NAM)</p>
        <p>Trụ sở chính: Phòng số 09-00, Tầng 9, Tòa nhà số 9-11, đường Tôn Đức Thắng, Phường Sài Gòn, Thành phố Hồ Chí Minh, Việt Nam</p>
        <p>Liên hệ trụ sở: 028 7108 8388</p>
        <p>Thời gian làm việc: Thứ 2 - Thứ 6, Từ 08:00 sáng - 05:00 chiều</p>
        <p>Chăm sóc khách hàng tại các cửa hàng: <a href="https://www.hometic.com.vn/vn/page/store-location">https://www.hometic.com.vn/vn/page/store-location</a></p>
        <p>Chăm sóc khách hàng thương mại điện tử: 1900 2555 79; Email: <a href="mailto:ec.sale@muji.vn">ec.sale@muji.vn</a></p>
      </div>
    </footer>
  );
}

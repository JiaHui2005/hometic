import React from "react";
import { useStore } from "../../context/StoreContext";
import "./Footer.css";

const LINK_GROUPS = [
  {
    title: "Về Hometic",
    links: [["about", "Câu chuyện Hometic"], ["news", "Thông báo mới nhất"], ["faq", "Câu hỏi thường gặp"]],
  },
  {
    title: "Hỗ trợ khách hàng",
    links: [["returns", "Chính sách đổi trả"], ["stores", "Danh sách cửa hàng"], ["guide", "Hướng dẫn mua hàng"]],
  },
  {
    title: "Dịch vụ trực tuyến",
    links: [["retail", "Chính sách bán lẻ"], ["delivery", "Giao hàng & Lắp đặt"], ["warranty", "Trung tâm bảo hành"]],
  },
];

export default function Footer() {
  const { go, openStaticPage: handlePageClick } = useStore();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <button className="site-footer__logo" onClick={() => go("shop")} aria-label="Về trang chủ Hometic">
              <img src="/logo1.png" alt="" />
              <span>Hometic</span>
            </button>
            <p>Nâng tầm không gian sống thông minh cho ngôi nhà Việt.</p>
            <div className="site-footer__social">
              <a
                href="https://www.facebook.com/poposervicecompanylimited"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook POPO Services"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54v-2.9h2.54V9.82c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-0.45 2.9h-2.33v7a10 10 0 008.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                </svg>
              </a>
              <a href="https://pewpew.company" target="_blank" rel="noopener noreferrer" aria-label="Website PewPew">
                <img src="/pewpew_logo.png" alt="" />
              </a>
            </div>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title} className="site-footer__col">
              <h4>{group.title}</h4>
              {group.links.map(([key, label]) => (
                <button key={key} onClick={() => handlePageClick(key)}>{label}</button>
              ))}
            </div>
          ))}
        </div>

        <div className="site-footer__bottom">
          <p>
            <strong>Công ty TNHH Hometic Retail (Việt Nam)</strong>
            <span>Quận 7, TP. Hồ Chí Minh</span>
          </p>
          <p>
            <span>CSKH <a href="tel:1900255579">035 258 2180</a></span>
            <span>Văn phòng <a href="tel:02871088388">035 258 2180</a></span>
            <span>© 2026 Hometic</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

import React, { useState, useEffect } from "react";

export default function Footer({ setActiveTab, setStaticPage }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handlePageClick = (key) => {
    setStaticPage(key);
    setActiveTab("static_page");
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const brand = {
    primary: "#008481",
    secondary: "#ed7f1a",
    bg: "#9bc9c7",
    text: "#073b3b",
    border: "#6ca5a2"
  };

  const styles = {
    footer: {
      background: brand.bg,
      padding: isMobile ? '40px 20px' : '60px 40px 30px',
      width: '100%',
      color: brand.text,
      fontFamily: '"Inter", sans-serif'
    },
    content: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr 1fr 1fr 2fr',
      gap: isMobile ? '30px' : '40px',
      marginBottom: '40px'
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px'
    },
    logoText: {
      fontSize: '24px',
      fontWeight: '800',
      margin: 0
    },
    heading: {
      fontSize: '15px',
      fontWeight: '800',
      marginBottom: '15px',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    link: {
      display: 'block',
      fontSize: '13px',
      marginBottom: '10px',
      cursor: 'pointer',
      opacity: 0.8
    },
    newsletter: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    newsletterBox: {
      display: 'flex',
      background: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      border: `1px solid ${brand.border}`
    },
    input: {
      flex: 1,
      border: 'none',
      padding: '12px 15px',
      fontSize: '14px',
      outline: 'none'
    },
    btn: {
      background: brand.primary,
      color: 'white',
      border: 'none',
      padding: '0 20px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer'
    },
    companyInfo: {
      borderTop: `1px solid ${brand.border}`,
      paddingTop: '30px',
      fontSize: '12px',
      lineHeight: '1.8',
      opacity: 0.7
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={styles.brand}>
            <svg width="35" height="35" viewBox="0 0 40 40" fill="none">
              <path d="M20 5L5 18V35H35V18L20 5Z" fill={brand.primary} />
              <path d="M12 22H28V30H12V22Z" fill={brand.secondary} />
            </svg>
            <h2 style={styles.logoText}>Hometic</h2>
          </div>
          <p style={{ fontSize: '13px', opacity: 0.8 }}>Nâng tầm không gian sống thông minh cho ngôi nhà Việt.</p>
        </div>

        <div>
          <h4 style={styles.heading}>Về Hometic</h4>
          <span style={styles.link} onClick={() => handlePageClick("about")}>Câu chuyện Hometic</span>
          <span style={styles.link} onClick={() => handlePageClick("news")}>Thông báo mới nhất</span>
          <span style={styles.link} onClick={() => handlePageClick("faq")}>Câu hỏi thường gặp</span>
        </div>

        <div>
          <h4 style={styles.heading}>Hỗ trợ khách hàng</h4>
          <span style={styles.link} onClick={() => handlePageClick("returns")}>Chính sách đổi trả</span>
          <span style={styles.link} onClick={() => handlePageClick("stores")}>Danh sách cửa hàng</span>
          <span style={styles.link} onClick={() => handlePageClick("guide")}>Hướng dẫn mua hàng</span>
        </div>

        <div>
          <h4 style={styles.heading}>Dịch vụ trực tuyến</h4>
          <span style={styles.link} onClick={() => handlePageClick("retail")}>Chính sách bán lẻ</span>
          <span style={styles.link} onClick={() => handlePageClick("delivery")}>Giao hàng & Lắp đặt</span>
          <span style={styles.link} onClick={() => handlePageClick("warranty")}>Trung tâm bảo hành</span>
        </div>

        <div style={{ ...styles.newsletter, gap: '20px' }}>
          <p style={{ fontWeight: '800', margin: 0, textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>Kết nối với chúng tôi</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            {/* Facebook POPO Services */}
            <a 
              href="https://www.facebook.com/poposervicecompanylimited" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', transition: 'transform 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill={brand.primary}>
                <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54v-2.9h2.54V9.82c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-0.45 2.9h-2.33v7a10 10 0 008.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
              </svg>
            </a>

            {/* PewPew Website */}
            <a 
              href="https://pewpew.company" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', transition: 'transform 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src="/pewpew_logo.png" 
                alt="PewPew Website" 
                style={{ height: '40px', width: 'auto', borderRadius: '8px' }} 
              />
            </a>
          </div>
        </div>
      </div>

      <div style={styles.companyInfo}>
        <p style={{ fontWeight: '700' }}>CÔNG TY TNHH HOMETIC RETAIL (VIỆT NAM)</p>
        <p>Trụ sở chính: Tầng 9, Tòa nhà Bitexco Financial Tower, Quận 1, Thành phố Hồ Chí Minh, Việt Nam</p>
        <p>Liên hệ: 028 7108 8388 | Chăm sóc khách hàng: 1900 2555 79</p>
        <p>© 2026 HOMETIC Retail Vietnam. All rights reserved.</p>
      </div>
    </footer>
  );
}

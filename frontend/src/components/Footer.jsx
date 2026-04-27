import React, { useState, useEffect } from "react";

export default function Footer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
          <span style={styles.link}>Câu chuyện Hometic</span>
          <span style={styles.link}>Thông báo mới nhất</span>
          <span style={styles.link}>Câu hỏi thường gặp</span>
        </div>

        <div>
          <h4 style={styles.heading}>Hỗ trợ khách hàng</h4>
          <span style={styles.link}>Chính sách đổi trả</span>
          <span style={styles.link}>Danh sách cửa hàng</span>
          <span style={styles.link}>Hướng dẫn mua hàng</span>
        </div>

        <div>
          <h4 style={styles.heading}>Dịch vụ trực tuyến</h4>
          <span style={styles.link}>Chính sách bán lẻ</span>
          <span style={styles.link}>Giao hàng & Lắp đặt</span>
          <span style={styles.link}>Trung tâm bảo hành</span>
        </div>

        <div style={styles.newsletter}>
          <p style={{ fontWeight: '700', margin: 0 }}>Đăng ký nhận tin từ Hometic</p>
          <div style={styles.newsletterBox}>
            <input style={styles.input} placeholder="Nhập địa chỉ email của bạn" />
            <button style={styles.btn}>Gửi</button>
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

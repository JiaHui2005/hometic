import React, { useState, useEffect } from "react";
import { api, setSession } from "../services/api";

export default function Auth({ setUser, setActiveTab }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", phone: "", full_name: "", birthday: "", gender: "Nam" });
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Animation kích hoạt mỗi khi Tab thay đổi
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [isLogin]);

  // --- Bảng màu thương hiệu ---
  const brand = {
    bg: "#f9f5ed",      // Nền kem nhạt (Beige)
    panelBg: "#e5e5e5", // Nền xám của panel (như ảnh mẫu)
    primary: "#2c4e4e", // Teal đậm (Dark Teal)
    text: "#1a1a1a",    // Chữ tối
    white: "#ffffff",   // Ô input
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: brand.bg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden',
    },
    mainWrapper: {
      display: 'flex',
      width: '90%', // Chiếm 90% chiều rộng màn hình
      maxWidth: '1200px',
      height: '85vh',
      borderRadius: '25px',
      overflow: 'hidden',
      backgroundColor: brand.panelBg,
      boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
      position: 'relative'
    },
    // Bên trái: Visual Side (Teal)
    visualSide: {
      flex: 1, // Thu hẹp tỷ lệ xuống để phần Form rộng hơn
      backgroundColor: brand.primary,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px',
      color: brand.white,
      zIndex: 2,
      transition: 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
      transform: isLogin ? 'translateX(0)' : 'translateX(120%)',
    },
    // Bên phải: Form Side (Gray)
    formSide: {
      flex: 1.2, // Mở rộng tỷ lệ để Form đăng ký không bị khuất
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 80px', // Tăng padding để form cân đối
      zIndex: 1,
      transition: 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
      transform: isLogin ? 'translateX(0)' : 'translateX(-83.3%)', // ~100 / 1.2
    },
    formPanel: {
      width: '100%',
      maxWidth: '500px', // Mở rộng maxWidth của form
      // Animation hiện lên mượt mà
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '30px',
      color: brand.text,
      textAlign: 'left'
    },
    formGroup: {
      marginBottom: '18px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      fontSize: '15px',
      color: brand.text
    },
    input: {
      width: '100%',
      padding: '16px 20px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      backgroundColor: brand.white,
      boxSizing: 'border-box',
      outline: 'none',
      color: '#333'
    },
    policyBlock: {
      fontSize: '12px',
      lineHeight: '1.6',
      color: brand.text,
      margin: '20px 0',
      paddingTop: '20px',
      borderTop: '1px solid #ccc'
    },
    linkUnderline: {
      textDecoration: 'underline',
      cursor: 'pointer',
      fontWeight: '600'
    },
    btnSubmit: {
      width: '100%',
      padding: '20px',
      backgroundColor: brand.primary,
      color: brand.white,
      border: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '18px',
      marginTop: '10px',
      textTransform: 'uppercase'
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      // Giả lập logic đăng nhập
      if (form.email === "admin@hometic.com" && form.password === "admin") {
        const adminUser = { email: "admin@hometic.com", full_name: "Admin Jane", role: "admin" };
        setSession("mock-admin-token", adminUser);
        setUser(adminUser);
        setActiveTab("admin");
      } else if (form.email === "customer@hometic.com" && form.password === "customer") {
        const customerUser = { email: "customer@hometic.com", full_name: "Khách hàng", role: "customer" };
        setSession("mock-customer-token", customerUser);
        setUser(customerUser);
        setActiveTab("shop");
      } else {
        setError("Email hoặc mật khẩu không đúng! (Admin: admin@hometic.com / admin)");
      }
    } else {
      setError("Tính năng đăng ký đang bảo trì. Vui lòng dùng tài khoản giả lập để đăng nhập.");
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.mainWrapper}>

        {/* === Visual Side (Teal) === */}
        <section style={styles.visualSide}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '50px', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>HOMETIC.</h1>
            <p style={{ opacity: 0.8, fontSize: '18px', marginTop: '20px' }}>
              {isLogin ? "Nâng tầm không gian sống." : "Đăng ký thành viên mới."}
            </p>
          </div>
        </section>

        {/* === Form Side (Gray) === */}
        <section style={styles.formSide}>
          <div style={styles.formPanel}>
            <h2 style={styles.title}>{isLogin ? "Đăng nhập" : "Tạo tài khoản"}</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="stagger-1">
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input 
                    style={styles.input} 
                    type="email" 
                    placeholder="email@hometic.com" 
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div className="stagger-2">
                <div style={styles.formGroup}>
                  <label style={styles.label}>Password</label>
                  <input 
                    style={styles.input} 
                    type="password" 
                    placeholder="••••••••" 
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required 
                  />
                </div>
              </div>

              {!isLogin && (
                <div style={{ animation: 'staggerIn 0.5s ease-out' }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Họ và tên</label>
                    <input 
                      style={styles.input} 
                      placeholder="Nguyễn Văn A" 
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    />
                  </div>

                  {/* Tái hiện phần checkbox từ ảnh mẫu */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', marginBottom: '10px' }}>
                    <input type="checkbox" id="terms" required style={{ width: '18px', height: '18px' }} />
                    <label htmlFor="terms">
                      Tôi đồng ý với <span style={styles.linkUnderline}>Điều khoản và Điều kiện</span>
                    </label>
                  </div>
                </div>
              )}

              {error && <p style={{ color: '#e74c3c', fontSize: '13px', marginBottom: '15px', fontWeight: '500' }}>{error}</p>}

              <button type="submit" style={styles.btnSubmit}>
                {isLogin ? "Đăng nhập" : "ĐĂNG KÝ NGAY"}
              </button>

              <div style={{ textAlign: 'center', marginTop: '25px' }}>
                <span
                  style={{ ...styles.linkUnderline, fontSize: '14px', fontWeight: '500', color: brand.primary }}
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                >
                  {isLogin ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}
                </span>
              </div>
            </form>
          </div>
        </section>
      </div>

      <style>{`
        /* Animation hiện lần lượt (Stagger) cho các input */
        .stagger-1 { animation: staggerIn 0.4s ease backwards; animation-delay: 0.1s; }
        .stagger-2 { animation: staggerIn 0.4s ease backwards; animation-delay: 0.2s; }
        
        @keyframes staggerIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive Mobile */
        @media (max-width: 900px) {
          main[style*="mainWrapper"] { width: 95% !important; height: 90% !important; }
          section[style*="visualSide"] { display: none !important; }
          section[style*="formSide"] { flex: 1 !important; transform: none !important; padding: 30px !important; }
        }
      `}</style>
    </main>
  );
}
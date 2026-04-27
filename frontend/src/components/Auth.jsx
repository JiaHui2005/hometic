import React, { useState, useEffect, useRef } from "react";
import { authService, setSession } from "../services/api";
import { Eye, EyeOff, Calendar, ChevronDown } from "lucide-react";

export default function Auth({ setUser, setActiveTab }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [form, setForm] = useState({
    email: "", password: "", phone: "", full_name: "", birthday: "", gender: ""
  });
  const [error, setError] = useState("");

  const dateInputRef = useRef(null);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const data = await authService.login({
          email: form.email,
          password: form.password
        });
        
        const tokens = { access_token: data.access_token, refresh_token: data.refresh_token };
        setSession(tokens, data.user);
        setUser(data.user);
        
        if (data.user.role === "admin") {
          setActiveTab("admin");
        } else {
          setActiveTab("shop");
        }
      } else {
        const data = await authService.register({
          email: form.email,
          password: form.password,
          full_name: form.full_name,
          phone: form.phone,
          birthday: form.birthday,
          gender: form.gender
        });
        
        const tokens = { access_token: data.access_token, refresh_token: data.refresh_token };
        setSession(tokens, data.user);
        setUser(data.user);
        setActiveTab("shop");
        alert("Đăng ký thành công!");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const brand = {
    bg: "#f9f5ed",
    panelBg: "#e5e5e5",
    primary: "#234a4a",
    white: "#ffffff",
    text: "#1a1a1a",
    muted: "#666"
  };

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh', backgroundColor: brand.bg, fontFamily: '"Inter", sans-serif', overflow: 'hidden' },
    mainWrapper: { display: 'flex', width: '90%', maxWidth: '1000px', height: '85vh', borderRadius: '24px', overflow: 'hidden', backgroundColor: brand.panelBg, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', position: 'relative' },
    visualSide: { position: 'absolute', top: 0, left: isLogin ? '50%' : '0', width: '50%', height: '100%', backgroundColor: brand.primary, color: brand.white, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', transition: 'all 0.7s cubic-bezier(0.65, 0, 0.35, 1)', zIndex: 10, padding: '40px', boxSizing: 'border-box' },
    formSide: { width: '100%', height: '100%', display: 'flex', justifyContent: isLogin ? 'flex-start' : 'flex-end', alignItems: 'center', zIndex: 5 },
    scrollArea: { width: '50%', height: '100%', padding: '30px 45px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box', opacity: isVisible ? 1 : 0, transition: 'opacity 0.4s ease', overflowY: 'auto' },
    title: { fontSize: '24px', fontWeight: '800', marginBottom: '4px', color: brand.text },
    subtitle: { fontSize: '13px', color: brand.muted, marginBottom: '15px' },
    label: { display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: brand.text },
    inputWrapper: { position: 'relative', marginBottom: '10px' },
    input: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: 'none', backgroundColor: brand.white, fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
    compactGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    checkboxGroup: { display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' },
    checkbox: { width: '18px', height: '18px', marginTop: '2px', accentColor: brand.primary, cursor: 'pointer' },
    checkboxLabel: { fontSize: '12px', color: brand.text, lineHeight: '1.4' },
    disclaimer: { fontSize: '11px', color: brand.muted, lineHeight: '1.6', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ccc' },
    btnSubmit: { width: '100%', padding: '14px', backgroundColor: brand.primary, color: brand.white, border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', marginTop: '5px' }
  };

  return (
    <main style={styles.container}>
      <div style={styles.mainWrapper}>
        <div style={styles.visualSide}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', margin: 0 }}>HOMETIC.</h1>
          <p style={{ opacity: 0.8, marginTop: '10px', fontSize: '14px' }}>Nâng tầm không gian sống.</p>
        </div>

        <div style={styles.formSide}>
          <div style={styles.scrollArea}>
            <h2 style={styles.title}>{isLogin ? "Đăng nhập" : "Đăng ký tài khoản"}</h2>
            <p style={styles.subtitle}>Vui lòng nhập thông tin bên dưới</p>

            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Địa chỉ Email</label>
              <div style={styles.inputWrapper}>
                <input 
                  style={styles.input} 
                  type="email" 
                  placeholder="email@example.com" 
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <label style={styles.label}>Mật khẩu</label>
              <div style={styles.inputWrapper}>
                <input 
                  style={styles.input} 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <div onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#999' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </div>

              {error && <p style={{ color: '#e74c3c', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}

              {!isLogin && (
                <div style={{ animation: 'fadeIn 0.4s ease' }}>
                  <div style={styles.compactGrid}>
                    <div>
                      <label style={styles.label}>Số điện thoại</label>
                      <div style={styles.inputWrapper}>
                        <input 
                          style={styles.input} 
                          placeholder="090..." 
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={styles.label}>Họ tên</label>
                      <div style={styles.inputWrapper}>
                        <input 
                          style={styles.input} 
                          placeholder="Nguyễn Văn A" 
                          value={form.full_name}
                          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={styles.compactGrid}>
                    <div>
                      <label style={styles.label}>Ngày sinh</label>
                      <div style={styles.inputWrapper}>
                        <input
                          ref={dateInputRef}
                          style={styles.input}
                          type="date"
                          onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                          onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                        />
                        <Calendar
                          size={14}
                          onClick={() => dateInputRef.current.showPicker()}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999', cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={styles.label}>Giới tính</label>
                      <div style={styles.inputWrapper}>
                        <select 
                          style={{ ...styles.input, appearance: 'none' }}
                          value={form.gender}
                          onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        >
                          <option value="">Chọn</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <div style={styles.checkboxGroup}>
                    <input type="checkbox" id="info" style={styles.checkbox} />
                    <label htmlFor="info" style={styles.checkboxLabel}>Đăng ký nhận thông tin (Tùy chọn)</label>
                  </div>

                  <div style={styles.checkboxGroup}>
                    <input type="checkbox" id="terms" style={styles.checkbox} />
                    <label htmlFor="terms" style={styles.checkboxLabel}>
                      Tôi trên 16 tuổi và đồng ý với <span style={{ textDecoration: 'underline', fontWeight: '700', cursor: 'pointer' }}>Điều khoản và Điều kiện</span>
                    </label>
                  </div>

                  <p style={styles.disclaimer}>
                    Bằng việc tiếp tục đăng ký, tôi xác nhận rằng tôi đã đọc và đồng ý với Điều khoản sử dụng và Chính sách bảo mật của HOMETIC.
                  </p>
                </div>
              )}

              <button type="submit" style={styles.btnSubmit}>{isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}</button>

              <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px' }}>
                <span onClick={() => { setIsLogin(!isLogin); setError(""); }} style={{ color: brand.primary, fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>
                  {isLogin ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          cursor: pointer;
        }
        div::-webkit-scrollbar { width: 4px; }
        div::-webkit-scrollbar-track { background: transparent; }
        div::-webkit-scrollbar-thumb { background: #ccc; borderRadius: 10px; }
      `}</style>
    </main>
  );
}
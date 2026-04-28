import React, { useState, useEffect, useRef } from "react";
import { authService, setSession } from "../services/api";
import { Eye, EyeOff, Calendar, ChevronDown, ArrowLeft, Mail, Lock, Smartphone, User as UserIcon } from "lucide-react";

export default function Auth({ setUser, setActiveTab }) {
  // authMode: 'login', 'register', 'forgot', 'reset'
  const [authMode, setAuthMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // Mắt cho MK mới
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Mắt cho Xác nhận MK
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
    full_name: "",
    birthday: "",
    gender: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const dateInputRef = useRef(null);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [authMode]);

  const isLogin = authMode === "login";

  // --- XỬ LÝ QUÊN MẬT KHẨU ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.forgotPassword({ email: form.email });
      alert("Mã OTP khôi phục đã được gửi đến Email của bạn! Vui lòng kiểm tra.");
      setAuthMode("reset");
    } catch (err) {
      setError(err.message || "Email không tồn tại trong hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({
        token: form.otp,
        new_password: form.newPassword
      });
      alert("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
      setAuthMode("login");
      setForm({ ...form, password: "", otp: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError("Mã OTP không hợp lệ hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  // --- XỬ LÝ ĐĂNG NHẬP / ĐĂNG KÝ ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const data = await authService.login({
          email: form.email,
          password: form.password
        });
        setSession({ access_token: data.access_token, refresh_token: data.refresh_token }, data.user);
        setUser(data.user);
        setActiveTab(data.user.role === "admin" ? "admin" : "shop");
      } else {
        const data = await authService.register({
          email: form.email,
          password: form.password,
          full_name: form.full_name,
          phone: form.phone,
          birthday: form.birthday,
          gender: form.gender
        });
        setSession({ access_token: data.access_token, refresh_token: data.refresh_token }, data.user);
        setUser(data.user);
        setActiveTab("shop");
        alert("Đăng ký thành công! Chào mừng bạn đến với Hometic.");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra, vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const brand = {
    bg: "#f9f5ed",
    panelBg: "#e5e5e5",
    primary: "#234a4a",
    secondary: "#ed7f1a",
    white: "#ffffff",
    text: "#1a1a1a",
    muted: "#666",
    border: "#dcd7cc"
  };

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh', backgroundColor: brand.bg, fontFamily: '"Inter", sans-serif', overflow: 'hidden' },
    mainWrapper: { display: 'flex', width: '90%', maxWidth: '1000px', height: '85vh', borderRadius: '30px', overflow: 'hidden', backgroundColor: brand.panelBg, boxShadow: '0 25px 50px rgba(0, 0, 0, 0.12)', position: 'relative' },
    visualSide: { position: 'absolute', top: 0, left: (authMode === 'login' || authMode === 'forgot' || authMode === 'reset') ? '50%' : '0', width: '50%', height: '100%', backgroundColor: brand.primary, color: brand.white, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', transition: 'all 0.6s cubic-bezier(0.65, 0, 0.35, 1)', zIndex: 10, padding: '40px', textAlign: 'center' },
    scrollArea: { width: '50%', height: '100%', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box', opacity: isVisible ? 1 : 0, transition: 'opacity 0.4s ease', overflowY: 'auto' },
    title: { fontSize: '28px', fontWeight: '900', color: brand.text, margin: '0 0 8px' },
    subtitle: { fontSize: '14px', color: brand.muted, marginBottom: '25px' },
    label: { display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '700', color: brand.primary, textTransform: 'uppercase', letterSpacing: '0.5px' },
    input: { width: '100%', padding: '13px 15px', borderRadius: '12px', border: 'none', backgroundColor: brand.white, fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' },
    compactGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    btnSubmit: { width: '100%', padding: '16px', backgroundColor: brand.primary, color: brand.white, border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 12px rgba(35, 74, 74, 0.2)' },
    link: { color: brand.primary, fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' },
    eyeIcon: { position: 'absolute', right: '15px', top: '12px', cursor: 'pointer', color: '#999' }
  };

  return (
    <main style={styles.container}>
      <div style={styles.mainWrapper}>
        <div style={styles.visualSide}>
          <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-1px' }}>HOMETIC.</h1>
          <p style={{ opacity: 0.8, marginTop: '10px', fontSize: '16px', fontWeight: '500' }}>Nâng tầm không gian sống.</p>
        </div>

        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: (authMode === 'register') ? 'flex-end' : 'flex-start' }}>
          <div style={styles.scrollArea}>

            {/* 1. MÀN HÌNH QUÊN MẬT KHẨU */}
            {authMode === "forgot" ? (
              <form onSubmit={handleForgotPassword}>
                <div onClick={() => setAuthMode("login")} style={{ cursor: 'pointer', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px', color: brand.primary, fontWeight: '600' }}>
                  <ArrowLeft size={18} /> Quay lại đăng nhập
                </div>
                <h2 style={styles.title}>Quên mật khẩu?</h2>
                <p style={styles.subtitle}>Chúng tôi sẽ gửi mã OTP qua Email để xác thực tài khoản của bạn.</p>
                <label style={styles.label}>Email của bạn</label>
                <input style={styles.input} type="email" placeholder="Nhập email đăng ký" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                {error && <p style={{ color: '#e74c3c', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}
                <button type="submit" disabled={loading} style={styles.btnSubmit}>{loading ? "ĐANG GỬI..." : "GỬI MÃ XÁC NHẬN"}</button>
              </form>
            )

              /* 2. MÀN HÌNH NHẬP OTP VÀ ĐẶT LẠI MẬT KHẨU */
              : authMode === "reset" ? (
                <form onSubmit={handleResetPassword}>
                  <h2 style={styles.title}>Đặt lại mật khẩu</h2>
                  <p style={styles.subtitle}>Mã OTP đã được gửi đến <b>{form.email}</b></p>

                  <label style={styles.label}>Mã xác nhận (OTP)</label>
                  <input style={styles.input} type="text" placeholder="Nhập mã 6 chữ số" required value={form.otp} onChange={e => setForm({ ...form, otp: e.target.value })} />

                  <label style={styles.label}>Mật khẩu mới</label>
                  <div style={{ position: 'relative' }}>
                    <input style={styles.input} type={showNewPassword ? "text" : "password"} placeholder="Tối thiểu 6 ký tự" required value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} />
                    <div onClick={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>

                  <label style={styles.label}>Xác nhận mật khẩu</label>
                  <div style={{ position: 'relative' }}>
                    <input style={styles.input} type={showConfirmPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu mới" required value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                    <div onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>

                  {error && <p style={{ color: '#e74c3c', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}
                  <button type="submit" disabled={loading} style={styles.btnSubmit}>{loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN THAY ĐỔI"}</button>
                </form>
              )

                /* 3. MÀN HÌNH ĐĂNG NHẬP / ĐĂNG KÝ CHÍNH */
                : (
                  <form onSubmit={handleSubmit}>
                    <h2 style={styles.title}>{isLogin ? "Đăng nhập" : "Tạo tài khoản"}</h2>
                    <p style={styles.subtitle}>{isLogin ? "Chào mừng bạn trở lại với Hometic." : "Tham gia cùng chúng tôi ngay hôm nay."}</p>

                    <label style={styles.label}>Địa chỉ Email</label>
                    <input style={styles.input} type="email" placeholder="email@example.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

                    <label style={styles.label}>Mật khẩu</label>
                    <div style={{ position: 'relative' }}>
                      <input style={styles.input} type={showPassword ? "text" : "password"} placeholder="••••••••" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                      <div onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </div>
                    </div>

                    {isLogin && (
                      <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                        <span onClick={() => setAuthMode("forgot")} style={styles.link}>Quên mật khẩu?</span>
                      </div>
                    )}

                    {!isLogin && (
                      <div style={{ animation: 'fadeIn 0.4s ease' }}>
                        <div style={styles.compactGrid}>
                          <div>
                            <label style={styles.label}>Số điện thoại</label>
                            <input style={styles.input} placeholder="090..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                          </div>
                          <div>
                            <label style={styles.label}>Họ tên</label>
                            <input style={styles.input} placeholder="Nguyễn Văn A" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
                          </div>
                        </div>
                        <div style={styles.compactGrid}>
                          <div>
                            <label style={styles.label}>Ngày sinh</label>
                            <input style={styles.input} type="date" value={form.birthday} onChange={e => setForm({ ...form, birthday: e.target.value })} />
                          </div>
                          <div>
                            <label style={styles.label}>Giới tính</label>
                            <select style={styles.input} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                              <option value="">Chọn</option>
                              <option value="Nam">Nam</option>
                              <option value="Nữ">Nữ</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {error && <p style={{ color: '#e74c3c', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}
                    <button type="submit" disabled={loading} style={styles.btnSubmit}>
                      {loading ? "ĐANG XỬ LÝ..." : (isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ")}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
                      {isLogin ? "Bạn chưa có tài khoản? " : "Bạn đã có tài khoản? "}
                      <span onClick={() => { setAuthMode(isLogin ? "register" : "login"); setError(""); }} style={styles.link}>
                        {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
                      </span>
                    </p>
                  </form>
                )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        div::-webkit-scrollbar { width: 5px; }
        div::-webkit-scrollbar-thumb { background: #dcd7cc; borderRadius: 10px; }
      `}</style>
    </main>
  );
}
import React, { useState } from "react";
import { authService, setSession } from "../services/api";
import alertService from "../services/alertService";
import { Eye, EyeOff, ArrowLeft, Package, Ticket, Star } from "lucide-react";
import "./Auth.css";

function PasswordField({ id, label, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-group">
        <input
          id={id}
          className="input"
          style={{ paddingRight: 48 }}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="icon-btn icon-btn-sm input-action"
          onClick={() => setShow(!show)}
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

export default function Auth({ setUser, setActiveTab }) {
  // authMode: 'login', 'register', 'forgot', 'reset'
  const [authMode, setAuthMode] = useState("login");
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

  const isLogin = authMode === "login";

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const switchMode = (mode) => {
    setAuthMode(mode);
    setError("");
  };

  // --- XỬ LÝ QUÊN MẬT KHẨU ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.forgotPassword({ email: form.email });
      alertService.success("Gửi email thành công!", "Mã OTP khôi phục đã được gửi đến Email của bạn.");
      setAuthMode("reset");
    } catch (err) {
      alertService.error("Lỗi!", err.message || "Email không tồn tại trong hệ thống.");
      setError(err.message || "Email không tồn tại trong hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      alertService.warning("Cảnh báo!", "Mật khẩu xác nhận không khớp.");
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({
        token: form.otp,
        new_password: form.newPassword
      });
      alertService.success("Thành công!", "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
      setAuthMode("login");
      setForm({ ...form, password: "", otp: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alertService.error("Lỗi!", "Mã OTP không hợp lệ hoặc đã hết hạn.");
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
        alertService.success("Đăng ký thành công!", "Chào mừng bạn đến với Hometic.");
      }
    } catch (err) {
      alertService.error("Lỗi!", err.message || "Có lỗi xảy ra, vui lòng kiểm tra lại thông tin.");
      setError(err.message || "Có lỗi xảy ra, vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page">
      <div className="auth">
        <aside className="auth__visual">
          <div className="auth__arch">
            <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" alt="" aria-hidden="true" />
          </div>
          <div className="auth__perks">
            <p>Có tài khoản Hometic, bạn có thể:</p>
            <ul>
              <li><Package size={17} /> Theo dõi đơn hàng đến khi giao xong</li>
              <li><Ticket size={17} /> Lưu và dùng lại mã giảm giá</li>
              <li><Star size={17} /> Đánh giá sản phẩm đã mua</li>
            </ul>
          </div>
        </aside>

        <div className="auth__panel">
          {/* key theo authMode để mỗi lần đổi màn hình, form hiện dần lên */}
          <div key={authMode} className="auth__form-wrap">
            {authMode === "forgot" ? (
              <form className="auth__form" onSubmit={handleForgotPassword}>
                <button type="button" className="auth__back" onClick={() => switchMode("login")}>
                  <ArrowLeft size={16} /> Quay lại đăng nhập
                </button>
                <div>
                  <h1 className="auth__title">Quên mật khẩu?</h1>
                  <p className="auth__lead">Nhập email đăng ký, Hometic sẽ gửi mã OTP để bạn đặt lại mật khẩu.</p>
                </div>
                <div className="field">
                  <label htmlFor="fp-email">Email</label>
                  <input id="fp-email" className="input" type="email" placeholder="ban@email.com" required value={form.email} onChange={set("email")} />
                </div>
                {error && <p className="auth__error" role="alert">{error}</p>}
                <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block">
                  {loading ? "Đang gửi…" : "Gửi mã OTP"}
                </button>
              </form>
            ) : authMode === "reset" ? (
              <form className="auth__form" onSubmit={handleResetPassword}>
                <div>
                  <h1 className="auth__title">Đặt lại mật khẩu</h1>
                  <p className="auth__lead">Mã OTP đã được gửi đến <strong>{form.email}</strong></p>
                </div>
                <div className="field">
                  <label htmlFor="rs-otp">Mã OTP</label>
                  <input id="rs-otp" className="input auth__otp" type="text" inputMode="numeric" placeholder="6 chữ số" required value={form.otp} onChange={set("otp")} />
                </div>
                <PasswordField id="rs-new" label="Mật khẩu mới" placeholder="Tối thiểu 6 ký tự" autoComplete="new-password" value={form.newPassword} onChange={set("newPassword")} />
                <PasswordField id="rs-confirm" label="Nhập lại mật khẩu mới" autoComplete="new-password" value={form.confirmPassword} onChange={set("confirmPassword")} />
                {error && <p className="auth__error" role="alert">{error}</p>}
                <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block">
                  {loading ? "Đang lưu…" : "Đặt lại mật khẩu"}
                </button>
              </form>
            ) : (
              <form className="auth__form" onSubmit={handleSubmit}>
                <div className="segmented" role="tablist">
                  <button type="button" role="tab" aria-selected={isLogin} className={isLogin ? "is-active" : ""} onClick={() => switchMode("login")}>Đăng nhập</button>
                  <button type="button" role="tab" aria-selected={!isLogin} className={!isLogin ? "is-active" : ""} onClick={() => switchMode("register")}>Tạo tài khoản</button>
                </div>

                <div>
                  <h1 className="auth__title">{isLogin ? "Chào mừng trở lại" : "Tạo tài khoản Hometic"}</h1>
                  <p className="auth__lead">{isLogin ? "Đăng nhập để theo dõi đơn hàng và dùng mã giảm giá." : "Chỉ mất một phút để bắt đầu."}</p>
                </div>

                {!isLogin && (
                  <div className="auth__grid">
                    <div className="field">
                      <label htmlFor="rg-name">Họ tên</label>
                      <input id="rg-name" className="input" placeholder="Nguyễn Văn A" autoComplete="name" value={form.full_name} onChange={set("full_name")} />
                    </div>
                    <div className="field">
                      <label htmlFor="rg-phone">Số điện thoại</label>
                      <input id="rg-phone" className="input" type="tel" placeholder="090…" autoComplete="tel" value={form.phone} onChange={set("phone")} />
                    </div>
                  </div>
                )}

                <div className="field">
                  <label htmlFor="au-email">Email</label>
                  <input id="au-email" className="input" type="email" placeholder="ban@email.com" autoComplete="email" required value={form.email} onChange={set("email")} />
                </div>

                <PasswordField
                  id="au-password"
                  label="Mật khẩu"
                  placeholder="••••••••"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={form.password}
                  onChange={set("password")}
                />

                {isLogin && (
                  <button type="button" className="auth__link auth__forgot" onClick={() => switchMode("forgot")}>Quên mật khẩu?</button>
                )}

                {!isLogin && (
                  <div className="auth__grid">
                    <div className="field">
                      <label htmlFor="rg-birthday">Ngày sinh</label>
                      <input id="rg-birthday" className="input" type="date" value={form.birthday} onChange={set("birthday")} />
                    </div>
                    <div className="field">
                      <label htmlFor="rg-gender">Giới tính</label>
                      <select id="rg-gender" className="select" value={form.gender} onChange={set("gender")}>
                        <option value="">Chọn</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                  </div>
                )}

                {error && <p className="auth__error" role="alert">{error}</p>}

                <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block">
                  {loading ? "Đang xử lý…" : (isLogin ? "Đăng nhập" : "Tạo tài khoản")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

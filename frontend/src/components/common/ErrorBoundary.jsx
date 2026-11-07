import React from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Hometic System Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="empty-state" style={{ minHeight: "100vh", justifyContent: "center" }}>
          <span className="empty-icon"><AlertTriangle size={28} /></span>
          <h3>Trang gặp lỗi khi hiển thị</h3>
          <p>Tải lại trang để thử lại. Giỏ hàng của bạn vẫn được giữ nguyên.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

# Hometic - Nâng Tầm Không Gian Sống Thông Minh

Hometic là nền tảng thương mại điện tử chuyên biệt về thiết bị gia dụng và giải pháp nhà thông minh, được phát triển cho **CÔNG TY TNHH DỊCH VỤ POPO (POPO Services)**. Với slogan **"Sắm đủ, sống vui"**, dự án hướng tới việc mang lại trải nghiệm mua sắm hiện đại, tiện lợi và cao cấp cho người tiêu dùng Việt Nam.

---

## 🏢 Tổng Quan Doanh Nghiệp & Mô Hình Kinh Doanh

### 1. Doanh nghiệp chủ quản
- **Tên công ty:** CÔNG TY TNHH DỊCH VỤ POPO (POPO Services).
- **Lĩnh vực hoạt động:** Bán lẻ và phân phối thiết bị gia dụng cao cấp, giải pháp nhà thông minh (Smart Home).
- **Tầm nhìn:** Trở thành đơn vị dẫn đầu trong việc cung cấp các thiết bị công nghệ hỗ trợ cuộc sống hàng ngày tại Việt Nam.

### 2. Mô hình kinh doanh (B2C - Business to Consumer)
Hometic vận hành theo mô hình B2C trực tiếp, kết nối doanh nghiệp với khách hàng cá nhân thông qua nền tảng số:
- **Sản phẩm:** Đa dạng từ đồ gia dụng truyền thống đến các thiết bị IoT (Robot hút bụi, nồi chiên không dầu thông minh, cảm biến nhà ở...).
- **Giá trị cốt lõi:** Chất lượng sản phẩm chọn lọc, dịch vụ hậu mãi chu đáo và trải nghiệm người dùng tối ưu trên nền tảng web.
- **Kênh phân phối:** Website TMĐT tập trung, tối ưu hóa cho cả thiết bị di động và máy tính.

---

## 🏗️ Kiến Trúc Hệ Thống

Dự án được xây dựng theo kiến trúc **Decoupled Architecture** (Tách biệt Frontend và Backend) giúp tăng khả năng mở rộng và bảo trì.

### 1. Backend (The Engine)
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) - Hiệu năng cực cao dựa trên Python 3.10+.
- **ORM:** SQLAlchemy với MySQL 8 - Quản lý quan hệ dữ liệu chặt chẽ.
- **Authentication:** JWT (JSON Web Tokens) - Đảm bảo bảo mật phiên đăng nhập.
- **API Design:** RESTful API chuẩn hóa, tài liệu tự động qua Swagger UI.

### 2. Frontend (The Interface)
- **Library:** React.js + Vite - Tốc độ tải trang cực nhanh và trải nghiệm mượt mà.
- **Styling:** Vanilla CSS + Modern Design Patterns (Glassmorphism, Vibrant Colors).
- **Icons:** Lucide React - Bộ icon hiện đại, đồng nhất.
- **State Management:** React Hooks (useState, useEffect, useMemo).

### 3. Database Schema
Hệ thống quản lý các thực thể chính:
- `User`: Quản lý tài khoản (Admin/Customer), hồ sơ người dùng.
- `Category`: Phân loại sản phẩm đa cấp.
- `Product`: Thông tin chi tiết sản phẩm, giá bán, kho hàng, thông số kỹ thuật (JSON).
- `Order & OrderItem`: Luồng đặt hàng, trạng thái vận chuyển và lịch sử giao dịch.
- `Review`: Đánh giá và phản hồi từ khách hàng.
- `Coupon`: Hệ thống mã giảm giá cho khách hàng.

---

## 📁 Cấu Trúc Dự Án

```text
hometic/
├── backend/                # Nguồn mã nguồn Backend (FastAPI)
│   ├── app/
│   │   ├── api/            # Các endpoint API (auth, admin, catalog, orders...)
│   │   ├── core/           # Cấu hình hệ thống, bảo mật (config, security)
│   │   ├── db/             # Kết nối DB và khởi tạo dữ liệu (session, init_db)
│   │   ├── models/         # Định nghĩa các thực thể SQLAlchemy
│   │   ├── schemas/        # Pydantic models (DTOs) để validate dữ liệu
│   │   └── main.py         # Điểm khởi chạy ứng dụng
│   ├── static/             # Chứa ảnh upload (uploads/...)
│   └── requirements.txt    # Danh sách thư viện Python
├── frontend/               # Nguồn mã nguồn Frontend (React)
│   ├── src/
│   │   ├── components/     # Các UI Components (Admin, Shop, Cart, Profile...)
│   │   ├── services/       # API Client và Alert Service
│   │   ├── main.jsx        # Điểm khởi chạy React
│   │   └── styles.css      # Toàn bộ mã CSS (Modern UI)
│   ├── public/             # Tài nguyên tĩnh (Logo, Banners)
│   └── package.json        # Cấu hình dự án Node.js
├── database/               # Scripts khởi tạo cơ sở dữ liệu
│   ├── schema.sql          # Cấu trúc bảng
│   └── seed_product.sql    # Dữ liệu mẫu
├── scripts/                # Các script tự động hóa (.sh cho Mac/Linux, .bat cho Win)
└── docker-compose.yml      # Cấu hình chạy Docker cho MySQL
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy (Từ A-Z)

### Bước 1: Chuẩn bị môi trường
Yêu cầu máy tính đã cài đặt:
- **Python 3.10+**
- **Node.js 18+** (kèm npm)
- **MySQL 8** (hoặc Docker Desktop)

### Cách 1: Chạy nhanh bằng Script (Khuyên dùng)
Hệ thống đã cung cấp sẵn script để tự động hóa việc cài đặt và khởi chạy:

**Trên macOS/Linux:**
```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

**Trên Windows:**
```bat
scripts\start.bat
```
*Script sẽ tự động: Cài đặt môi trường ảo Python, cài đặt thư viện Backend, cài đặt Node packages Frontend và khởi chạy cả 2 server cùng lúc.*

---

### Cách 2: Cài đặt thủ công (A-Z)
Dành cho trường hợp bạn muốn kiểm soát từng bước hoặc script gặp lỗi môi trường.

#### Bước 1: Thiết lập Cơ sở dữ liệu (Database)
1. Khởi động MySQL Server.
2. Tạo database tên là `hometic_db`.
3. Nếu dùng Docker, chỉ cần chạy:
   ```bash
   docker compose up -d mysql
   ```
4. Nếu chạy thủ công, hãy import file:
   ```bash
   mysql -u root -p hometic_db < database/schema.sql
   ```

### Bước 3: Cấu hình và chạy Backend
1. Truy cập thư mục backend:
   ```bash
   cd backend
   ```
2. Tạo môi trường ảo và cài đặt thư viện:
   ```bash
   python -m venv .venv
   # Mac/Linux:
   source .venv/bin/activate
   # Windows:
   .venv\Scripts\activate
   
   pip install -r requirements.txt
   ```
3. Tạo file `.env` từ `.env.example` và điều chỉnh thông tin kết nối MySQL:
   ```env
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=hometic_db
   ```
4. Chạy server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *Server sẽ chạy tại: http://localhost:8000*

### Bước 4: Cấu hình và chạy Frontend
1. Mở terminal mới, truy cập thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt các package:
   ```bash
   npm install
   ```
3. Chạy ứng dụng ở chế độ development:
   ```bash
   npm run dev
   ```
   *Ứng dụng sẽ chạy tại: http://localhost:5173*

---

## 🛠️ Tài Khoản Thử Nghiệm

Hệ thống sẽ tự động seed dữ liệu mẫu khi Backend khởi chạy lần đầu:

| Vai trò | Email | Mật khẩu |
| :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@hometic.vn` | `123456` |
| **Khách hàng (User)** | `user@hometic.vn` | `123456` |

---

## 🌟 Các Tính Năng Chính

### 🛒 Dành cho Khách hàng
- **Khám phá sản phẩm:** Giao diện hiện đại, phân loại theo danh mục thông minh.
- **Tìm kiếm & Lọc:** Lọc theo khoảng giá, thương hiệu, sắp xếp theo nhu cầu.
- **Giỏ hàng & Thanh toán:** Quy trình đặt hàng tối giản, quản lý giỏ hàng real-time.
- **Hồ sơ cá nhân:** Cập nhật thông tin, thay đổi ảnh đại diện, theo dõi lịch sử đơn hàng.
- **Đánh giá & Mã giảm giá:** Gửi feedback về sản phẩm và áp dụng coupon ưu đãi.

### ⚙️ Dành cho Quản trị viên (Admin)
- **Dashboard:** Thống kê doanh thu, đơn hàng, khách hàng qua biểu đồ trực quan.
- **Quản lý Sản phẩm:** CRUD sản phẩm, upload ảnh, quản lý kho hàng.
- **Quản lý Danh mục:** Tổ chức cây danh mục linh hoạt.
- **Quản lý Đơn hàng:** Tiếp nhận, xử lý và cập nhật trạng thái đơn hàng (Chờ xử lý -> Đang giao -> Hoàn thành).
- **Quản lý Mã giảm giá:** Tạo mới và theo dõi các chương trình khuyến mãi.

---

## 📈 API Reference
Tài liệu API đầy đủ có thể truy cập tại: `http://localhost:8000/docs` (Swagger UI).

---
*Phát triển bởi Nhóm Tú Linh - 2026*

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
- **Library:** React 18 + Vite 6, không dùng thêm thư viện UI.
- **Styling:** CSS thuần chia theo component (`Header.css`, `Cart.css`…) + design tokens dùng chung trong `src/styles/tokens.css`.
- **Bảng màu:** Sage / Olive / Cream — nền ngà `#F6F3EC`, bề mặt trắng ấm, ô liu đậm `#384A2E` cho nút chính, sage `#4F6543` cho liên kết, đất nung `#A84E2C` chỉ dùng cho giảm giá.
- **Typography:** Bricolage Grotesque cho tiêu đề và giá, Be Vietnam Pro cho nội dung — cả hai hỗ trợ đầy đủ tiếng Việt.
- **Bo góc tiết chế:** nút và ô nhập 8px, thẻ sản phẩm 10px, khối lớn và hộp thoại 12px; không dùng nút dạng viên thuốc.
- **Chuyển động:** ngắn (140–420ms), chỉ có một màn mở đầu ở trang chủ; còn lại chỉ phản hồi thao tác (mở menu, hộp thoại, đổi bước). Tự tắt khi hệ điều hành bật *Reduce motion*.
- **Tính năng mua sắm:**
  - Tìm kiếm có gợi ý (danh mục, sản phẩm, tìm gần đây), không phân biệt dấu, điều hướng bằng bàn phím.
  - Trang danh mục: lọc theo giá, thương hiệu, còn hàng; sắp xếp; bộ lọc dạng bottom sheet trên điện thoại.
  - So sánh tối đa 3 sản phẩm, đánh dấu giá trị tốt nhất theo từng thông số.
  - "Tìm sản phẩm phù hợp": lọc theo nhóm, ngân sách, nhu cầu và giải thích lý do bằng dữ liệu thật (giá, thông số, tồn kho).
  - Trang chi tiết: "Vì sao nên chọn mẫu này" và các lựa chọn thay thế (tiết kiệm hơn, cùng tầm giá, nâng cấp).
  - Đặt hàng theo 3 bước: giỏ hàng, thông tin giao hàng, hoàn tất.
  - Mã giảm giá: nhập mã ở giỏ hàng (tự lưu vào tài khoản nếu chưa có), ví mã trong trang Hồ sơ, tiền giảm tính đúng mức tối đa và đơn tối thiểu.
- **Icons:** Lucide React.
- **State Management:** React Hooks + `StoreContext` (catalog, giỏ hàng, so sánh, điều hướng) + custom hook `useProductFilters`.

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
├── frontend/               # Nguồn mã nguồn Frontend (React + Vite)
│   ├── src/
│   │   ├── main.jsx        # Điểm khởi chạy: nạp CSS nền, mount <App /> trong ErrorBoundary
│   │   ├── App.jsx         # State toàn cục + StoreContext.Provider + điều hướng theo tab
│   │   ├── context/        # StoreContext — catalog, giỏ hàng, so sánh, điều hướng
│   │   ├── pages/          # Mỗi trang một file JSX + CSS đi kèm:
│   │   │                   #   Shop (trang chủ), CategoryDetail, SearchPage, ProductDetail,
│   │   │                   #   Compare, Finder, Cart (gồm đặt hàng), Auth, Profile, StaticPages, Admin
│   │   ├── components/
│   │   │   ├── layout/     # Header, SearchBox (gợi ý tìm kiếm), Footer
│   │   │   ├── product/    # ProductCard, ProductStrip, ProductFilters, CatalogView, CompareTray
│   │   │   ├── common/     # Modal, Alert (toast), StatusBadge, Reviews, ErrorBoundary
│   │   │   └── admin/      # Sidebar, AdminHeader, Dashboard, DataList, AdminModal, Admin.css
│   │   ├── hooks/          # useProductFilters — lọc theo giá, thương hiệu, còn hàng + sắp xếp
│   │   ├── services/       # API client (api.js) và alertService
│   │   ├── styles/         # tokens.css (màu, chữ, bo góc, motion), base.css, motion.css
│   │   ├── utils/          # format.js, product.js (giá, thông số, tìm kiếm), guidance.js (gợi ý)
│   │   └── constants/      # Dữ liệu demo khi backend chưa chạy
│   ├── public/             # Tài nguyên tĩnh (Logo, Banners)
│   └── package.json        # Scripts: dev, build, preview, check
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
Trên macOS/Linux, một lệnh `./scripts/start.sh` chạy **toàn bộ hệ thống** theo thứ tự:

1. Kiểm tra Docker, Python 3.10+, Node 18+ và các cổng 8000, 5173 còn trống.
2. Bật Docker Desktop nếu chưa chạy (macOS), khởi động MySQL trong Docker và chờ nạp xong dữ liệu mẫu.
3. Tạo `backend/.env`, môi trường ảo `.venv`, cài thư viện Python (chỉ cài lại khi `requirements.txt` đổi), tạo tài khoản thử nghiệm.
4. Tạo `frontend/.env`, cài thư viện Node (chỉ khi `package-lock.json` đổi).
5. Chạy Backend và Frontend, chờ cả hai trả lời rồi in địa chỉ truy cập và tài khoản. Log hiển thị kèm tiền tố `[api]` / `[web]`.

Nhấn **Ctrl+C** để dừng Backend và Frontend. MySQL vẫn chạy để giữ dữ liệu; dùng `./scripts/start.sh --stop-db` nếu muốn dừng luôn MySQL khi thoát, hoặc `docker compose stop mysql` để dừng riêng.

*Lưu ý: `scripts/start.bat` (Windows) hiện chưa tự bật MySQL — hãy chạy `docker compose up -d mysql` trước.*

---

### Cách 2: Chạy bằng Docker Compose (Đơn giản nhất)
Nếu máy bạn đã cài sẵn **Docker** và **Docker Desktop**, bạn có thể khởi chạy toàn bộ hệ thống (Frontend, Backend, Database) chỉ với 1 lệnh duy nhất tại thư mục gốc của dự án:

```bash
docker compose up -d --build
```

**Sau khi Docker chạy xong, bạn có thể truy cập ngay:**
- **Giao diện Web:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs

*Lưu ý: Database MySQL tự động seed dữ liệu mẫu qua file `database/init.sql` và backend sẽ tự khởi tạo `init_db.py`.*

Để tắt toàn bộ hệ thống, chạy lệnh:
```bash
docker compose down
```

---

### Cách 3: Cài đặt thủ công (A-Z)
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
4. (Tuỳ chọn) Đổi địa chỉ API bằng biến `VITE_API_URL` trong `frontend/.env` (mẫu: `frontend/.env.example`). Nếu backend chưa chạy, trang chủ sẽ hiển thị dữ liệu demo.
5. Build bản production:
   ```bash
   npm run build
   ```

#### Tuỳ chỉnh giao diện
- **Đổi màu, cỡ chữ, bo góc:** sửa biến trong `src/styles/tokens.css` — toàn bộ giao diện (kể cả trang quản trị) dùng chung các biến này.
- **Đổi tốc độ chuyển động:** biến `--dur-fast`, `--dur`, `--dur-slow`, `--ease` trong cùng file.
- **Thành phần dùng chung:** nút (`.btn`, `.btn-primary`…), ô nhập (`.input`, `.field`), thẻ trạng thái (`.tag`), chip lọc (`.chip`) nằm trong `src/styles/base.css`.
- **Kiểm tra logic gợi ý:** chạy `npm run check` trong thư mục `frontend` để tự kiểm tra các hàm tính giá, so sánh thông số và xếp hạng gợi ý.

---

## 🛠️ Tài Khoản Thử Nghiệm

Dữ liệu mẫu (`database/seed_product.sql`) và `scripts/start.sh` tạo sẵn các tài khoản:

| Vai trò | Email | Mật khẩu |
| :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@hometic.com` | `123456` |
| **Khách hàng (User)** | `user@hometic.com` | `123456` |

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
- **Quản lý Mã giảm giá:** Tạo mã (theo % hoặc số tiền, mức giảm tối đa, đơn tối thiểu, số lượt, thời hạn), theo dõi lượt dùng, xoá hoặc ngưng mã đã dùng.

---

## 📈 API Reference
Tài liệu API đầy đủ có thể truy cập tại: `http://localhost:8000/docs` (Swagger UI).

---
*Phát triển bởi Nhóm Tứ Linh - 2026*

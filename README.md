# Hometic - Sắm đủ, sống vui

Website TMĐT cho **CÔNG TY TNHH DỊCH VỤ POPO (POPO Services)**, lĩnh vực bán lẻ thiết bị gia dụng và gia dụng thông minh. Mô hình kinh doanh: **B2C**.

## Công nghệ

- Frontend: React + Vite
- Backend: FastAPI + SQLAlchemy
- Database: MySQL 8
- Auth: JWT, có OAuth mock để demo luồng đăng nhập bên thứ ba
- Admin: quản lý sản phẩm, danh mục, đơn hàng, dashboard doanh thu

## Cấu trúc thư mục

```text
.
├── backend/          # FastAPI API
├── frontend/         # React app
├── database/         # SQL khởi tạo MySQL
├── scripts/          # Script chạy dự án .sh/.bat
├── docker-compose.yml
└── README.md
```

## Chức năng đã scaffold

- Khách hàng: đăng ký, đăng nhập JWT, OAuth mock, tìm kiếm và lọc sản phẩm, giỏ hàng local, thanh toán mock, lịch sử đơn hàng, đánh giá sản phẩm.
- Admin: CRUD danh mục, CRUD sản phẩm qua API, quản lý đơn hàng, cập nhật trạng thái đơn hàng, dashboard tổng quan sản phẩm, khách hàng, đơn hàng, doanh thu.
- Database: model người dùng, danh mục, sản phẩm, đơn hàng, chi tiết đơn hàng, đánh giá.

## Yêu cầu môi trường

- Python 3.10+
- Node.js 18+
- MySQL 8 hoặc Docker Desktop

## Chạy nhanh bằng script

### macOS/Linux

```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

### Windows

```bat
scripts\start.bat
```

Sau khi chạy:

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:8000>
- Swagger API docs: <http://localhost:8000/docs>

## Khởi động MySQL

Nếu dùng Docker:

```bash
docker compose up -d mysql
```

Nếu dùng MySQL local, chạy file:

```bash
mysql -u root -p < database/init.sql
```

Mặc định backend kết nối database:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=hometic_db
```

Sửa tại `backend/.env` nếu MySQL của bạn có mật khẩu hoặc user khác.

## Tài khoản demo

Backend tự seed dữ liệu khi khởi động lần đầu.

- Admin: `admin@hometic.vn` / `admin123`
- Khách hàng: `customer@hometic.vn` / `customer123`

## Chạy thủ công

### Backend

```bash
cd backend
cp .env.example .env
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Trên Windows dùng:

```bat
cd backend
copy .env.example .env
py -3 -m venv .venv
.venv\Scripts\activate.bat
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## API chính

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/oauth/mock`
- `GET /api/products`
- `GET /api/categories`
- `POST /api/checkout`
- `GET /api/orders/me`
- `POST /api/reviews`
- `GET /api/admin/dashboard`
- `POST /api/admin/products`
- `PUT /api/admin/products/{product_id}`
- `DELETE /api/admin/products/{product_id}`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/{order_id}`

## Deploy gợi ý

- Frontend: Vercel, đặt biến môi trường `VITE_API_URL=https://your-api-domain/api`.
- Backend: Render hoặc Railway, đặt các biến `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `SECRET_KEY`, `BACKEND_CORS_ORIGINS`.
- Database: Railway MySQL, PlanetScale, Aiven hoặc MySQL server riêng.

## Gắn Figma sau

Phần React hiện được tổ chức trong `frontend/src/main.jsx` và `frontend/src/styles.css` để dễ thay giao diện. Khi có màn hình Figma, nên tách dần thành component:

- `components/Header.jsx`
- `pages/ShopPage.jsx`
- `pages/CartPage.jsx`
- `pages/AuthPage.jsx`
- `pages/AdminPage.jsx`

API client đã nằm riêng tại `frontend/src/services/api.js`, vì vậy thay UI sẽ ít ảnh hưởng backend.

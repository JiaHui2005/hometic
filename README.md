# Hometic — Sắm đủ, sống vui

## 1. Giới thiệu

Hometic là website thương mại điện tử bán đồ gia dụng và thiết bị nhà thông minh: nồi chiên, máy lọc không khí, robot hút bụi, khoá vân tay, tivi… Dự án là đồ án cá nhân mô phỏng cửa hàng của POPO Services, gồm:

- **Frontend:** React 18 + Vite, giao diện tông Sage / Olive / Cream, dùng tốt trên điện thoại.
- **Backend:** FastAPI (Python) cung cấp REST API, tài liệu tự sinh tại `/docs`.
- **Database:** MySQL 8 chạy trong Docker, có sẵn 50 sản phẩm mẫu với mô tả và thông số chi tiết.
- **Ảnh:** lưu trên Cloudinary (gói miễn phí), tự thu nhỏ đúng kích thước hiển thị và chuyển sang WebP/AVIF nên trang tải nhanh.

---

## 2. Tính năng cốt lõi

### Khách hàng
- **Tìm kiếm có gợi ý:** gõ không dấu vẫn ra kết quả ("noi chien" → "Nồi chiên"), gợi ý danh mục, sản phẩm và các lần tìm gần đây, điều hướng được bằng bàn phím.
- **Danh mục nhiều cấp:** lọc theo giá, thương hiệu, còn hàng; sắp xếp theo giá, giảm giá, mới nhất. Trên điện thoại, bộ lọc mở dạng bảng trượt từ dưới lên.
- **Trang sản phẩm:** ảnh, giá và mức tiết kiệm, tồn kho, bảng thông số, phần giới thiệu chia mục, mục "Vì sao nên chọn mẫu này" và các mẫu thay thế (rẻ hơn, cùng tầm giá, nâng cấp).
- **So sánh** tối đa 3 sản phẩm, đánh dấu giá trị tốt nhất của từng thông số.
- **Tìm sản phẩm phù hợp:** chọn nhóm hàng, ngân sách, nhu cầu; hệ thống xếp hạng và giải thích lý do bằng dữ liệu thật (giá, thông số, tồn kho).
- **Giỏ hàng và đặt hàng 3 bước:** giỏ hàng → thông tin giao hàng → hoàn tất, có mã đơn để tra cứu.
- **Mã giảm giá:** nhập mã ở giỏ hàng hoặc lưu sẵn trong ví mã ở trang Hồ sơ. Hệ thống tự kiểm tra hạn dùng, đơn tối thiểu và mức giảm tối đa.
- **Tài khoản:** đăng ký, đăng nhập, quên mật khẩu bằng OTP gửi qua email, đổi mật khẩu, ảnh đại diện, lịch sử đơn hàng, đánh giá sản phẩm.

### Quản trị viên
- **Dashboard:** doanh thu, số đơn, khách hàng, biểu đồ doanh thu theo ngày và theo danh mục.
- **Quản lý sản phẩm và danh mục:** thêm, sửa, ẩn hoặc khôi phục, upload ảnh, quản lý tồn kho.
- **Quản lý đơn hàng:** cập nhật trạng thái chờ xử lý → đang xử lý → đang giao → đã giao / huỷ. Huỷ đơn thì tồn kho tự hoàn lại.
- **Quản lý mã giảm giá:** tạo mã theo % hoặc số tiền, đặt mức giảm tối đa, đơn tối thiểu, số lượt và thời hạn, theo dõi lượt đã dùng.

---

## 3. Giá trị sử dụng

### Với người mua
- **Chọn đúng món nhanh hơn.** Thay vì mở hàng chục tab, người mua nhập ngân sách và nhu cầu ở mục "Tìm sản phẩm phù hợp" là có danh sách xếp hạng kèm lý do. Ví dụ: "Lưu lượng lọc (CADR) cao nhất trong nhóm", "Rẻ hơn mức giá phổ biến của nhóm".
- **Hiểu sản phẩm trước khi mua.** Mỗi sản phẩm có mô tả nói rõ dùng để làm gì, điểm nổi bật bằng con số cụ thể và hợp với ai, nên người không rành kỹ thuật vẫn tự quyết định được.
- **So sánh minh bạch.** Đặt tối đa 3 mẫu cạnh nhau, thông số tốt nhất được đánh dấu sẵn, không phải tự dò từng dòng.
- **Biết rõ mình được giảm bao nhiêu.** Giá gốc, giá bán, số tiền tiết kiệm và mức giảm từ mã khuyến mãi đều hiện trước khi đặt; mã không đủ điều kiện sẽ báo lý do (ví dụ còn thiếu bao nhiêu để đạt đơn tối thiểu).
- **Đặt hàng gọn trong 3 bước,** dùng thoải mái trên điện thoại. Sau khi đặt có mã đơn để theo dõi trong trang Hồ sơ.
- **Tài khoản an toàn.** Mật khẩu được mã hoá, khôi phục bằng mã OTP qua email, đổi mật khẩu là các thiết bị khác tự đăng xuất.

### Với chủ cửa hàng
- **Nắm tình hình kinh doanh trong một màn hình:** doanh thu, số đơn, khách hàng, doanh thu theo ngày và theo nhóm hàng.
- **Vận hành không cần kỹ thuật:** thêm sửa sản phẩm, đăng ảnh, cập nhật tồn kho, xử lý đơn và tạo mã giảm giá ngay trên trang quản trị.
- **Không bán quá số hàng đang có.** Tồn kho tự trừ khi khách đặt và tự hoàn lại khi đơn bị huỷ, kể cả khi nhiều khách đặt cùng lúc.
- **Chủ động khuyến mãi** với mã giảm theo % hoặc số tiền, kèm mức giảm tối đa, đơn tối thiểu, số lượt dùng và thời hạn; xem được mã nào đang được dùng nhiều.
- **Dữ liệu được giữ gìn.** Lịch sử đơn hàng không mất khi sửa hay ngừng bán sản phẩm, nên số liệu doanh thu luôn đúng.
- **Dễ mở rộng:** frontend, backend và database tách riêng, có sẵn bộ kiểm thử tự động và log theo dõi, nên thêm tính năng hay đưa lên server không phải làm lại từ đầu.

---

## 4. Cách chạy

### Yêu cầu
- Docker Desktop
- Python 3.10+
- Node.js 18+

### Cách 1: một lệnh chạy tất cả (macOS / Linux, khuyên dùng)

```bash
./scripts/start.sh
```

Script tự làm lần lượt:
1. Kiểm tra công cụ và các cổng 8000, 5173.
2. Mở Docker Desktop nếu chưa chạy, bật MySQL và chờ nạp xong dữ liệu mẫu.
3. Tạo `backend/.env` và `.venv`, cài thư viện Python, tạo tài khoản thử nghiệm.
4. Tạo `frontend/.env`, cài thư viện Node.
5. Chạy backend và frontend, in địa chỉ truy cập khi cả hai đã sẵn sàng.

Thư viện chỉ được cài lại khi `requirements.txt` hoặc `package-lock.json` thay đổi.

Nhấn **Ctrl+C** để dừng backend và frontend. MySQL vẫn chạy để giữ dữ liệu; muốn tắt luôn MySQL thì chạy `./scripts/start.sh --stop-db`.

| Địa chỉ | |
| :--- | :--- |
| Website | http://localhost:5173 |
| API | http://localhost:8000/api |
| Tài liệu API (Swagger) | http://localhost:8000/docs |

### Cách 2: Docker Compose

```bash
cp backend/.env.example backend/.env
docker compose up -d --build
```

Điền `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` trong `backend/.env` nếu muốn gửi được email OTP. Tắt hệ thống bằng `docker compose down`.

### Cách 3: Windows

```bat
docker compose up -d mysql
scripts\start.bat
```

`start.bat` chưa tự bật MySQL nên cần chạy lệnh `docker compose` trước.

### Lưu ảnh trên Cloudinary

Mặc định ảnh upload được lưu ở `backend/static/uploads`. Để lưu lên Cloudinary:

1. Tạo tài khoản miễn phí tại https://cloudinary.com, vào **Settings → API Keys** để lấy Cloud name, API Key và API Secret.
2. Thêm vào `backend/.env`:
   ```env
   STORAGE_BACKEND=cloudinary
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```
3. (Chỉ cần một lần) Chuyển ảnh cũ trong `static/uploads` lên Cloudinary và đổi URL trong DB lẫn dữ liệu mẫu. Chạy trong thư mục `backend`:
   ```bash
   .venv/bin/python -m app.utils.migrate_images_to_cloudinary --dry-run
   .venv/bin/python -m app.utils.migrate_images_to_cloudinary
   ```
   Lệnh đầu chỉ liệt kê; chạy lại nhiều lần vẫn an toàn.

API Secret chỉ để trong `backend/.env` (đã nằm trong `.gitignore`), không đưa vào code frontend.

### Tài khoản thử nghiệm

| Vai trò | Email | Mật khẩu |
| :--- | :--- | :--- |
| Quản trị viên | `admin@hometic.com` | `123456` |
| Khách hàng | `user@hometic.com` | `123456` |

### Chạy test

Backend (chạy trong thư mục `backend`, dùng môi trường ảo `.venv` mà script đã tạo):

```bash
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/python -m pytest
```

Frontend (chạy trong thư mục `frontend`):

```bash
npm run check
```

### Cập nhật database đã tạo từ phiên bản cũ

Database tạo mới đã có đủ cấu trúc. Nếu volume MySQL được tạo từ phiên bản trước, chạy các migration theo thứ tự:

```bash
docker exec -i hometic_db mysql -uroot --default-character-set=utf8mb4 hometic_db < database/migrations/001_ecommerce_hardening.sql
docker exec -i hometic_db mysql -uroot --default-character-set=utf8mb4 hometic_db < database/migrations/002_auth_hardening.sql
docker exec -i hometic_db mysql -uroot --default-character-set=utf8mb4 hometic_db < database/product-content.sql
```

### Khi deploy thật
1. Đặt `APP_ENV=production` và tạo `SECRET_KEY` mới:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(48))"
   ```
   Backend từ chối khởi động nếu khoá ngắn hơn 32 ký tự, và không tạo tài khoản thử nghiệm.
2. Xoá hoặc đổi mật khẩu các tài khoản mẫu.
3. Đặt mật khẩu cho MySQL và điền `MYSQL_PASSWORD` trong `backend/.env`.
4. Chạy backend sau Nginx/HTTPS với `uvicorn --proxy-headers`.

---

*Phát triển bởi Nhóm Tứ Linh — 2026*

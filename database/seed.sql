-- 1. Seed Categories
INSERT INTO categories (name, slug, description, image_url) VALUES 
('Gia dụng Nhà bếp', 'nha-bep', 'Thiết bị nấu nướng thông minh', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80'),
('Thiết bị vệ sinh', 've-sinh', 'Giải pháp làm sạch tự động', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'),
('Tiện ích phòng ngủ', 'phong-ngu', 'Chăm sóc giấc ngủ và không khí', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80');

-- 2. Seed Users
INSERT INTO users (email, password_hash, full_name, phone, birthday, gender, role) VALUES 
('admin@hometic.com', '$2b$12$K8M6v6W8I6Z8L8N8P8R8T8V8X8Z8', 'Quản trị viên Jane', '0901234567', '1995-05-20', 'Nữ', 'admin'),
('customer@hometic.com', '$2b$12$K8M6v6W8I6Z8L8N8P8R8T8V8X8Z8', 'Nguyễn Văn An', '0987654321', '1990-10-15', 'Nam', 'customer');

-- 3. Seed Products (Basic Info)
INSERT INTO products (id, category_id, name, slug, brand, price, sale_price, stock, image_url) VALUES 
(1, 1, 'Nồi cơm điện SmartCook Pro', 'smartcook-pro', 'Hometic', 2490000, 2190000, 50, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=520&q=80'),
(2, 1, 'Bếp từ đôi Hometic Dual', 'hometic-dual-induction', 'Hometic', 8900000, NULL, 20, 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=520&q=80'),
(3, 2, 'Robot hút bụi Hometic S9', 'hometic-s9-robot', 'Hometic', 7500000, 6900000, 30, 'https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?auto=format&fit=crop&w=520&q=80'),
(4, 2, 'Máy hút bụi cầm tay AirPure V1', 'airpure-v1-vacuum', 'Hometic', 1200000, NULL, 100, 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=520&q=80'),
(5, 3, 'Máy lọc không khí PureAir Pro', 'pureair-pro', 'Hometic', 3500000, 3200000, 40, 'https://images.unsplash.com/photo-1626430451221-0f3f12289c43?auto=format&fit=crop&w=520&q=80');

-- 3.1 Seed Product Details
INSERT INTO product_details (product_id, description, content, specifications, gallery_urls) VALUES 
(1, 'Nồi cơm điện cao tần thông minh 1.8L', '<p>Nồi cơm điện SmartCook Pro sử dụng công nghệ đốt nóng trong IH giúp cơm chín đều, thơm ngon...</p>', '{"Dung tích": "1.8L", "Công suất": "1200W", "Chống dính": "Có"}', '["img1.jpg", "img2.jpg"]'),
(2, 'Bếp từ đôi công suất lớn', '<p>Thiết kế sang trọng, mặt kính chịu nhiệt cao cấp...</p>', '{"Vùng nấu": "02", "Công suất": "4000W"}', '[]'),
(3, 'Robot hút bụi lau nhà LiDAR 3D', '<p>Tự động lập bản đồ, né tránh vật cản thông minh...</p>', '{"Lực hút": "4000Pa", "Pin": "5200mAh"}', '[]'),
(4, 'Máy hút bụi cầm tay không dây', '<p>Nhỏ gọn, tiện lợi cho việc vệ sinh ô tô và góc hẹp...</p>', '{"Lực hút": "15000Pa", "Trọng lượng": "1.2kg"}', '[]'),
(5, 'Máy lọc không khí HEPA H13', '<p>Loại bỏ 99.9% bụi mịn và vi khuẩn trong không khí...</p>', '{"Diện tích": "45m2", "Màng lọc": "HEPA H13"}', '[]');

-- 4. Seed Coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_discount_value, is_active) VALUES 
('HOMETIC10', 'percent', 10, 500000, 200000, TRUE),
('WELCOME50', 'fixed', 50000, 0, NULL, TRUE),
('GIAMGIAVIP', 'percent', 20, 2000000, 500000, TRUE);

-- 5. Seed Orders
INSERT INTO orders (order_code, user_id, coupon_id, subtotal, discount_amount, total_amount, status, payment_method, recipient_name, phone_number, shipping_address) VALUES 
('ORD-2026-001', 2, 1, 3500000, 200000, 3300000, 'shipped', 'banking', 'Nguyễn Văn An', '0987654321', '123 Đường Tôn Đức Thắng, Quận 1, TP. Hồ Chí Minh'),
('ORD-2026-002', 2, NULL, 1200000, 0, 1200000, 'delivered', 'cod', 'Nguyễn Văn An', '0987654321', '456 Đường Lê Lợi, Quận Hải Châu, TP. Đà Nẵng');

-- 5. Seed Order Items
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES 
(1, 5, 1, 3500000),
(2, 4, 1, 1200000);

-- 6. Seed Reviews
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES 
(2, 5, 5, 'Máy chạy êm, lọc bụi rất nhanh, phòng thoáng hẳn.'),
(2, 4, 4, 'Hút mạnh nhưng pin hơi nhanh hết, bù lại thiết kế đẹp.');

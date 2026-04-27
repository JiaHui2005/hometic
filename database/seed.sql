-- 1. Seed Categories (Cập nhật dựa trên hình ảnh)
-- Sử dụng logic: Thiết bị nhà bếp (Cha) -> Nồi cơm điện (Con), v.v.
INSERT INTO categories (name, slug, description, image_url, parent_id, is_active) VALUES
('Thiết bị nhà bếp', 'thiet-bi-nha-bep', 'Các loại máy móc dùng trong bếp', 'kitchen-appliances.jpg', NULL, TRUE),
('Dụng cụ làm bếp', 'dung-cu-lam-bep', 'Các bộ nồi, chảo và dao kéo', 'kitchen-tools.jpg', NULL, TRUE),
('Nồi cơm điện', 'noi-com-dien', 'Nồi cơm điện cao tần, nắp gài', 'rice-cooker.jpg', 1, TRUE),
('Bát đĩa', 'bat-dia', 'Bộ đồ ăn gốm sứ cao cấp', 'tableware.jpg', NULL, TRUE),
('Hộp đựng thực phẩm', 'hop-dung-thuc-pham', 'Hộp nhựa, hộp thủy tinh bảo quản', 'food-containers.jpg', NULL, TRUE);

-- 2. Seed Users (Giữ nguyên)
INSERT INTO users (email, password_hash, full_name, phone, birthday, gender, role) VALUES
('admin@hometic.com', '$2b$10$xyz...', 'Quản Trị Viên', '0901234567', '1990-01-01', 'Nam', 'admin'),
('nguyenvana@gmail.com', '$2b$10$abc...', 'Nguyễn Văn A', '0912345678', '1995-05-20', 'Nam', 'customer'),
('tran thị b@yahoo.com', '$2b$10$def...', 'Trần Thị B', '0988776655', '1998-12-12', 'Nữ', 'customer'),
('lethic@outlook.com', '$2b$10$ghi...', 'Lê Thị C', '0333444555', '2000-03-15', 'Nữ', 'customer'),
('phamvand@gmail.com', '$2b$10$jkl...', 'Phạm Văn D', '0777888999', '1992-08-30', 'Khác', 'customer');

-- 3. Seed Products (Sản phẩm khớp với Category mới)
INSERT INTO products (category_id, name, slug, price, sale_price, stock, image_url) VALUES
(3, 'Nồi cơm điện Cuckoo 1.8L', 'noi-com-dien-cuckoo-1-8l', 2500000, 2200000, 20, 'cuckoo-rice.jpg'),
(1, 'Bếp từ đơn Hometic', 'bep-tu-don-hometic', 1200000, 990000, 15, 'induction-stove.jpg'),
(5, 'Bộ 5 hộp nhựa Lock&Lock', 'bo-5-hop-nhua-lock-lock', 450000, NULL, 100, 'lock-lock-set.jpg'),
(4, 'Bộ bát đĩa sứ Minh Long', 'bo-bat-dia-su-minh-long', 1800000, 1500000, 10, 'minh-long-set.jpg'),
(2, 'Bộ nồi Inox 3 đáy', 'bo-noi-inox-3-day', 3500000, NULL, 8, 'inox-pot-set.jpg');

-- 4. Seed Product Details (Chi tiết sản phẩm)
INSERT INTO product_details (product_id, description, content, specifications, gallery_urls, warranty_info) VALUES
(1, 'Nồi cơm điện cao tần nhập khẩu Hàn Quốc', '<p>Nấu cơm ngon, giữ ấm lâu...</p>', '{"capacity": "1.8L", "power": "1200W"}', '["rc1.jpg", "rc2.jpg"]', '24 tháng'),
(2, 'Bếp từ công suất lớn, mặt kính chịu nhiệt', '<p>Tiết kiệm điện năng...</p>', '{"power": "2000W", "type": "Đơn"}', '["stove1.jpg"]', '12 tháng'),
(3, 'Hộp nhựa an toàn cho lò vi sóng', '<p>Chất liệu BPA Free...</p>', '{"material": "Nhựa PP", "quantity": 5}', '["box1.jpg"]', 'Không bảo hành'),
(4, 'Sứ trắng cao cấp vẽ vàng', '<p>Sang trọng cho bàn ăn gia đình...</p>', '{"pieces": 22, "material": "Sứ"}', '["ceramic1.jpg"]', 'Đổi trả 7 ngày'),
(5, 'Thép không gỉ 304 tiêu chuẩn châu Âu', '<p>Dùng được cho mọi loại bếp...</p>', '{"material": "Inox 304", "set": "3 món"}', '["pot1.jpg"]', '36 tháng');

-- 5. Seed Coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_discount_value, usage_limit) VALUES
('KITCHEN2024', 'percent', 10, 500000, 200000, 50),
('GIAM50K', 'fixed', 50000, 300000, NULL, 100),
('FREESHIP', 'fixed', 30000, 1000000, NULL, 500),
('HOMETIC5', 'percent', 5, 0, 50000, 200),
('SALEKHUNG', 'percent', 30, 5000000, 1000000, 10);

-- 6. Seed Orders
INSERT INTO orders (order_code, user_id, coupon_id, subtotal, discount_amount, total_amount, status, payment_method, recipient_name, phone_number, shipping_address) VALUES
('ORD-001', 2, 1, 2500000, 200000, 2300000, 'delivered', 'banking', 'Nguyễn Văn A', '0912345678', '123 Lê Lợi, Q1, HCM'),
('ORD-002', 3, NULL, 450000, 0, 450000, 'processing', 'cod', 'Trần Thị B', '0988776655', '456 Nguyễn Huệ, Q1, HCM'),
('ORD-003', 4, 2, 1800000, 50000, 1750000, 'pending', 'cod', 'Lê Thị C', '0333444555', '789 Trần Hưng Đạo, Q5, HCM'),
('ORD-004', 5, NULL, 3500000, 0, 3500000, 'shipped', 'banking', 'Phạm Văn D', '0777888999', '101 Phan Chu Trinh, Đà Nẵng'),
('ORD-005', 2, NULL, 1200000, 0, 1200000, 'cancelled', 'cod', 'Nguyễn Văn A', '0912345678', '123 Lê Lợi, Q1, HCM');

-- 7. Seed Order Items
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES
(1, 1, 1, 2500000),
(2, 3, 1, 450000),
(3, 4, 1, 1800000),
(4, 5, 1, 3500000),
(5, 2, 1, 1200000);

-- 8. Seed Reviews
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
(2, 1, 5, 'Nồi nấu cơm rất ngon, chín đều.'),
(3, 3, 4, 'Hộp chắc chắn, giao hàng hơi chậm xíu.'),
(4, 4, 5, 'Bát đĩa đẹp xuất sắc, đóng gói kỹ.'),
(5, 5, 4, 'Nồi dày dặn, dùng bếp từ bắt từ rất tốt.'),
(2, 2, 3, 'Bếp dùng ổn nhưng quạt hơi ồn.');
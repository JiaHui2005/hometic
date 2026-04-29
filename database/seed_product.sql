-- ==========================================
-- BỘ DỮ LIỆU MẪU: TMĐT POPO SERVICES (TỐI ƯU ID & GOM NHÓM)
-- ==========================================

-- 1. Seed Categories (Được quy hoạch lại ID tuần tự từ Cha -> Con -> Cháu)
INSERT INTO categories (id, name, slug, description, image_url, parent_id, is_active) VALUES
-- Cấp 0 (Cha)
(1, 'Điện gia dụng', 'dien-gia-dung', 'Sản phẩm gia dụng thiết yếu', NULL, NULL, TRUE),
(2, 'Nhà thông minh', 'nha-thong-minh', 'Thiết bị thông minh cho gia đình', NULL, NULL, TRUE),
(3, 'Điện lạnh', 'dien-lanh', 'Thiết bị làm mát và bảo quản', NULL, NULL, TRUE),
(4, 'Chăm sóc cá nhân', 'cham-soc-ca-nhan', 'Thiết bị chăm sóc sức khỏe và làm đẹp', NULL, NULL, TRUE),

-- Cấp 1 (Con)
(5, 'Nhà bếp', 'nha-bep', 'Thiết bị nhà bếp', NULL, 1, TRUE),
(6, 'Phòng khách', 'phong-khach', 'Thiết bị phòng khách', NULL, 1, TRUE),
(7, 'Thiết bị làm mát', 'thiet-bi-lam-mat', 'Tủ lạnh, máy lạnh, tủ đông', NULL, 3, TRUE),
(8, 'An ninh', 'an-ninh', 'Thiết bị an ninh', NULL, 2, TRUE),
(9, 'Đèn chiếu sáng', 'den-chieu-sang', 'Hệ thống đèn thông minh', NULL, 2, TRUE),
(10, 'Chăm sóc tóc', 'cham-soc-toc', 'Máy sấy, máy tạo kiểu', NULL, 4, TRUE),
(11, 'Theo dõi sức khỏe', 'theo-doi-suc-khoe', 'Cân điện tử, máy massage', NULL, 4, TRUE),

-- Cấp 2 (Cháu)
(12, 'Nồi chiên không dầu', 'noi-chien-khong-dau', 'Nồi chiên không dầu các loại', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 5, TRUE),
(13, 'Lò vi sóng', 'lo-vi-song', 'Lò vi sóng, lò nướng', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 5, TRUE),
(14, 'Quạt điện', 'quat-dien', 'Quạt đứng, quạt trần', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 6, TRUE),
(15, 'Máy lọc không khí', 'may-loc-khong-khi', 'Máy lọc không khí chuyên sâu', 'https://images.unsplash.com/photo-1626430451221-0f3f12289c43', 6, TRUE),
(16, 'Tủ lạnh Inverter', 'tu-lanh-inverter', 'Tủ lạnh tiết kiệm điện', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a', 7, TRUE),
(17, 'Máy lạnh 1 chiều', 'may-lanh-1-chieu', 'Điều hòa không khí 1 chiều', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 7, TRUE),
(18, 'Camera an ninh', 'camera-an-ninh', 'Camera IP, Camera ngoài trời', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 8, TRUE),
(19, 'Khóa cửa vân tay', 'khoa-cua-van-tay', 'Khóa cửa nhận diện vân tay', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 8, TRUE),
(20, 'Đèn LED thông minh', 'den-led-thong-minh', 'Đèn LED đổi màu qua App', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 9, TRUE),
(21, 'Máy sấy tóc', 'may-say-toc', 'Máy sấy tóc ion âm', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702', 10, TRUE),
(22, 'Cân sức khỏe điện tử', 'can-suc-khoe-dien-tu', 'Cân đo chỉ số cơ thể thông minh', 'https://images.unsplash.com/photo-1610484253163-999335f47055', 11, TRUE);


-- 2. Seed Users
INSERT INTO users (email, password_hash, full_name, phone, birthday, gender, role) VALUES
('admin@hometic1.com', '$2b$10$xyz...', 'Quản Trị Viên', '0901234567', '1990-01-01', 'Nam', 'admin'),
('nguyenvana@gmail.com', '$2b$10$abc...', 'Nguyễn Văn A', '0912345678', '1995-05-20', 'Nam', 'customer'),
('tranthib@yahoo.com', '$2b$10$def...', 'Trần Thị B', '0988776655', '1998-12-12', 'Nữ', 'customer'),
('lethic@outlook.com', '$2b$10$ghi...', 'Lê Thị C', '0333444555', '2000-03-15', 'Nữ', 'customer'),
('phamvand@gmail.com', '$2b$10$jkl...', 'Phạm Văn D', '0777888999', '1992-08-30', 'Khác', 'customer'),
('user@hometic.com', '$2b$12$QwUoxdrZ0q1S5CBwyYx0VeB2RHhwLuK3eEMutCvf3544sKWVNBtbe', 'user', '0394585077', '2026-04-21', 'Nam', 'customer'),
('admin@hometic.com', '$2b$12$nr6WJhqhsjdIkZW9tRZY4e3e8ZC.BIlkNJIZbMbvGM4ujskYDJm7a', 'admin', '0394585077', '2026-04-23', 'Nam', 'admin');


-- 3. Seed Products (ID được xếp liền mạch và gom theo nhóm danh mục)
INSERT INTO products (id, category_id, name, slug, brand, price, sale_price, stock, image_url, is_active) VALUES
-- Nhóm Nồi chiên không dầu (Cat 12)
(1, 12, 'Nồi chiên không dầu SmartCook 6L', 'noi-chien-khong-dau-smartcook-6l', 'SmartCook', 2490000, 2190000, 40, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
(2, 12, 'Nồi chiên không dầu Philips HD9252', 'noi-chien-khong-dau-philips-hd9252', 'Philips', 3500000, 3100000, 20, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
(3, 12, 'Nồi chiên không dầu điện tử Sunhouse Mama 5.5L', 'noi-chien-khong-dau-dien-tu-sunhouse-mama', 'Sunhouse', 2800000, 2350000, 35, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
-- Nhóm Lò vi sóng (Cat 13)
(4, 13, 'Lò vi sóng điện tử Sharp 20L', 'lo-vi-song-dien-tu-sharp-20l', 'Sharp', 1800000, 1450000, 50, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
(5, 13, 'Lò vi sóng tráng men Samsung 23L', 'lo-vi-song-trang-men-samsung-23l', 'Samsung', 2200000, 1950000, 45, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
-- Nhóm Quạt điện (Cat 14)
(6, 14, 'Quạt đứng Mitsubishi LV16-RV', 'quat-dung-mitsubishi-lv16-rv', 'Mitsubishi', 1900000, 1750000, 100, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
(7, 14, 'Quạt không cánh Dyson Purifier Cool', 'quat-khong-canh-dyson-purifier-cool', 'Dyson', 15990000, 14500000, 10, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
(8, 14, 'Quạt trần Panasonic 5 cánh có remote', 'quat-tran-panasonic-5-canh', 'Panasonic', 3200000, 2890000, 25, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
-- Nhóm Máy lọc không khí (Cat 15)
(9, 15, 'Máy lọc không khí Xiaomi Smart Air Purifier 4', 'may-loc-khong-khi-xiaomi-smart-air-purifier-4', 'Xiaomi', 4500000, 3990000, 30, 'https://images.unsplash.com/photo-1626430451221-0f3f12289c43?auto=format&fit=crop&w=900&q=80', TRUE),
(10, 15, 'Máy lọc không khí Coway Cartridge', 'may-loc-khong-khi-coway-cartridge', 'Coway', 5500000, 4890000, 20, 'https://images.unsplash.com/photo-1626430451221-0f3f12289c43?auto=format&fit=crop&w=900&q=80', TRUE),
-- Nhóm Camera an ninh (Cat 18)
(11, 18, 'Camera IP Wifi Ezviz C6N 1080P', 'camera-ip-wifi-ezviz-c6n-1080p', 'Ezviz', 800000, 550000, 80, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
(12, 18, 'Camera ngoài trời TP-Link Tapo C310', 'camera-ngoai-troi-tplink-tapo-c310', 'TP-Link', 950000, 750000, 65, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
-- Nhóm Khóa cửa vân tay (Cat 19)
(13, 19, 'Khóa cửa vân tay Xiaomi Smart Door Lock', 'khoa-cua-van-tay-xiaomi-smart-door-lock', 'Xiaomi', 6500000, 5990000, 15, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
(14, 19, 'Khóa cửa điện tử thông minh Hafele EL9000', 'khoa-cua-dien-tu-thong-minh-hafele-el9000', 'Hafele', 12500000, 11000000, 8, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
-- Nhóm Đèn LED thông minh (Cat 20)
(15, 20, 'Bóng đèn LED thông minh Philips Hue', 'bong-den-led-thong-minh-philips-hue', 'Philips', 1200000, 1050000, 60, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
(16, 20, 'Dây đèn LED RGB Yeelight Lightstrip Pro', 'day-den-led-rgb-yeelight-lightstrip-pro', 'Yeelight', 1500000, 1250000, 50, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
-- Nhóm Tủ lạnh & Máy lạnh (Cat 16, 17)
(17, 16, 'Tủ lạnh Samsung Inverter 236 lít', 'tu-lanh-samsung-inverter-236-lit', 'Samsung', 7500000, 6500000, 12, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80', TRUE),
(18, 17, 'Máy lạnh Panasonic Inverter 1 HP', 'may-lanh-panasonic-inverter-1-hp', 'Panasonic', 11500000, 10200000, 18, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
-- Nhóm Máy sấy & Cân điện tử (Cat 21, 22)
(19, 21, 'Máy sấy tóc Panasonic 2000W', 'may-say-toc-panasonic-2000w', 'Panasonic', 850000, 690000, 45, 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=80', TRUE),
(20, 22, 'Cân điện tử Xiaomi Mi Body Composition Scale 2', 'can-dien-tu-xiaomi-mi-body-composition', 'Xiaomi', 650000, 450000, 80, 'https://images.unsplash.com/photo-1610484253163-999335f47055?auto=format&fit=crop&w=900&q=80', TRUE);


-- 4. Seed Product Details (Khớp nối chính xác với ID Product mới)
INSERT INTO product_details (product_id, description, content, specifications, gallery_urls, warranty_info) VALUES
(1, 'Nồi chiên không dầu dung tích lớn', '<p>Nấu nướng dễ dàng, ít dầu mỡ...</p>', '{"capacity": "6L", "power": "1500W"}', '["img1.jpg", "img2.jpg"]', '12 tháng'),
(2, 'Công nghệ Rapid Air hiện đại', '<p>Giòn rụm bên ngoài, mềm ngọt bên trong...</p>', '{"capacity": "4.1L", "power": "1400W"}', '["img3.jpg"]', '24 tháng'),
(3, 'Bảng điều khiển cảm ứng đa chức năng', '<p>Lòng nồi chống dính cao cấp an toàn sức khỏe, 8 chế độ nấu cài đặt sẵn.</p>', '{"capacity": "5.5L", "power": "1700W"}', '["img12.jpg"]', '24 tháng'),
(4, 'Lò vi sóng hâm nóng, rã đông', '<p>Sử dụng dễ dàng với bảng điều khiển tiếng Việt...</p>', '{"capacity": "20L", "power": "800W"}', '["img4.jpg"]', '12 tháng'),
(5, 'Khoang lò tráng men Ceramic chống xước', '<p>Dễ dàng lau chùi, rã đông cực nhanh, thiết kế sang trọng cho gian bếp.</p>', '{"capacity": "23L", "power": "800W"}', '["img10.jpg", "img11.jpg"]', '12 tháng'),
(6, 'Quạt đứng động cơ bạc đạn êm ái', '<p>Có remote điều khiển từ xa, hẹn giờ thông minh...</p>', '{"power": "47W", "levels": 3}', '["img5.jpg"]', '12 tháng'),
(7, 'Quạt không cánh kết hợp lọc không khí', '<p>An toàn tuyệt đối cho trẻ nhỏ, kết nối app thông minh giám sát chất lượng không khí.</p>', '{"power": "40W", "noise": "35dB"}', '["img13.jpg", "img14.jpg"]', '24 tháng'),
(8, 'Quạt trần công suất cao, vận hành êm', '<p>Tích hợp cảm biến nhiệt độ tự động điều chỉnh tốc độ gió, remote tiện lợi.</p>', '{"wings": 5, "power": "70W"}', '["img15.jpg"]', '12 tháng'),
(9, 'Lọc bụi mịn PM2.5 hiệu quả', '<p>Điều khiển qua app Mi Home, cảnh báo bộ lọc...</p>', '{"cadr": "400m3/h", "noise": "32dB"}', '["img6.jpg"]', '12 tháng'),
(10, 'Màng lọc HEPA tối ưu không gian sống', '<p>Thiết kế tháo lắp dễ dàng, tự động cảnh báo thay màng lọc, phù hợp phòng ngủ.</p>', '{"cadr": "300m3/h", "noise": "28dB"}', '["img16.jpg"]', '12 tháng'),
(11, 'Camera xoay 360 độ an ninh', '<p>Theo dõi chuyển động, đàm thoại 2 chiều...</p>', '{"resolution": "1080p", "storage": "MicroSD"}', '["img7.jpg"]', '24 tháng'),
(12, 'Camera độ nét 3MP, chống nước IP66', '<p>Quan sát ban đêm sắc nét với hồng ngoại, còi hú báo động khi có xâm nhập.</p>', '{"resolution": "3MP", "storage": "MicroSD 128GB"}', '["img17.jpg"]', '24 tháng'),
(13, 'Mở khóa vân tay, mật khẩu, NFC', '<p>Bảo mật tuyệt đối cho ngôi nhà...</p>', '{"methods": 6, "battery": "18 tháng"}', '["img8.jpg"]', '12 tháng'),
(14, 'Kiểu dáng Push & Pull hiện đại', '<p>Vân tay quang học siêu nhạy, tích hợp thẻ từ và chìa cơ dự phòng.</p>', '{"methods": 5, "battery": "12 tháng"}', '["img18.jpg", "img19.jpg"]', '24 tháng'),
(15, 'Bóng đèn đổi 16 triệu màu', '<p>Điều khiển giọng nói qua Google Assistant, Alexa...</p>', '{"colors": "16 triệu", "power": "9W"}', '["img9.jpg"]', '24 tháng'),
(16, 'Dây đèn LED dán tường thông minh', '<p>Đồng bộ ánh sáng theo nhạc hoặc màn hình máy tính, tương thích Razer Chroma.</p>', '{"colors": "16 triệu", "length": "2 mét"}', '["img20.jpg"]', '12 tháng'),
(17, 'Tủ lạnh ngăn đá trên, tiết kiệm điện', '<p>Công nghệ Digital Inverter vận hành êm ái, bộ lọc than hoạt tính khử mùi hiệu quả.</p>', '{"capacity": "236L", "technology": "Inverter"}', '["img21.jpg"]', '24 tháng'),
(18, 'Làm lạnh nhanh, chế độ ngủ đêm êm ái', '<p>Công nghệ Nanoe-G lọc sạch bụi mịn, luồng gió dễ chịu không thổi trực tiếp vào người.</p>', '{"power": "1 HP", "gas": "R32"}', '["img22.jpg"]', '12 tháng'),
(19, 'Sấy khô nhanh, bảo vệ tóc với ion âm', '<p>Công suất mạnh mẽ, có chế độ sấy mát giúp cố định nếp tóc và bảo vệ da đầu.</p>', '{"power": "2000W", "modes": 3}', '["img23.jpg"]', '12 tháng'),
(20, 'Đo lường 13 chỉ số cơ thể chuẩn xác', '<p>Mặt kính cường lực sang trọng, kết nối app Zepp Life theo dõi sức khỏe mỗi ngày.</p>', '{"max_weight": "150kg", "bluetooth": "5.0"}', '["img24.jpg"]', '12 tháng');


-- 5. Seed Coupons
INSERT INTO coupons (id, code, discount_type, discount_value, min_order_value, max_discount_value, usage_limit) VALUES
(1, 'KITCHEN2024', 'percent', 10, 500000, 200000, 50),
(2, 'GIAM50K', 'fixed', 50000, 300000, NULL, 100),
(3, 'FREESHIP', 'fixed', 30000, 1000000, NULL, 500),
(4, 'HOMETIC5', 'percent', 5, 0, 50000, 200),
(5, 'SALEKHUNG', 'percent', 30, 5000000, 1000000, 10);


-- 6. Seed Reviews (Cập nhật lại product_id khớp với bảng Products mới)
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
(2, 1, 5, 'Nồi chiên dùng cực thích, chín đều và dễ rửa.'),
(3, 4, 4, 'Lò vi sóng đẹp, hâm đồ ăn rất nhanh.'),
(4, 6, 5, 'Quạt chạy êm không tiếng động, rất phù hợp phòng ngủ.'),
(5, 9, 5, 'Lọc không khí tốt, từ lúc dùng bớt hẳn bụi mịn trong nhà.'),
(2, 11, 4, 'Camera nét, đàm thoại rõ ràng.'),
(4, 18, 5, 'Máy lạnh Panasonic chạy siêu êm, mát lạnh rất nhanh.'),
(5, 20, 5, 'Cân hiển thị rõ ràng, kết nối app đo được nhiều chỉ số rất tiện.');
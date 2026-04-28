-- ==========================================
-- BỘ DỮ LIỆU MẪU: DANH MỤC 3 CẤP & SẢN PHẨM
-- ==========================================

-- 1. Seed Categories (3 cấp)
INSERT INTO categories (id, name, slug, description, image_url, parent_id, is_active) VALUES
-- Cấp 0 (Cha)
(1, 'Điện gia dụng', 'dien-gia-dung', 'Sản phẩm gia dụng thiết yếu', NULL, NULL, TRUE),
(2, 'Nhà thông minh', 'nha-thong-minh', 'Thiết bị thông minh cho gia đình', NULL, NULL, TRUE),

-- Cấp 1 (Con)
(3, 'Nhà bếp', 'nha-bep', 'Thiết bị nhà bếp', NULL, 1, TRUE),
(4, 'Phòng khách', 'phong-khach', 'Thiết bị phòng khách', NULL, 1, TRUE),
(5, 'An ninh', 'an-ninh', 'Thiết bị an ninh', NULL, 2, TRUE),
(6, 'Đèn chiếu sáng', 'den-chieu-sang', 'Hệ thống đèn thông minh', NULL, 2, TRUE),

-- Cấp 2 (Cháu - Thuộc Cấp 1)
(7, 'Nồi chiên không dầu', 'noi-chien-khong-dau', 'Nồi chiên không dầu các loại', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 3, TRUE),
(8, 'Lò vi sóng', 'lo-vi-song', 'Lò vi sóng, lò nướng', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 3, TRUE),
(9, 'Quạt điện', 'quat-dien', 'Quạt đứng, quạt trần', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 4, TRUE),
(10, 'Máy lọc không khí', 'may-loc-khong-khi', 'Máy lọc không khí chuyên sâu', 'https://images.unsplash.com/photo-1626430451221-0f3f12289c43', 4, TRUE),
(11, 'Camera an ninh', 'camera-an-ninh', 'Camera IP, Camera ngoài trời', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 5, TRUE),
(12, 'Khóa cửa vân tay', 'khoa-cua-van-tay', 'Khóa cửa nhận diện vân tay', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 5, TRUE),
(13, 'Đèn LED thông minh', 'den-led-thong-minh', 'Đèn LED đổi màu qua App', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 6, TRUE);

-- 3. Seed Products (Sản phẩm thuộc Category Cấp 2)
INSERT INTO products (id, category_id, name, slug, brand, price, sale_price, stock, image_url, is_active) VALUES
(1, 7, 'Nồi chiên không dầu SmartCook 6L', 'noi-chien-khong-dau-smartcook-6l', 'SmartCook', 2490000, 2190000, 40, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
(2, 7, 'Nồi chiên không dầu Philips HD9252', 'noi-chien-khong-dau-philips-hd9252', 'Philips', 3500000, 3100000, 20, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
(3, 8, 'Lò vi sóng điện tử Sharp 20L', 'lo-vi-song-dien-tu-sharp-20l', 'Sharp', 1800000, 1450000, 50, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
(4, 9, 'Quạt đứng Mitsubishi LV16-RV', 'quat-dung-mitsubishi-lv16-rv', 'Mitsubishi', 1900000, 1750000, 100, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
(5, 10, 'Máy lọc không khí Xiaomi Smart Air Purifier 4', 'may-loc-khong-khi-xiaomi-smart-air-purifier-4', 'Xiaomi', 4500000, 3990000, 30, 'https://images.unsplash.com/photo-1626430451221-0f3f12289c43?auto=format&fit=crop&w=900&q=80', TRUE),
(6, 11, 'Camera IP Wifi Ezviz C6N 1080P', 'camera-ip-wifi-ezviz-c6n-1080p', 'Ezviz', 800000, 550000, 80, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
(7, 12, 'Khóa cửa vân tay Xiaomi Smart Door Lock', 'khoa-cua-van-tay-xiaomi-smart-door-lock', 'Xiaomi', 6500000, 5990000, 15, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE),
(8, 13, 'Bóng đèn LED thông minh Philips Hue', 'bong-den-led-thong-minh-philips-hue', 'Philips', 1200000, 1050000, 60, 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80', TRUE);


-- 4. Seed Product Details (Chi tiết sản phẩm)
INSERT INTO product_details (product_id, description, content, specifications, gallery_urls, warranty_info) VALUES
(1, 'Nồi chiên không dầu dung tích lớn', '<p>Nấu nướng dễ dàng, ít dầu mỡ...</p>', '{"capacity": "6L", "power": "1500W"}', '["img1.jpg", "img2.jpg"]', '12 tháng'),
(2, 'Công nghệ Rapid Air hiện đại', '<p>Giòn rụm bên ngoài, mềm ngọt bên trong...</p>', '{"capacity": "4.1L", "power": "1400W"}', '["img3.jpg"]', '24 tháng'),
(3, 'Lò vi sóng hâm nóng, rã đông', '<p>Sử dụng dễ dàng với bảng điều khiển tiếng Việt...</p>', '{"capacity": "20L", "power": "800W"}', '["img4.jpg"]', '12 tháng'),
(4, 'Quạt đứng động cơ bạc đạn êm ái', '<p>Có remote điều khiển từ xa, hẹn giờ thông minh...</p>', '{"power": "47W", "levels": 3}', '["img5.jpg"]', '12 tháng'),
(5, 'Lọc bụi mịn PM2.5 hiệu quả', '<p>Điều khiển qua app Mi Home, cảnh báo bộ lọc...</p>', '{"cadr": "400m3/h", "noise": "32dB"}', '["img6.jpg"]', '12 tháng'),
(6, 'Camera xoay 360 độ an ninh', '<p>Theo dõi chuyển động, đàm thoại 2 chiều...</p>', '{"resolution": "1080p", "storage": "MicroSD"}', '["img7.jpg"]', '24 tháng'),
(7, 'Mở khóa vân tay, mật khẩu, NFC', '<p>Bảo mật tuyệt đối cho ngôi nhà...</p>', '{"methods": 6, "battery": "18 tháng"}', '["img8.jpg"]', '12 tháng'),
(8, 'Bóng đèn đổi 16 triệu màu', '<p>Điều khiển giọng nói qua Google Assistant, Alexa...</p>', '{"colors": "16 triệu", "power": "9W"}', '["img9.jpg"]', '24 tháng');


-- 5. Seed Coupons
INSERT INTO coupons (id, code, discount_type, discount_value, min_order_value, max_discount_value, usage_limit) VALUES
(1, 'KITCHEN2024', 'percent', 10, 500000, 200000, 50),
(2, 'GIAM50K', 'fixed', 50000, 300000, NULL, 100),
(3, 'FREESHIP', 'fixed', 30000, 1000000, NULL, 500),
(4, 'HOMETIC5', 'percent', 5, 0, 50000, 200),
(5, 'SALEKHUNG', 'percent', 30, 5000000, 1000000, 10);


-- 8. Seed Reviews
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
(2, 1, 5, 'Nồi chiên dùng cực thích, chín đều và dễ rửa.'),
(3, 3, 4, 'Lò vi sóng đẹp, hâm đồ ăn rất nhanh.'),
(4, 4, 5, 'Quạt chạy êm không tiếng động, rất phù hợp phòng ngủ.'),
(5, 5, 5, 'Lọc không khí tốt, từ lúc dùng bớt hẳn bụi mịn trong nhà.'),
(2, 6, 4, 'Camera nét, đàm thoại rõ ràng.');

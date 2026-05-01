-- ==========================================
-- BỔ SUNG THÊM DANH MỤC VÀ SẢN PHẨM MỚI 
-- (Categories ID: 23-30 | Products ID: 41-50)
-- ==========================================

-- 1. Bổ sung Categories
INSERT INTO categories (id, name, slug, description, image_url, parent_id, is_active) VALUES
-- Cấp 0 (Cha)
(23, 'Chăm sóc nhà cửa', 'cham-soc-nha-cua', 'Thiết bị vệ sinh và làm sạch nhà cửa', NULL, NULL, TRUE),
(27, 'Thiết bị giải trí', 'thiet-bi-giai-tri', 'Thiết bị nghe nhìn và giải trí gia đình', NULL, NULL, TRUE),

-- Cấp 1 (Con)
(24, 'Làm sạch không gian', 'lam-sach-khong-gian', 'Robot hút bụi và máy hút bụi', NULL, 23, TRUE),
(28, 'Nghe nhìn', 'nghe-nhin', 'Tivi và hệ thống âm thanh', NULL, 27, TRUE),

-- Cấp 2 (Cháu)
(25, 'Robot hút bụi', 'robot-hut-bui', 'Robot hút bụi lau nhà thông minh', 'http://localhost:8000/static/uploads/cat_robot.png', 24, TRUE),
(26, 'Máy hút bụi cầm tay', 'may-hut-bui-cam-tay', 'Máy hút bụi không dây tiện lợi', 'http://localhost:8000/static/uploads/cat_hutbui.webp', 24, TRUE),
(29, 'Tivi thông minh', 'tivi-thong-minh', 'Smart Tivi 4K, OLED', 'http://localhost:8000/static/uploads/cat_tivi.jpg', 28, TRUE),
(30, 'Loa Soundbar', 'loa-soundbar', 'Loa thanh Soundbar xem phim', 'http://localhost:8000/static/uploads/cat_soundbar.jpg', 28, TRUE);


-- 2. Bổ sung Products
INSERT INTO products (id, category_id, name, slug, brand, price, sale_price, stock, image_url, is_active) VALUES
-- Nhóm Robot hút bụi (Cat 25)
(41, 25, 'Robot hút bụi lau nhà Roborock S8 Pro Ultra', 'robot-hut-bui-roborock-s8-pro-ultra', 'Roborock', 24900000, 22500000, 10, 'http://localhost:8000/static/uploads/roborock-s8.jpg', TRUE),
(42, 25, 'Robot hút bụi Ecovacs Deebot T20 Omni', 'robot-hut-bui-ecovacs-deebot-t20-omni', 'Ecovacs', 19500000, 17900000, 15, 'http://localhost:8000/static/uploads/ecovacs-t20.jpg', TRUE),
(43, 25, 'Robot lau kính thông minh Ecovacs Winbot', 'robot-lau-kinh-ecovacs-winbot', 'Ecovacs', 8500000, 7200000, 20, 'http://localhost:8000/static/uploads/ecovacs-winbot.jpg', TRUE),

-- Nhóm Máy hút bụi cầm tay (Cat 26)
(44, 26, 'Máy hút bụi không dây Dyson V15 Detect', 'may-hut-bui-khong-day-dyson-v15-detect', 'Dyson', 19900000, 18500000, 8, 'http://localhost:8000/static/uploads/dyson-v15.webp', TRUE),
(45, 26, 'Máy hút bụi cầm tay Xiaomi Vacuum Cleaner G11', 'may-hut-bui-xiaomi-vacuum-g11', 'Xiaomi', 6500000, 5800000, 35, 'http://localhost:8000/static/uploads/xiaomi-g11.png', TRUE),

-- Nhóm Tivi thông minh (Cat 29)
(46, 29, 'Smart Tivi Samsung 4K 65 inch', 'smart-tivi-samsung-4k-65-inch', 'Samsung', 18500000, 16900000, 12, 'http://localhost:8000/static/uploads/tivi-samsung-65.jpg', TRUE),
(47, 29, 'Android Tivi Sony 4K 55 inch', 'android-tivi-sony-4k-55-inch', 'Sony', 16000000, 14500000, 18, 'http://localhost:8000/static/uploads/tivi-sony-55.jpg', TRUE),
(48, 29, 'Smart Tivi LG OLED 55 inch', 'smart-tivi-lg-oled-55-inch', 'LG', 28000000, 25500000, 5, 'http://localhost:8000/static/uploads/tivi-lg-oled.jpg', TRUE),

-- Nhóm Loa Soundbar (Cat 30)
(49, 30, 'Loa Soundbar Samsung HW-Q600B', 'loa-soundbar-samsung-hw-q600b', 'Samsung', 5500000, 4200000, 25, 'http://localhost:8000/static/uploads/soundbar-samsung.webp', TRUE),
(50, 30, 'Loa Soundbar Sony HT-S400', 'loa-soundbar-sony-ht-s400', 'Sony', 4800000, 3990000, 30, 'http://localhost:8000/static/uploads/soundbar-sony.jpg', TRUE);


-- 3. Bổ sung Product_Details (Khớp nối với ID từ 41 - 50)
INSERT INTO product_details (product_id, description, content, specifications, gallery_urls, warranty_info) VALUES
(41, 'Trạm sạc đa năng tự động hoàn toàn', '<p>Tự động giặt giẻ, sấy khô bằng khí nóng, tự động đổ rác cực kỳ tiện lợi.</p>', '{"suction": "6000Pa", "battery": "5200mAh"}', '["img_robo_s8_1.jpg"]', '24 tháng'),
(42, 'Công nghệ giặt giẻ nước nóng 55 độ C', '<p>Giúp hòa tan dầu mỡ dễ dàng, tự động nâng giẻ khi gặp thảm.</p>', '{"suction": "6000Pa", "battery": "5200mAh"}', '["img_eco_t20_1.jpg"]', '24 tháng'),
(43, 'Công nghệ phun nước tự động chéo', '<p>Lực hút bám kính cực mạnh, có dây an toàn chống rơi, làm sạch cửa sổ hoàn hảo.</p>', '{"power": "75W", "noise": "70dB"}', '["img_winbot_1.jpg"]', '12 tháng'),
(44, 'Cảm biến Piezo đếm hạt bụi', '<p>Công nghệ tia laser xanh giúp phát hiện bụi siêu nhỏ vô hình trên sàn nhà.</p>', '{"power": "240AW", "runtime": "60 phút"}', '["img_dyson_v15_1.jpg"]', '24 tháng'),
(45, 'Đầu hút chống rối tóc hiệu quả', '<p>Lực hút mạnh mẽ, màn hình LCD hiển thị trạng thái và thời lượng pin.</p>', '{"power": "185AW", "runtime": "60 phút"}', '["img_mi_g11_1.jpg"]', '12 tháng'),
(46, 'Bộ xử lý Crystal 4K', '<p>Thiết kế không viền 3 cạnh, công nghệ HDR tăng cường độ tương phản.</p>', '{"size": "65 inch", "resolution": "4K"}', '["img_ss_tv_1.jpg"]', '24 tháng'),
(47, 'Công nghệ tạo màu Triluminos PRO', '<p>Hệ điều hành Google TV, tìm kiếm bằng giọng nói tiếng Việt rảnh tay.</p>', '{"size": "55 inch", "resolution": "4K"}', '["img_sony_tv_1.jpg"]', '24 tháng'),
(48, 'Điểm ảnh tự phát sáng độc lập', '<p>Màu đen sâu thẳm, viền siêu mỏng sang trọng như một bức tranh nghệ thuật.</p>', '{"size": "55 inch", "technology": "OLED"}', '["img_lg_oled_1.jpg"]', '24 tháng'),
(49, 'Âm thanh vòm chuẩn Dolby Atmos', '<p>Công nghệ Q-Symphony đồng bộ âm thanh hoàn hảo với Tivi Samsung.</p>', '{"power": "360W", "channels": "3.1.2"}', '["img_ss_soundbar_1.jpg"]', '12 tháng'),
(50, 'Âm thanh vòm giả lập S-Force PRO', '<p>Loa subwoofer không dây với củ loa lớn 160mm cho âm trầm sâu lắng.</p>', '{"power": "330W", "channels": "2.1"}', '["img_sony_soundbar_1.jpg"]', '12 tháng');
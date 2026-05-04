-- ==========================================
-- BỔ SUNG THÊM 20 SẢN PHẨM MỚI (ID: 21 - 40)
-- ==========================================

-- Thêm vào bảng Products
INSERT INTO products (id, category_id, name, slug, brand, price, sale_price, stock, image_url, is_active) VALUES
-- Thêm Nồi chiên không dầu (Cat 12)
(21, 12, 'Nồi chiên không dầu Tefal 4.2L', 'noi-chien-khong-dau-tefal-4-2l', 'Tefal', 2500000, 1990000, 20, 'static/uploads/tefal-42l.jpg', TRUE),
(22, 12, 'Nồi chiên không dầu Lock&Lock 5.2L', 'noi-chien-khong-dau-lock-lock-5-2l', 'Lock&Lock', 3200000, 2550000, 15, 'static/uploads/locknlock-52l.webp', TRUE),

-- Thêm Lò vi sóng / Lò nướng (Cat 13)
(23, 13, 'Lò vi sóng Electrolux 23L', 'lo-vi-song-electrolux-23l', 'Electrolux', 2100000, 1850000, 30, 'static/uploads/lvs-electrolux.avif', TRUE),
(24, 13, 'Lò nướng điện Sanaky 50L', 'lo-nuong-dien-sanaky-50l', 'Sanaky', 1950000, 1650000, 25, 'static/uploads/lo-nuong-sanaky.jpg', TRUE),

-- Thêm Quạt điện / Quạt điều hòa (Cat 14)
(25, 14, 'Quạt điều hòa Sunhouse Boss', 'quat-dieu-hoa-sunhouse-boss', 'Sunhouse', 4500000, 3790000, 18, 'static/uploads/quat-dieu-hoa-sunhouse.jpg', TRUE),
(26, 14, 'Quạt treo tường Senko có remote', 'quat-treo-tuong-senko-remote', 'Senko', 550000, 480000, 50, 'static/uploads/quat-treo-senko.jpg', TRUE),

-- Thêm Máy lọc không khí (Cat 15)
(27, 15, 'Máy lọc không khí Sharp FP-J30E-A', 'may-loc-khong-khi-sharp-fp-j30e-a', 'Sharp', 2500000, 1990000, 40, 'static/uploads/sharp-air-purifier.png', TRUE),
(28, 15, 'Máy lọc không khí Daikin MC30VVM-A', 'may-loc-khong-khi-daikin-mc30vvm', 'Daikin', 3800000, 3200000, 20, 'static/uploads/daikin-air.jpg', TRUE),

-- Thêm Tủ lạnh (Cat 16)
(29, 16, 'Tủ lạnh LG Inverter 315 Lít', 'tu-lanh-lg-inverter-315-lit', 'LG', 9500000, 8490000, 10, 'static/uploads/tu-lanh-lg.jpg', TRUE),
(30, 16, 'Tủ lạnh Aqua Inverter 189 Lít', 'tu-lanh-aqua-inverter-189-lit', 'Aqua', 5500000, 4990000, 25, 'static/uploads/tu-lanh-aqua.png', TRUE),

-- Thêm Máy lạnh (Cat 17)
(31, 17, 'Máy lạnh Daikin Inverter 1.5 HP', 'may-lanh-daikin-inverter-1-5-hp', 'Daikin', 13500000, 12200000, 15, 'static/uploads/may-lanh-daikin.jpg', TRUE),
(32, 17, 'Máy lạnh LG Inverter 1 HP Wifi', 'may-lanh-lg-inverter-1-hp-wifi', 'LG', 10500000, 9300000, 20, 'static/uploads/may-lanh-lg.jpg', TRUE),

-- Thêm Camera an ninh (Cat 18)
(33, 18, 'Camera IP Wifi Imou Ranger 2', 'camera-ip-wifi-imou-ranger-2', 'Imou', 650000, 490000, 100, 'static/uploads/imou-ranger2.jpg', TRUE),
(34, 18, 'Camera ngoài trời KBVision 4MP', 'camera-ngoai-troi-kbvision-4mp', 'KBVision', 1200000, 950000, 45, 'static/uploads/kbvision-4mp.jpg', TRUE),

-- Thêm Khóa cửa vân tay (Cat 19)
(35, 19, 'Khóa cửa thông minh Samsung SHP-DP738', 'khoa-cua-thong-minh-samsung-shp-dp738', 'Samsung', 11500000, 9900000, 12, 'static/uploads/khoa-samsung.jpg', TRUE),
(36, 19, 'Khóa cửa nhôm xingfa Kaimi', 'khoa-cua-nhom-xingfa-kaimi', 'Kaimi', 4500000, 3800000, 30, 'static/uploads/khoa-kaimi.jpg', TRUE),

-- Thêm Đèn LED thông minh (Cat 20)
(37, 20, 'Bóng đèn thông minh Xiaomi Mi LED Smart Bulb', 'bong-den-thong-minh-xiaomi', 'Xiaomi', 350000, 250000, 80, 'static/uploads/xiaomi-bulb.jpg', TRUE),
(38, 20, 'Đèn ốp trần thông minh Rạng Đông', 'den-op-tran-thong-minh-rang-dong', 'Rạng Đông', 1500000, 1250000, 40, 'static/uploads/den-rang-dong.jpg', TRUE),

-- Thêm Máy sấy tóc (Cat 21)
(39, 21, 'Máy tạo kiểu tóc Dyson Airwrap', 'may-tao-kieu-toc-dyson-airwrap', 'Dyson', 15500000, 14900000, 5, 'static/uploads/dyson-airwrap.jpg', TRUE),

-- Thêm Cân điện tử / Máy massage (Cat 22)
(40, 22, 'Máy massage cổ thông minh Xiaomi Jeeback', 'may-massage-co-xiaomi-jeeback', 'Xiaomi', 1200000, 950000, 50, 'static/uploads/massage-jeeback.jpg', TRUE);


-- Thêm vào bảng Product_Details (Khớp nối chính xác với ID Product từ 21 - 40)
INSERT INTO product_details (product_id, description, content, specifications, gallery_urls, warranty_info) VALUES
(21, 'Công nghệ luồng khí nóng 3D', '<p>Giúp thức ăn chín đều, vàng giòn mà không cần trở mặt.</p>', '{"capacity": "4.2L", "power": "1500W"}', '["img_tefal1.jpg"]', '24 tháng'),
(22, 'Dung tích lớn cho cả gia đình', '<p>Lòng nồi phủ chống dính cao cấp, dễ dàng vệ sinh sau khi dùng.</p>', '{"capacity": "5.2L", "power": "1800W"}', '["img_lock1.jpg"]', '12 tháng'),
(23, 'Lò vi sóng cơ bền bỉ', '<p>Thiết kế sang trọng, dễ sử dụng với 5 mức công suất vi sóng.</p>', '{"capacity": "23L", "power": "800W"}', '["img_elec1.jpg"]', '24 tháng'),
(24, 'Lò nướng chuyên dụng làm bánh', '<p>Quạt đối lưu giúp nhiệt tỏa đều, kèm xiên quay thịt nướng tiện lợi.</p>', '{"capacity": "50L", "power": "2000W"}', '["img_sanaky1.jpg"]', '12 tháng'),
(25, 'Làm mát không gian mở hiệu quả', '<p>Tích hợp khay đá khô, làm mát nhanh chóng vào mùa hè oi bức.</p>', '{"water_tank": "40L", "power": "120W"}', '["img_boss1.jpg"]', '12 tháng'),
(26, 'Tiết kiệm không gian phòng', '<p>Điều khiển bằng remote, có chế độ gió tự nhiên êm ái.</p>', '{"wings": 3, "power": "47W"}', '["img_senko1.jpg"]', '12 tháng'),
(27, 'Lọc bụi mịn và diệt khuẩn', '<p>Công nghệ Plasmacluster ion độc quyền, mật độ ion cao.</p>', '{"area": "23m2", "noise": "44dB"}', '["img_sharp1.jpg"]', '12 tháng'),
(28, 'Cảm biến bụi độ nhạy cao', '<p>Màng lọc tĩnh điện HEPA hút bụi hiệu quả, không lo tắc nghẽn.</p>', '{"area": "21m2", "noise": "44dB"}', '["img_daikin1.jpg"]', '12 tháng'),
(29, 'Ngăn đá trên truyền thống', '<p>Công nghệ làm lạnh đa chiều, kháng khuẩn khử mùi Hygiene Fresh+.</p>', '{"capacity": "315L", "technology": "Inverter"}', '["img_lg_fridge.jpg"]', '24 tháng'),
(30, 'Thiết kế mặt thép vân phay', '<p>Khay kính chịu lực, ngăn rau quả giữ ẩm tối ưu.</p>', '{"capacity": "189L", "technology": "Inverter"}', '["img_aqua.jpg"]', '24 tháng'),
(31, 'Làm lạnh nhanh Powerful', '<p>Phin lọc Enzyme Blue khử mùi, chống ẩm mốc hiệu quả.</p>', '{"power": "1.5 HP", "gas": "R32"}', '["img_daikin_ac.jpg"]', '12 tháng'),
(32, 'Điều khiển qua điện thoại thông minh', '<p>Kết nối wifi tích hợp, tiết kiệm điện năng tới 70%.</p>', '{"power": "1 HP", "gas": "R32"}', '["img_lg_ac.jpg"]', '24 tháng'),
(33, 'Phát hiện con người bằng AI', '<p>Báo động âm thanh bất thường, còi hú tích hợp sẵn.</p>', '{"resolution": "1080p", "storage": "MicroSD 256GB"}', '["img_imou.jpg"]', '24 tháng'),
(34, 'Camera thân trụ siêu nét', '<p>Chuẩn chống nước IP67, tầm nhìn hồng ngoại ban đêm 30m.</p>', '{"resolution": "4MP", "storage": "MicroSD 256GB"}', '["img_kbvision.jpg"]', '24 tháng'),
(35, 'Khóa cửa cao cấp phong cách Push-Pull', '<p>Tích hợp Bluetooth mở khóa qua điện thoại, báo động cháy nổ.</p>', '{"methods": 5, "battery": "10 tháng"}', '["img_samlock.jpg"]', '12 tháng'),
(36, 'Chuyên dụng cho cửa nhôm hệ', '<p>Kháng nước tốt, thiết kế ruột khóa hẹp phù hợp mọi loại cửa nhôm.</p>', '{"methods": 4, "battery": "12 tháng"}', '["img_kaimi.jpg"]', '12 tháng'),
(37, 'Đổi màu theo nhịp điệu', '<p>Đồng bộ hệ sinh thái Mi Home, điều khiển giọng nói qua Google.</p>', '{"colors": "16 triệu", "power": "8W"}', '["img_mibulb.jpg"]', '12 tháng'),
(38, 'Chiếu sáng thông minh toàn diện', '<p>Thay đổi nhiệt độ màu từ vàng sang trắng, kết nối Bluetooth Mesh.</p>', '{"color_temp": "3000K-6500K", "power": "24W"}', '["img_rangdong.jpg"]', '24 tháng'),
(39, 'Tạo kiểu không dùng nhiệt độ cao', '<p>Sử dụng hiệu ứng Coanda để hút và cuộn tóc, bảo vệ tóc tối đa.</p>', '{"power": "1300W", "accessories": 6}', '["img_dyson.jpg"]', '24 tháng'),
(40, 'Massage công nghệ TENS', '<p>Nhiệt độ không đổi 42 độ C, thiết kế hình chữ U ôm sát cổ.</p>', '{"modes": 4, "battery": "8 ngày"}', '["img_jeeback.jpg"]', '12 tháng');
-- Nâng cấp DB đang chạy (đã tạo từ schema.sql cũ). DB mới tạo từ schema.sql hiện tại đã có sẵn, KHÔNG cần chạy.
-- Chạy 1 lần:
--   docker exec -i hometic_db mysql -uroot --default-character-set=utf8mb4 hometic_db < database/migrations/001_ecommerce_hardening.sql
SET NAMES utf8mb4;

-- 1. Dữ liệu giới tính sai định dạng (vd. chuỗi rỗng) -> NULL
UPDATE users SET gender = NULL WHERE gender = '';

-- 2. Mỗi người chỉ giữ 1 bản ghi mã giảm giá / 1 đánh giá cho mỗi sản phẩm (giữ bản cũ nhất)
DELETE uc FROM user_coupons uc
JOIN user_coupons older ON older.user_id = uc.user_id AND older.coupon_id = uc.coupon_id AND older.id < uc.id;
DELETE r FROM reviews r
JOIN reviews older ON older.user_id = r.user_id AND older.product_id = r.product_id AND older.id < r.id;

ALTER TABLE user_coupons
    ADD CONSTRAINT uq_user_coupon UNIQUE (user_id, coupon_id),
    DROP INDEX idx_user_id;

ALTER TABLE reviews
    ADD CONSTRAINT uq_review_user_product UNIQUE (user_id, product_id),
    ADD INDEX idx_reviews_product_created (product_id, created_at);

-- 3. Không cho xoá user / sản phẩm / danh mục khi còn đơn hàng hoặc sản phẩm tham chiếu (giữ lịch sử doanh thu)
ALTER TABLE orders DROP FOREIGN KEY orders_ibfk_1;
ALTER TABLE orders ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;
ALTER TABLE order_items DROP FOREIGN KEY order_items_ibfk_2;
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;
ALTER TABLE products DROP FOREIGN KEY products_ibfk_1;
ALTER TABLE products ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;

-- 4. Ràng buộc CHECK: lớp chặn cuối nếu code có lỗi
ALTER TABLE products
    ADD CONSTRAINT chk_products_price CHECK (price >= 0),
    ADD CONSTRAINT chk_products_sale_price CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price <= price)),
    ADD CONSTRAINT chk_products_stock CHECK (stock >= 0);
ALTER TABLE order_items
    ADD CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
    ADD CONSTRAINT chk_order_items_price CHECK (price_at_purchase >= 0);
ALTER TABLE orders
    ADD CONSTRAINT chk_orders_amounts CHECK (subtotal >= 0 AND discount_amount >= 0 AND total_amount >= 0);
ALTER TABLE coupons
    ADD CONSTRAINT chk_coupons_value CHECK (discount_value > 0 AND (discount_type <> 'percent' OR discount_value <= 100)),
    ADD CONSTRAINT chk_coupons_usage CHECK (used_count >= 0 AND used_count <= usage_limit);

-- 5. Lưu tên sản phẩm tại thời điểm mua để lịch sử đơn không đổi khi admin sửa sản phẩm
ALTER TABLE order_items ADD COLUMN product_name VARCHAR(255) NULL AFTER product_id;
UPDATE order_items oi JOIN products p ON p.id = oi.product_id SET oi.product_name = p.name WHERE oi.product_name IS NULL;

-- 6. Index cho các truy vấn hay dùng; bỏ index trùng với UNIQUE.
-- Index khoá ngoại do MySQL tự tạo (vd. products.category_id) được MySQL tự bỏ khi có index ghép thay thế.
ALTER TABLE products
    ADD INDEX idx_products_active_created (is_active, created_at),
    ADD INDEX idx_products_category_active (category_id, is_active);
ALTER TABLE products DROP INDEX idx_product_slug;

ALTER TABLE orders
    ADD INDEX idx_orders_user_created (user_id, created_at),
    ADD INDEX idx_orders_created (created_at);
ALTER TABLE orders DROP INDEX idx_order_code;

ALTER TABLE categories DROP INDEX idx_category_slug;

-- 1. Table Categories
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NULL,
    parent_id INT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- Cột mới để hỗ trợ xóa tạm
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    birthday DATE NULL,
    gender ENUM('Nam', 'Nữ', 'Khác') NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    provider VARCHAR(50) DEFAULT 'local',   
    avatar_url VARCHAR(255) NULL,
    reset_otp VARCHAR(64) DEFAULT NULL, -- HMAC-SHA256 của OTP
    otp_expiry DATETIME NULL DEFAULT NULL,
    otp_attempts INT NOT NULL DEFAULT 0,
    password_changed_at DATETIME NULL, -- token phát hành trước mốc này bị từ chối
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table Products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    brand VARCHAR(100) DEFAULT 'Hometic',
    price DECIMAL(15, 2) NOT NULL DEFAULT 0,
    sale_price DECIMAL(15, 2) NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- RESTRICT: không xoá được danh mục khi còn sản phẩm (app chỉ ẩn danh mục)
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT chk_products_price CHECK (price >= 0),
    CONSTRAINT chk_products_sale_price CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price <= price)),
    CONSTRAINT chk_products_stock CHECK (stock >= 0),
    INDEX idx_product_name (name),
    INDEX idx_product_price (price),
    INDEX idx_products_active_created (is_active, created_at),
    INDEX idx_products_category_active (category_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table Product Details
CREATE TABLE IF NOT EXISTS product_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL UNIQUE,
    description TEXT, 
    content LONGTEXT, 
    specifications JSON NULL,
    gallery_urls JSON NULL,
    warranty_info VARCHAR(255) DEFAULT '12 tháng',
    origin VARCHAR(100) DEFAULT 'Việt Nam',
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table Coupons
CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('fixed', 'percent') DEFAULT 'percent',
    discount_value DECIMAL(15, 2) NOT NULL,
    min_order_value DECIMAL(15, 2) DEFAULT 0,
    max_discount_value DECIMAL(15, 2) NULL,
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    usage_limit INT DEFAULT 100,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_coupons_value CHECK (discount_value > 0 AND (discount_type <> 'percent' OR discount_value <= 100)),
    CONSTRAINT chk_coupons_usage CHECK (used_count >= 0 AND used_count <= usage_limit)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table UserCoupons
CREATE TABLE IF NOT EXISTS user_coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    coupon_id INT NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at DATETIME DEFAULT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Mỗi người chỉ lưu 1 lần mỗi mã (chặn bấm "Lưu mã" 2 lần tạo 2 bản ghi)
    CONSTRAINT uq_user_coupon UNIQUE (user_id, coupon_id),
    INDEX idx_coupon_id (coupon_id),
    
    -- Ràng buộc khóa ngoại
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table Orders
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    coupon_id INT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50) DEFAULT 'cod',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    recipient_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- RESTRICT: xoá user không được kéo theo lịch sử đơn hàng / doanh thu
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL,
    CONSTRAINT chk_orders_amounts CHECK (subtotal >= 0 AND discount_amount >= 0 AND total_amount >= 0),
    INDEX idx_order_status (status),
    INDEX idx_orders_user_created (user_id, created_at),
    INDEX idx_orders_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NULL, -- tên lúc mua, không đổi khi admin sửa sản phẩm
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_order_items_price CHECK (price_at_purchase >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Table Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT uq_review_user_product UNIQUE (user_id, product_id),
    INDEX idx_reviews_product_created (product_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DB tạo từ bản schema cũ hơn: chạy các file trong database/migrations/ theo thứ tự.

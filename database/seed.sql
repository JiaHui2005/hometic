-- Seed Categories
INSERT INTO categories (name, slug, description) VALUES 
('Electronics', 'electronics', 'Gadgets, phones, and more'),
('Furniture', 'furniture', 'Home and office furniture'),
('Clothing', 'clothing', 'Men and women apparel');

-- Seed Users (Admin & Customer)
-- Note: password_hash should be managed by the application (e.g. bcrypt)
INSERT INTO users (email, password_hash, full_name, role) VALUES 
('admin@example.com', '$2b$12$K8M6v6W8I6Z8L8N8P8R8T8V8X8Z8', 'System Administrator', 'admin'),
('customer@example.com', '$2b$12$K8M6v6W8I6Z8L8N8P8R8T8V8X8Z8', 'John Doe', 'customer');

-- Seed Products
INSERT INTO products (category_id, name, slug, description, price, stock, image_url) VALUES 
(1, 'iPhone 15 Pro', 'iphone-15-pro', 'Latest Apple smartphone', 999.99, 50, 'https://example.com/iphone.jpg'),
(1, 'Sony WH-1000XM5', 'sony-wh-1000xm5', 'Noise cancelling headphones', 349.99, 30, 'https://example.com/sony.jpg'),
(2, 'Ergonomic Chair', 'ergonomic-chair', 'High back office chair', 199.50, 20, 'https://example.com/chair.jpg');

-- Seed Orders (for Dashboard testing)
INSERT INTO orders (user_id, total_amount, status, payment_status, shipping_address) VALUES 
(2, 1349.98, 'delivered', 'paid', '123 Main St, New York'),
(2, 199.50, 'processing', 'pending', '123 Main St, New York');

-- Seed Order Items
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES 
(1, 1, 1, 999.99),
(1, 2, 1, 349.99),
(2, 3, 1, 199.50);

-- Seed Reviews
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES 
(2, 1, 5, 'Amazing phone!'),
(2, 2, 4, 'Great sound quality but expensive.');

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS hometic_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hometic_db;

-- Source schema and seed data from the mounted /database directory
SOURCE /database/schema.sql;
SOURCE /database/seed_product.sql;
SOURCE /database/product-1.sql;
SOURCE /database/product-2.sql;

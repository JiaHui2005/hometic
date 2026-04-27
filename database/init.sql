CREATE DATABASE IF NOT EXISTS hometic_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hometic_db;

-- Source schema and seed data
-- Note: In a real Docker environment, you might just put schema.sql and seed.sql 
-- in /docker-entrypoint-initdb.d/ to run them automatically.
-- For local reference, we define them in separate files.

SOURCE /docker-entrypoint-initdb.d/schema.sql;
SOURCE /docker-entrypoint-initdb.d/seed.sql;


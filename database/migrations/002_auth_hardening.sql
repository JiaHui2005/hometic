-- OTP lưu dạng HMAC (64 ký tự hex), đếm số lần nhập sai, mốc đổi mật khẩu để thu hồi token cũ.
-- Chạy 1 lần sau 001:
--   docker exec -i hometic_db mysql -uroot --default-character-set=utf8mb4 hometic_db < database/migrations/002_auth_hardening.sql
SET NAMES utf8mb4;

ALTER TABLE users
    MODIFY reset_otp VARCHAR(64) NULL DEFAULT NULL,
    MODIFY otp_expiry DATETIME NULL DEFAULT NULL,
    ADD COLUMN otp_attempts INT NOT NULL DEFAULT 0 AFTER otp_expiry,
    ADD COLUMN password_changed_at DATETIME NULL AFTER otp_attempts;

-- Mã cũ lưu dạng chữ thường không còn dùng được với cách so sánh mới
UPDATE users SET reset_otp = NULL, otp_expiry = NULL;

-- Add verification_code column to users table
ALTER TABLE users 
ADD COLUMN verification_code VARCHAR(6) DEFAULT NULL;
 
-- Run this SQL script with MySQL to update your database schema
-- mysql -u youruser -p yourdb < migrations/add_verification_code.sql 
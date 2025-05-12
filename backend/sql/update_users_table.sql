-- Update users table to add verification_code column
ALTER TABLE users ADD COLUMN verification_code VARCHAR(6) DEFAULT NULL;

-- How to run this script:
-- 1. Connect to your MySQL database
-- 2. Run: SOURCE /path/to/update_users_table.sql
-- 
-- Or from command line:
-- mysql -u [username] -p [database_name] < update_users_table.sql 
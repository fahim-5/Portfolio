-- portfolio Database Schema

-- Drop database if it exists and create a new one
DROP DATABASE IF EXISTS portfolio;
CREATE DATABASE portfolio;
USE portfolio;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstname VARCHAR(50),
  lastname VARCHAR(50),
  avatar VARCHAR(255),
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Profiles table
CREATE TABLE user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  bio TEXT,
  location VARCHAR(100),
  website VARCHAR(255),
  job_title VARCHAR(100),
  phone VARCHAR(20),
  hero_greeting VARCHAR(50) DEFAULT 'Hello, I''m',
  hero_description TEXT,
  hero_button_text VARCHAR(50) DEFAULT 'Get In Touch',
  hero_stats JSON,
  about_image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Social Links table
CREATE TABLE user_social_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  linkedin VARCHAR(255),
  github VARCHAR(255),
  twitter VARCHAR(255),
  instagram VARCHAR(255),
  youtube VARCHAR(255),
  facebook VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Hero Stats table
CREATE TABLE user_hero_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  value VARCHAR(20) NOT NULL,
  label VARCHAR(50) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Projects table
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  github_link VARCHAR(255),
  live_link VARCHAR(255),
  technologies JSON,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(255),
  category ENUM('frontend', 'backend', 'database', 'devops', 'other') NOT NULL,
  proficiency INT CHECK (proficiency BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Education table
CREATE TABLE education (
  id INT AUTO_INCREMENT PRIMARY KEY,
  institution VARCHAR(100) NOT NULL,
  degree VARCHAR(100) NOT NULL,
  field_of_study VARCHAR(100),
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Work Experience table
CREATE TABLE experience (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  start_date DATE,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact Messages table
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts table
CREATE TABLE blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(255),
  author_id INT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Blog Tags table
CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Post Tags (many-to-many relationship)
CREATE TABLE post_tags (
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Create uploads directory for images if it doesn't exist
-- Note: This is a comment for reference. The directory creation will be handled in the Node.js code

-- Insert initial admin user
INSERT INTO users (username, email, password, firstname, lastname, role)
VALUES ('admin', 'admin@example.com', '$2a$10$kIqR/PTloYan/MRNiEsy6uYO6OCHVmAKR4kEac/7JFHiWXS1XgUey', 'Admin', 'User', 'admin');
-- Note: The password hash above is for 'password123' - you should change this in production

-- Create initial profile for admin user
INSERT INTO user_profiles (user_id, bio, location, website, job_title, phone, hero_greeting, hero_description, hero_button_text)
VALUES (1, 'Full-stack web developer with expertise in JavaScript, React, and Node.js.', 'San Francisco, CA', 'https://example.com', 'Full-Stack Developer', '+1 (555) 123-4567', 'Hello, I''m', 'Building elegant and efficient web applications with modern technologies', 'Get In Touch');

-- Create initial social links for admin user
INSERT INTO user_social_links (user_id, linkedin, github, twitter)
VALUES (1, 'https://linkedin.com/in/johndoe', 'https://github.com/johndoe', 'https://twitter.com/johndoe');

-- Create initial hero stats for admin user
INSERT INTO user_hero_stats (user_id, value, label, display_order)
VALUES 
(1, '5+', 'Years Experience', 0),
(1, '20+', 'Projects Completed', 1),
(1, '15+', 'Happy Clients', 2);

-- Create indexes for better performance
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_social_links_user_id ON user_social_links(user_id);
CREATE INDEX idx_user_hero_stats_user_id ON user_hero_stats(user_id); 
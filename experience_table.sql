-- SQL script to create and populate the experience table
-- Run this script in phpMyAdmin or another SQL client

-- Create the experience table if it doesn't exist
CREATE TABLE IF NOT EXISTS `experience` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `position` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `period` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert sample data (optional - remove if you want to start with an empty table)
INSERT INTO `experience` (`position`, `company`, `location`, `period`, `description`)
VALUES 
('Senior Software Engineer', 'TechSolutions Inc.', 'San Francisco, CA (Remote)', 'Mar 2021 - Present', 'Led a team of 5 developers to build scalable microservices architecture. Implemented CI/CD pipelines reducing deployment time by 40%. Technologies: Node.js, React, AWS, Docker.'),
('Frontend Developer', 'Digital Innovations LLC', 'New York, NY', 'Aug 2018 - Feb 2021', 'Developed responsive web applications using React and Redux. Improved page load performance by 30% through code optimization. Collaborated with UX designers to implement pixel-perfect interfaces.'),
('Junior Web Developer', 'WebCraft Studios', 'Austin, TX', 'Jun 2016 - Jul 2018', 'Built and maintained client websites using HTML5, CSS3, and JavaScript. Assisted in migrating legacy systems to modern frameworks. Participated in Agile development cycles.'); 
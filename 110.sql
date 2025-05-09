-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 09, 2025 at 09:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `portfolio`
--

-- --------------------------------------------------------

--
-- Table structure for table `about`
--

CREATE TABLE `about` (
  `id` int(11) NOT NULL,
  `aboutImageUrl` varchar(512) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `about`
--

INSERT INTO `about` (`id`, `aboutImageUrl`, `bio`, `linkedin`, `github`, `twitter`, `instagram`, `createdAt`) VALUES
(1, 'https://example.com/images/profile-john.jpg', 'Full-stack developer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and open-source contributions. When not coding, I enjoy hiking and photography.', 'https://linkedin.com/in/johndoe-dev', 'https://github.com/johndoe-code', 'https://twitter.com/johndoe_tweets', 'https://instagram.com/john.doe.pics', '2025-05-09 18:55:59'),
(2, 'https://example.com/images/profile-sarah.jpg', 'UI/UX Designer & Frontend Developer specializing in React and design systems. I bridge the gap between beautiful design and functional implementation. Love mentoring junior developers and speaking at tech conferences.', 'https://linkedin.com/in/sarahdesigner', 'https://github.com/sarah-creates', 'https://twitter.com/sarah_designs', 'https://instagram.com/sarah.designs', '2025-05-09 18:55:59'),
(3, 'https://example.com/images/profile-alex.jpg', 'DevOps Engineer with cloud architecture expertise. AWS Certified Solutions Architect who enjoys automating everything. Open-source contributor and tech blogger in my spare time.', 'https://linkedin.com/in/alex-devops', 'https://github.com/alex-ops', NULL, NULL, '2025-05-09 18:55:59');

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `id` int(11) NOT NULL,
  `degree` varchar(255) NOT NULL,
  `institution` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `startDate` varchar(7) DEFAULT NULL,
  `endDate` varchar(7) DEFAULT NULL,
  `current` tinyint(1) DEFAULT 0,
  `description` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `education`
--

INSERT INTO `education` (`id`, `degree`, `institution`, `location`, `startDate`, `endDate`, `current`, `description`, `createdAt`) VALUES
(1, 'Bachelor of Science in Computer Science', 'United International University', 'Dhaka, Bangladesh', '2019-09', '2023-08', 0, 'Completed core coursework in data structures, algorithms, databases, and software engineering. Participated in tech fests and open-source projects.', '2025-05-09 18:01:49'),
(2, 'Master of Science in Artificial Intelligence', 'Technical University of Munich', 'Munich, Germany', '2024-10', NULL, 1, 'Focusing on machine learning, neural networks, and computer vision. Currently involved in research on generative AI applications.', '2025-05-09 18:01:49'),
(3, 'Diploma in Web Development', 'FreeCodeCamp', 'Online', '2022-01', '2022-06', 0, 'Completed intensive full-stack development training including JavaScript, React, Node.js, and MongoDB. Built several portfolio-ready projects.', '2025-05-09 18:01:49');

-- --------------------------------------------------------

--
-- Table structure for table `experience`
--

CREATE TABLE `experience` (
  `id` int(11) NOT NULL,
  `position` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `period` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `experience`
--

INSERT INTO `experience` (`id`, `position`, `company`, `location`, `period`, `description`, `createdAt`) VALUES
(1, 'Senior Software Engineer', 'TechSolutions Inc.', 'San Francisco, CA (Remote)', 'Mar 2021 - Present', 'Led a team of 5 developers to build scalable microservices architecture. Implemented CI/CD pipelines reducing deployment time by 40%. Technologies: Node.js, React, AWS, Docker.', '2025-05-09 18:54:49'),
(2, 'Frontend Developer', 'Digital Innovations LLC', 'New York, NY', 'Aug 2018 - Feb 2021', 'Developed responsive web applications using React and Redux. Improved page load performance by 30% through code optimization. Collaborated with UX designers to implement pixel-perfect interfaces.', '2025-05-09 18:54:49'),
(3, 'Junior Web Developer', 'WebCraft Studios', 'Austin, TX', 'Jun 2016 - Jul 2018', 'Built and maintained client websites using HTML5, CSS3, and JavaScript. Assisted in migrating legacy systems to modern frameworks. Participated in Agile development cycles.', '2025-05-09 18:54:49');

-- --------------------------------------------------------

--
-- Table structure for table `hero`
--

CREATE TABLE `hero` (
  `id` int(11) NOT NULL,
  `greeting` varchar(255) NOT NULL DEFAULT 'Hello, I''m',
  `name` varchar(100) NOT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `button_text` varchar(50) NOT NULL DEFAULT 'Get In Touch',
  `profile_image_url` varchar(512) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `linkedin_url` varchar(512) DEFAULT NULL,
  `github_url` varchar(512) DEFAULT NULL,
  `twitter_url` varchar(512) DEFAULT NULL,
  `instagram_url` varchar(512) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hero`
--

INSERT INTO `hero` (`id`, `greeting`, `name`, `last_name`, `description`, `job_title`, `button_text`, `profile_image_url`, `email`, `phone`, `location`, `linkedin_url`, `github_url`, `twitter_url`, `instagram_url`, `created_at`, `updated_at`) VALUES
(1, 'Hello, I\'m', 'Fahim ', 'Faysal', 'I am a passionate developer with expertise in creating modern and responsive web applications...', 'Full Stack Developer', 'Get In Touch', 'https://unsplash.com/photos/a-bunch-of-balloons-that-are-shaped-like-email-7NT4EDSI5Ok', 'example@example.com', '+1234567890', 'Dhaka, Bangladesh', 'https://linkedin.com/in/example', 'https://github.com/example', 'https://twitter.com/example', 'https://instagram.com/example', '2025-05-09 17:16:56', '2025-05-09 17:54:42');

-- --------------------------------------------------------

--
-- Table structure for table `hero_stats`
--

CREATE TABLE `hero_stats` (
  `id` int(11) NOT NULL,
  `hero_id` int(11) NOT NULL,
  `value` varchar(20) NOT NULL,
  `label` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hero_stats`
--

INSERT INTO `hero_stats` (`id`, `hero_id`, `value`, `label`, `created_at`) VALUES
(4, 1, '5+', 'Years Experience', '2025-05-09 17:54:42'),
(5, 1, '100+', 'Projects Completed', '2025-05-09 17:54:42'),
(6, 1, '50+', 'Happy Clients', '2025-05-09 17:54:42');

-- --------------------------------------------------------

--
-- Table structure for table `pictures`
--

CREATE TABLE `pictures` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `link` varchar(512) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pictures`
--

INSERT INTO `pictures` (`id`, `title`, `category`, `description`, `link`, `image`, `createdAt`) VALUES
(1, 'Mountain Sunrise', 'Nature', 'Beautiful sunrise over the Rocky Mountains captured during a hiking trip. The golden hour light creates stunning contrasts on the mountain ridges.', 'https://example.com/photo-details/mountain-sunrise', 'https://example.com/images/mountain-sunrise.jpg', '2025-05-09 19:03:29'),
(2, 'Urban Architecture', 'Cityscape', 'Abstract geometric patterns in downtown Chicago architecture. Shot with a 50mm prime lens to emphasize the clean lines and symmetry of modern buildings.', 'https://example.com/photo-details/chicago-architecture', 'https://example.com/images/urban-architecture.jpg', '2025-05-09 19:03:29'),
(3, 'Portrait Session', 'Portrait', 'Professional headshot with natural lighting. Taken in a studio with softbox lighting to create a flattering, professional look for corporate profiles.', 'https://example.com/photo-details/professional-portrait', 'https://example.com/images/portrait-session.jpg', '2025-05-09 19:03:29');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `technologies` text DEFAULT NULL,
  `demoUrl` text DEFAULT NULL,
  `repoUrl` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `category`, `description`, `image`, `technologies`, `demoUrl`, `repoUrl`, `createdAt`) VALUES
(1, 'E-Commerce Platform', 'Web Development', 'A full-featured online store with product listings, shopping cart, and payment processing. Built with microservices architecture for scalability.', 'https://example.com/images/ecommerce-platform.jpg', 'React, Node.js, MongoDB, Stripe API, Docker', 'https://demo.example.com/ecommerce', 'https://github.com/username/ecommerce-platform', '2025-05-09 19:04:26'),
(2, 'Health Fitness Tracker', 'Mobile App', 'Cross-platform mobile application that tracks workouts, nutrition, and health metrics with data visualization dashboards.', 'https://example.com/images/fitness-tracker.jpg', 'Flutter, Firebase, Google Fit API, BLoC Pattern', 'https://play.google.com/store/apps/fitness-tracker', 'https://github.com/username/fitness-tracker', '2025-05-09 19:04:26'),
(3, 'Sentiment Analysis Tool', 'Machine Learning', 'NLP application that analyzes customer reviews and classifies them as positive, negative or neutral with 89% accuracy.', 'https://example.com/images/sentiment-analysis.jpg', 'Python, TensorFlow, NLTK, Flask, AWS SageMaker', 'https://demo.example.com/sentiment-analysis', 'https://github.com/username/sentiment-analysis', '2025-05-09 19:04:26');

-- --------------------------------------------------------

--
-- Table structure for table `references`
--

CREATE TABLE `references` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `quote` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `references`
--

INSERT INTO `references` (`id`, `name`, `position`, `company`, `quote`, `image`, `createdAt`) VALUES
(1, 'Dr. Sarah Johnson', 'Senior Engineering Manager', 'TechInnovate Solutions', 'Working with this developer was an absolute pleasure. Their problem-solving skills and attention to detail helped us deliver three major projects ahead of schedule. They bring both technical excellence and positive energy to every team.', 'https://example.com/images/sarah-johnson.jpg', '2025-05-09 19:06:37'),
(2, 'Michael Chen', 'CTO', 'DigitalFuture Inc.', 'One of the most talented full-stack developers I\'ve worked with. They took our legacy codebase and modernized it with cutting-edge technologies while maintaining perfect backward compatibility. A true professional who mentors junior team members.', 'https://example.com/images/michael-chen.jpg', '2025-05-09 19:06:37'),
(3, 'Emily Rodriguez', 'Product Director', 'CreativeMind Apps', 'This developer transformed our mobile app\'s performance, reducing crash rates by 92%. Their user-first approach to development and ability to explain complex technical concepts to non-technical stakeholders is remarkable.', 'https://example.com/images/emily-rodriguez.jpg', '2025-05-09 19:06:37');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` enum('technical','soft','languages') NOT NULL,
  `level` enum('beginner','elementary','intermediate','advanced','expert','native') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `name`, `category`, `level`) VALUES
(1, 'React', 'technical', 'advanced'),
(2, 'Teamwork', 'soft', 'intermediate'),
(3, 'English', 'languages', 'native');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `profile_image_url` varchar(512) DEFAULT NULL,
  `linkedin_url` varchar(512) DEFAULT NULL,
  `github_url` varchar(512) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `last_login` timestamp NULL DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `job_title`, `bio`, `email`, `phone`, `profile_image_url`, `linkedin_url`, `github_url`, `created_at`, `updated_at`, `password`, `is_admin`, `last_login`, `reset_token`, `reset_token_expires`) VALUES
(1, 'Fahim Faysal', NULL, NULL, 'fahimbafu@gmail.com', NULL, NULL, NULL, NULL, '2025-05-09 10:31:21', '2025-05-09 18:37:21', '$2b$10$tAOLFXUvs7DMESP734gOb.fa/fLcZM.GF9eyNPJQy2TI4DYrbPr22', 0, '2025-05-09 18:37:21', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about`
--
ALTER TABLE `about`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `experience`
--
ALTER TABLE `experience`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hero`
--
ALTER TABLE `hero`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hero_stats`
--
ALTER TABLE `hero_stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hero_id` (`hero_id`);

--
-- Indexes for table `pictures`
--
ALTER TABLE `pictures`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `references`
--
ALTER TABLE `references`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about`
--
ALTER TABLE `about`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `experience`
--
ALTER TABLE `experience`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `hero`
--
ALTER TABLE `hero`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hero_stats`
--
ALTER TABLE `hero_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `pictures`
--
ALTER TABLE `pictures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `references`
--
ALTER TABLE `references`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hero_stats`
--
ALTER TABLE `hero_stats`
  ADD CONSTRAINT `hero_stats_ibfk_1` FOREIGN KEY (`hero_id`) REFERENCES `hero` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

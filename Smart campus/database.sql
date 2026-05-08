-- Smart Campus DB Setup + Samples
-- Run in phpMyAdmin SQL tab: http://localhost/phpmyadmin
-- After starting XAMPP Apache + MySQL

CREATE DATABASE IF NOT EXISTS `smart_campus`;
USE `smart_campus`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `firstName` VARCHAR(50),
  `lastName` VARCHAR(50),
  `email` VARCHAR(100) UNIQUE,
  `studentId` VARCHAR(20),
  `password` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(200),
  `date` DATE,
  `time` TIME,
  `location` VARCHAR(200),
  `category` ENUM('academic','sports','cultural','social'),
  `description` TEXT,
  `capacity` INT DEFAULT 100,
  `organizer` VARCHAR(100),
  `registrations` INT DEFAULT 0,
  `createdBy` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`)
);

-- Sample user (email: john@example.com, pw: password123 - register real users via app)
INSERT IGNORE INTO `users` (`firstName`, `lastName`, `email`, `studentId`, `password`) VALUES
('John', 'Doe', 'john@example.com', 'STU001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password: 'password'

-- Sample events (linked to user 1)
INSERT IGNORE INTO `events` (`title`, `date`, `time`, `location`, `category`, `description`, `capacity`, `organizer`, `createdBy`, `registrations`) VALUES
('Welcome Orientation', '2024-10-15', '10:00:00', 'Auditorium', 'social', 'New student orientation program with campus tour', 150, 'Student Affairs', 1, 10),
('Python Workshop', '2024-10-20', '14:00:00', 'Lab 101', 'academic', 'Hands-on Python programming for beginners', 30, 'CS Dept', 1, 8),
('Football Tournament', '2024-10-25', '16:00:00', 'Sports Field', 'sports', 'Inter-department football championship', 200, 'Sports Club', 1, 45),
('Cultural Night', '2024-10-30', '19:00:00', 'Amphitheater', 'cultural', 'Music, dance and food festival', 500, 'Cultural Club', 1, 120);

-- Verify
SELECT 'DB Setup Complete!' as status;
SELECT COUNT(*) as total_events FROM events;
SELECT COUNT(*) as total_users FROM users;

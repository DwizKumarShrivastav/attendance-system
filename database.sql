DROP DATABASE IF EXISTS attendance_system;
CREATE DATABASE attendance_system;
USE attendance_system;

-- USERS
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin','teacher','student')
);

-- STUDENTS
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(100),
  erp VARCHAR(50),
  section VARCHAR(10),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TEACHERS
CREATE TABLE teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(100),
  department VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- SUBJECTS
CREATE TABLE subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_name VARCHAR(100),
  section VARCHAR(10)
);

-- ATTENDANCE
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  subject_id INT,
  date DATE,
  status ENUM('Present','Absent'),
  marked_by INT,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- TOKENS
CREATE TABLE tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(50),
  subject_id INT,
  date DATE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- ADMIN LOGIN (username: admin | password: admin123)
INSERT INTO users (username, password, role)
VALUES (
  'admin',
  '$2b$10$7sQ7z9V0y0c8q7Yc7y4xQO7h1zj5xYg5cFZr1uH6G2y7gY0K9W7aG',
  'admin'
);
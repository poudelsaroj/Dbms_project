-- Drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS duty_reports;
DROP TABLE IF EXISTS exam_invigilators;
DROP TABLE IF EXISTS invigilator_preferences;
DROP TABLE IF EXISTS exams;
DROP TABLE  classes;
DROP TABLE IF EXISTS invigilators;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS departments;

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(50) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    building VARCHAR(100),
    floor VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create invigilators table
CREATE TABLE IF NOT EXISTS invigilators (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department_id INT,
    phone VARCHAR(20),
    designation VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    max_duties_per_day INT DEFAULT 2,
    max_duties_per_week INT DEFAULT 6,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department_id INT,
    semester INT NOT NULL,
    section VARCHAR(10),
    student_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(255) NOT NULL,
    subject_code VARCHAR(20),
    department_id INT,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_id INT,
    student_count INT NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Create exam_invigilators table
CREATE TABLE IF NOT EXISTS exam_invigilators (
    exam_id INT,
    invigilator_id INT,
    duty_status ENUM('assigned', 'completed', 'absent') DEFAULT 'assigned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (exam_id, invigilator_id),
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (invigilator_id) REFERENCES invigilators(id) ON DELETE CASCADE
);

-- Create invigilator_preferences table
CREATE TABLE IF NOT EXISTS invigilator_preferences (
    invigilator_id INT PRIMARY KEY,
    preferred_days JSON,
    preferred_time_slots JSON,
    preferred_rooms JSON,
    max_duties_per_day INT DEFAULT 2,
    max_duties_per_week INT DEFAULT 6,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invigilator_id) REFERENCES invigilators(id) ON DELETE CASCADE
);

-- Create duty_reports table
CREATE TABLE IF NOT EXISTS duty_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exam_id INT,
    invigilator_id INT,
    attendance_status ENUM('present', 'absent', 'late') NOT NULL,
    report_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (invigilator_id) REFERENCES invigilators(id)
);

-- Insert sample departments
INSERT INTO departments (name, code) VALUES 
('Computer Science', 'CS'),
('Electronics', 'EC'),
('Mechanical', 'ME'),
('Civil', 'CE');

-- Insert sample rooms
INSERT INTO rooms (room_number, capacity, building, floor) VALUES 
('101', 60, 'Main Block', 'Ground'),
('102', 40, 'Main Block', 'Ground'),
('201', 50, 'Main Block', 'First'),
('202', 45, 'Main Block', 'First');

-- Insert admin user (password: admin123)
INSERT INTO invigilators (name, email, password, department_id, designation, status) VALUES 
('Admin User', 'admin@admin.com', '$2b$10$5dwsS5snIRlKu8LKB5P.NOH5yCw5C5h2qGNn8oSxVLJXY3kHfdAT.', 1, 'Administrator', 'active');
-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department_id INT,
    semester INT,
    section VARCHAR(10),
    student_count INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
drop table classes;
USE invigilator_management10;
drop table exams;

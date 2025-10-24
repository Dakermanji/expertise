-- sql/improvement_lessons.sql
CREATE TABLE improvement_lessons (
    id CHAR(36) PRIMARY KEY,
    -- UUID
    student_name VARCHAR(100) NOT NULL,
    region ENUM('montreal', 'laval', 'dorval', 'lasalle') NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    preferred_date DATE,
    preferred_time TIME,
    preferred_language VARCHAR(50),
    notes TEXT,
    status ENUM('pending', 'partially', 'paid', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- sql/full_driving_courses.sql
CREATE TABLE full_driving_courses (
    id CHAR(36) PRIMARY KEY,
    -- UUID
    student_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    course_id CHAR(36) NOT NULL,
    notes TEXT,
    status ENUM('pending', 'partially', 'paid', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

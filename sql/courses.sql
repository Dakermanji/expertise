-- sql/courses.sql
CREATE TABLE courses (
    id CHAR(36) PRIMARY KEY,
    -- UUID
    status ENUM('pending', 'in_progress') DEFAULT 'pending',
    phase INT NOT NULL,
    number_of_students INT NOT NULL DEFAULT 0
);

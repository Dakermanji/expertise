-- sql/car_rentals.sql
CREATE TABLE car_rentals (
    id CHAR(36) PRIMARY KEY,
    -- UUID
    student_name VARCHAR(100) NOT NULL,
    region ENUM('montreal', 'laval', 'dorval', 'lasalle') NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    exam_date DATE,
    exam_time TIME,
    notes TEXT,
    status ENUM('pending', 'partially', 'paid', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

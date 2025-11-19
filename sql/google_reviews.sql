-- sql/google_reviews.sql
CREATE TABLE google_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(100),
    profile_photo_url TEXT,
    rating TINYINT,
    review_lang VARCHAR(5) DEFAULT NULL;
    text TEXT,
    retrieved_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

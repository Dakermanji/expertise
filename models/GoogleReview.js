//! models/GoogleReview.js

/**
 * GoogleReview Model
 * ------------------
 * Handles safe storage, deduplication, pruning, and retrieval of Google
 * customer reviews using the new db.query() wrapper.
 *
 * This model relies on:
 *   - auto-timestamps for `retrieved_at` (defined in SQL schema).
 *
 * Table structure (google_reviews):
 *   id                INT AUTO_INCREMENT PRIMARY KEY
 *   author_name       VARCHAR(100)
 *   profile_photo_url TEXT
 *   rating            TINYINT
 *   review_lang	   VARCHAR(5)
 *   text              TEXT
 *   retrieved_at      DATETIME DEFAULT CURRENT_TIMESTAMP
 */

import db from '../config/database.js';

export class GoogleReview {
	/**
	 * Fetch recent reviews sorted by timestamp, filtered by rating.
	 *
	 * Notes:
	 *  - Only returns reviews with rating >= 4.
	 *  - Sorted newest → oldest using retrieved_at.
	 *  - Limit defaults to 5 but is configurable.
	 *  - Uses db.query(), so no try/catch needed here.
	 *
	 * @param {number} limit  Maximum number of reviews to return (default: 5)
	 * @returns {Promise<Array<Object>>} Array of reviews, or [] on failure
	 */
	static async fetchRecent(limit = 5) {
		const sql = `
			SELECT *
			FROM google_reviews
			WHERE rating >= 4
			ORDER BY retrieved_at DESC
			LIMIT ?
		`;

		const { rows } = await db.query(sql, [limit]);

		// Fallback to empty array on DB errors
		return rows || [];
	}

	/**
	 * Insert a Google review ONLY if it does not already exist in the database.
	 *
	 * Deduplication strategy:
	 *  - Same author_name + same text → considered duplicate.
	 *  - Google reviews have no unique ID, so text matching is the safest method.
	 *
	 * @param {Object} review  Review returned by Google API
	 * @returns {Promise<boolean>} true if inserted, false if duplicate
	 */
	static async insertIfNotExists(review) {
		// Check for duplicates by author + text
		const { rows } = await db.query(
			`
			SELECT id
			FROM google_reviews
			WHERE author_name = ?
			  AND rating = ?
			  AND text = ?
			LIMIT 1
			`,
			[review.author_name, review.rating, review.text]
		);

		// Duplicate found → skip insertion
		if (rows && rows.length > 0) return false;

		// Insert new review (retrieved_at auto-filled by MySQL)
		await db.query(
			`
			INSERT INTO google_reviews
			(author_name, profile_photo_url, rating, review_lang, text)
			VALUES (?, ?, ?, ?, ?)
			`,
			[
				review.author_name,
				review.profile_photo_url,
				review.rating,
				review.review_lang,
				review.text,
			]
		);

		return true;
	}

	/**
	 * Prune the review table to keep ONLY the newest N reviews.
	 *
	 * Implementation:
	 *  - Uses a nested subquery (keepers) to avoid MySQL's "You can't modify
	 *    the table you're selecting from" error.
	 *  - Deletes ALL reviews except the most recent {limit} sorted by retrieved_at.
	 *
	 * @param {number} limit  Maximum number of reviews to keep (default: 10)
	 * @returns {Promise<void>}
	 */
	static async prune(limit = 10) {
		await db.query(`
			DELETE FROM google_reviews
			WHERE id NOT IN (
				SELECT id FROM (
					SELECT id
					FROM google_reviews
					ORDER BY retrieved_at DESC
					LIMIT ${limit}
				) AS keepers
			)
		`);
	}
}

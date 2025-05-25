//! models/GoogleReview.js

import { promisePool } from '../config/database.js';

export class GoogleReview {
	static async insertMany(reviews = []) {
		if (!Array.isArray(reviews) || reviews.length === 0) return;

		const values = reviews.map((r) => [
			r.author_name,
			r.profile_photo_url,
			r.rating,
			r.text,
		]);

		const sql = `
			INSERT INTO google_reviews (author_name, profile_photo_url, rating, text)
			VALUES ?
		`;

		await promisePool.query(sql, [values]);
	}

	static async clearAll() {
		await promisePool.query('DELETE FROM google_reviews');
	}

	static async fetchRecent(limit = 5) {
		const [rows] = await promisePool.query(
			'SELECT * FROM google_reviews ORDER BY retrieved_at DESC LIMIT ?',
			[limit]
		);
		return rows;
	}
}

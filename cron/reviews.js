//! cron/reviews.js

import cron from 'node-cron';
import { fetchGoogleReviews } from '../utils/googleReviews.js';
import { GoogleReview } from '../models/GoogleReview.js';

export function startGoogleReviewsCron() {
	// Every 6 hours: minute 0, hour */6
	cron.schedule('0 */6 * * *', async () => {
		console.log('[CRON] Fetching Google Reviews...');

		try {
			const reviews = await fetchGoogleReviews();

			if (reviews.length) {
				await GoogleReview.clearAll(); // Optional: clear old entries
				await GoogleReview.insertMany(reviews);
				console.log(`[CRON] Inserted ${reviews.length} reviews`);
			} else {
				console.log('[CRON] No reviews returned');
			}
		} catch (err) {
			console.error('[CRON ERROR]', err.message);
		}
	});
}

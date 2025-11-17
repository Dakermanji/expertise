//! cron/reviews.js

import cron from 'node-cron';
import axios from 'axios';
import env from '../config/dotenv.js';
import { logger } from '../utils/logger.js';
import { GoogleReview } from '../models/GoogleReview.js';

export const startGoogleReviewsCron = () => {
	// Runs every 6 hours
	cron.schedule('0 */6 * * *', async () => {
		logger.info('🌟 [Reviews - Cron] Starting Google Reviews refresh task...');

		try {
			const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${env.GOOGLE_PLACE_ID}&fields=reviews&key=${env.GOOGLE_API_KEY}`;
			const { data } = await axios.get(url);

			const googleReviews = data?.result?.reviews || [];

			if (googleReviews.length === 0) {
				logger.warn('🌟 [Reviews - Cron] Google returned 0 reviews.');
				return;
			}

			//* Insert new ones (avoiding duplicates)
			let countInserted = 0;

			for (const r of googleReviews) {
				const inserted = await GoogleReview.insertIfNotExists(r);
				if (inserted) countInserted++;
			}

			//* Keep only the newest 10 reviews
			await GoogleReview.prune(10);

			logger.info(`🌟 [Reviews - Cron] Inserted ${countInserted} new reviews. Database pruned to 10 latest.`);

		} catch (err) {
			logger.error(`🌟 [Reviews - Cron] Error refreshing Google reviews: ${err.message}`);
		}
	});
};

//! utils/googleReviews.js

/**
 * Google Reviews Fetcher
 * ----------------------
 * Fetches reviews from Google Places API and returns a normalized
 * array of review objects used by the cron job and controllers.
 */

import axios from 'axios';
import env from '../config/dotenv.js';
import { logger } from '../utils/logger.js';

export async function fetchGoogleReviews() {
	const { GOOGLE_API_KEY, GOOGLE_PLACE_ID } = env;

	const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,reviews,user_ratings_total&key=${GOOGLE_API_KEY}`;

	try {
		const { data } = await axios.get(url, {
			timeout: 8000, // prevent long hangs
			validateStatus: () => true, // we handle errors manually
		});

		if (data.status !== 'OK') {
			logger.warn(`🌟 [Google] Places API returned status ${data.status}`);
			return [];
		}

		const reviews = (data.result.reviews || [])
			.slice(0, 10) // top 10 max
			.map((r) => ({
				author_name: r.author_name,
				profile_photo_url: r.profile_photo_url,
				rating: r.rating,
				review_lang: r.review_lang || null,
				text: r.text,
				time: r.time, // ⭐ unix timestamp
			}));

		return reviews;
	} catch (err) {
		logger.error(`🌟 [Google] Failed to fetch reviews: ${err.message}`);
		return [];
	}
}

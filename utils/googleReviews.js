//! utils/googleReviews.js

import axios from 'axios';
import env from '../config/dotenv.js';

export async function fetchGoogleReviews() {
	const { GOOGLE_API_KEY, GOOGLE_PLACE_ID } = env;

	const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,reviews&key=${GOOGLE_API_KEY}`;

	try {
		const { data } = await axios.get(url);

		if (data.status !== 'OK') {
			throw new Error(`Google API error: ${data.status}`);
		}

		// Optional: limit to 5 reviews and format only what we need
		const reviews = (data.result.reviews || []).slice(0, 10).map((r) => ({
			author_name: r.author_name,
			profile_photo_url: r.profile_photo_url,
			rating: r.rating,
			text: r.text,
		}));

		return reviews;
	} catch (err) {
		console.error('Failed to fetch Google Reviews:', err.message);
		return [];
	}
}

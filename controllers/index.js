//! controllers/index.js

import env from '../config/dotenv.js';
import { GoogleReview } from '../models/GoogleReview.js';

export async function getHome(req, res) {
	try {
		res.render('home', {
			reviews: await GoogleReview.fetchRecent(),
			title: 'home',
			styles: [
				'hero',
				'booking',
				'services',
				'about',
				'areas',
				'faq',
				'reviews',
				'contact',
			],
			scripts: ['home'],
			google_place_id: env.GOOGLE_PLACE_ID,
		});
	} catch (error) {
		console.log('Error rendering Home page: ' + error);
	}
}

//! controllers/indexController.js

import { GoogleReview } from '../models/GoogleReview.js';

export async function getHome(req, res) {
	res.render('home', {
		reviews: await GoogleReview.fetchRecent(),
		title: 'Welcome to Expertise',
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
	});
}

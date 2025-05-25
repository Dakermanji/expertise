//! controllers/aboutController.js

import { GoogleReview } from '../models/GoogleReview.js';

export async function getAbout(req, res) {
	res.render('about', {
		reviews: await GoogleReview.fetchRecent(),
		title: 'Welcome to Expertise',
		styles: [],
		scripts: [],
	});
}

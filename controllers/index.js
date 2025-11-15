//! controllers/index.js

/**
 * Home Controller
 * ----------------
 * Handles rendering of the main landing page.
 *
 * Expected route: GET /
 * Example:
 *    /  → Renders the home page with localized content,
 *         dynamic Google Reviews, and page-specific assets.
 */

import env from '../config/dotenv.js';
import { GoogleReview } from '../models/GoogleReview.js';
import { logger } from '../utils/logger.js';

/**
 * Renders the home page (views/home.ejs)
 *
 * Injects:
 *  - Recent Google reviews
 *  - Page title for localization key (meta.titles.home)
 *  - Stylesheets required for page sections
 *  - Client-side home script
 *  - Google Place ID for embedded maps & review links
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function getHome(req, res) {
	try {
		const reviews = await GoogleReview.fetchRecent();

		res.render('home', {
			reviews,
			title: 'home',
			styles: [
				'home/hero',
				'home/booking',
				'home/services',
				'home/about',
				'home/areas',
				'home/faq',
				'home/reviews',
				'home/contact',
			],
			scripts: ['home'],
			google_place_id: env.GOOGLE_PLACE_ID,
		});
	} catch (error) {
		logger.error(`🏠 [Home] Failed to render home page: ${error}`);
	}
}

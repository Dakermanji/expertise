//! middlewares/fullUrl.js

/**
 * Full URL middleware
 * -------------------
 * Attaches the full absolute request URL (protocol + host + path)
 * to `res.locals.fullUrl`, making it accessible in all EJS templates.
 *
 * Common use cases:
 *  - Canonical <link> meta tags
 *  - SEO-friendly redirects
 *  - Social media share links
 */

import env from '../config/dotenv.js';

/**
 * Builds the full URL using the environment protocol (env.PROTOCOL).
 * This ensures consistent HTTPS usage in production, regardless of proxy behavior.
 */
function fullUrlMiddleware(req, res, next) {
	const protocol = env.PROTOCOL; // enforced protocol (http or https)
	const host = req.get('host');
	const path = req.originalUrl;

	// Construct and expose the full URL for templates
	res.locals.fullUrl = `${protocol}://${host}${path}`;

	next();
}

/**
 * Registers the fullUrl middleware globally.
 * Must be called before i18n setup for accurate language detection.
 *
 * @param {import('express').Express} app - The Express application instance.
 */
export function initializeFullUrl(app) {
	app.use(fullUrlMiddleware);
}

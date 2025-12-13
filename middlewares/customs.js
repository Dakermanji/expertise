//! middlewares/customs.js

/**
 * Customs Middleware
 * ------------------
 * Provides global template variables such as:
 *  - fullUrl       → canonical full URL for SEO/meta
 *  - LANG_DATA     → available languages + labels + flags
 *
 * This centralizes shared UI config and avoids repeating
 * logic inside EJS templates or controllers.
 */

import env from '../config/dotenv.js';

export const LANG_DATA = {
	fr: { label: 'Français', flag: 'qc' },
	en: { label: 'English', flag: 'ca' },
	ar: { label: 'عربي', flag: 'lb' },
	es: { label: 'Español', flag: 'es' },
	de: { label: 'Deutsch', flag: 'de' },
};

/**
 * Attaches useful values to res.locals for all views.
 */
function customsMiddleware(req, res, next) {
	// 🔗 Full URL for canonical/meta tags
	res.locals.fullUrl = `${env.PROTOCOL}://${req.get('host')}${
		req.originalUrl
	}`;

	// 🌍 Language data (for navbar + language selector)
	res.locals.LANG_DATA = LANG_DATA;

	next();
}

/**
 * Register globally
 */
export function initializeCustoms(app) {
	app.use(customsMiddleware);
}

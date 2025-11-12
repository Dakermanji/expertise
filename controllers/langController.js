//! controllers/langController.js

/**
 * Language controller
 * -------------------
 * Handles switching between supported interface languages.
 *
 * Expected route: GET /lang/:code
 * Example:
 *   /lang/en → Switches interface to English
 *   /lang/fr → Switches interface to French
 *   /lang/ar → Switches interface to Arabic
 */

import { SUPPORTED_LANGS } from '../middlewares/i18nMiddleware.js';

/**
 * Sets the session language and redirects user back to previous page.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function setLang(req, res) {
	const code = req.params.code?.toLowerCase();

	// Check if requested language is supported
	if (SUPPORTED_LANGS.includes(code)) {
		req.session.lang = code;
		req.setLocale(code);
		console.log(`[i18n] Language switched to: ${code}`);
	} else {
		console.warn(`[i18n] Unsupported language attempted: ${code}`);
	}

	// Redirect back to previous page or home
	const returnTo = req.get('Referer') || '/';
	res.redirect(returnTo);
}

//! middlewares/flashMiddleware.js

/**
 * Flash message middleware
 * ------------------------
 * Integrates connect-flash with Express to support temporary
 * one-time messages stored in the session.
 *
 * Common use cases:
 *  - Authentication feedback (login errors, signup success)
 *  - Form validation notices
 *  - General success/error alerts
 *
 * The messages are automatically cleared after being displayed once.
 */

import flash from 'connect-flash';

/**
 * Initialize flash message support and expose them to EJS templates.
 *
 * @param {import('express').Express} app - The Express application instance.
 */
export function initializeFlash(app) {
	// Enable connect-flash middleware
	app.use(flash());

	/**
	 * Attach flash messages to res.locals for all GET requests.
	 * This makes them accessible in EJS templates as:
	 *   messages.success or messages.error
	 *
	 * The logic intentionally runs only on GET to avoid conflicts
	 * with AJAX/POST requests that may not require template rendering.
	 */
	app.use((req, res, next) => {
		if (req.method === 'GET') {
			const success = req.flash('success');
			const error = req.flash('error');

			// Attach to response locals for easy access in all views
			res.locals.messages = {
				success,
				error,
			};
		}
		next();
	});
}

/**
 * Tip:
 * When using localized flash keys (e.g., flash.auth.invalid_account_data),
 * use your i18n helper inside EJS:
 *   <%= __("flash.auth.invalid_account_data") %>
 */

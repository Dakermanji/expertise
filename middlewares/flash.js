//! middlewares/flash.js

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
	 * Attach flash messages to res.locals for all requests.
	 * This makes them accessible in EJS templates as:
	 *   messages.success, messages.error, messages.error_list
	 *
	 * Flash messages are consumed on GET only; non-GET renders still need
	 * the default object because the shared layout always includes flash.ejs.
	 */
	app.use((req, res, next) => {
		res.locals.messages = {
			success: [],
			error: [],
			error_list: [],
		};

		if (req.method === 'GET') {
			const success = req.flash('success');
			const error = req.flash('error');
			const error_list = req.flash('error_list');

			res.locals.messages = {
				success: success || [],
				error: error || [],
				error_list: error_list || [],
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

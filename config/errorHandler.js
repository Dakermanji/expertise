//! config/errorHandler.js

/**
 * Global error handling configuration
 * -----------------------------------
 * Provides:
 *  - Express-level error handling middleware for rendering error pages.
 *  - Process-level handlers for uncaught exceptions and unhandled rejections.
 *
 * Works together with:
 *  - config/sentry.js → for external error monitoring.
 *  - utils/logger.js → for local console/file logging.
 */

import env from '../config/dotenv.js';
import { logger } from '../utils/logger.js';
import { captureError } from './sentry.js';

/**
 * Express-level error handler middleware
 * --------------------------------------
 * Catches synchronous and asynchronous errors within routes, controllers, or middleware.
 * Logs errors locally and reports them to Sentry if enabled.
 */
export function registerErrorHandlers(app) {
	app.use((err, req, res, next) => {
		// Log locally for server console or file
		logger.error(err);

		// Send to Sentry if available
		captureError(err);

		// Avoid sending headers twice
		if (res.headersSent) return next(err);

		// Render a user-friendly error page
		res.status(500).render('error', {
			title: '', // localized title provided in view
			styles: [],
			scripts: [],
			message: 'Internal Server Error',
			google_place_id: env.GOOGLE_PLACE_ID,
		});
	});
}

/**
 * Process-level error handlers
 * ----------------------------
 * Prevents the Node process from crashing silently on fatal errors.
 * Captures both uncaught exceptions and unhandled promise rejections.
 */
export function registerProcessHandlers() {
	process.on('uncaughtException', (err) => {
		logger.fatal(err);
		captureError(err);
	});

	process.on('unhandledRejection', (reason) => {
		logger.fatal(reason);
		captureError(reason);
	});
}

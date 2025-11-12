//! config/sentry.js

/**
 * Sentry configuration
 * --------------------
 * Handles initialization and error reporting to Sentry.
 *
 * Sentry provides real-time monitoring for uncaught exceptions,
 * performance tracing, and manual error reporting.
 */

import * as Sentry from '@sentry/node';
import env from './dotenv.js';

/**
 * Initialize Sentry with environment-specific settings.
 *
 * Automatically skips setup if SENTRY_DSN is missing or empty,
 * which prevents issues in local development environments.
 */
export const initSentry = (app) => {
	// Skip Sentry initialization when DSN is not defined
	if (!env.SENTRY_DSN) {
		console.warn('[Sentry] DSN not found — skipping initialization.');
		return;
	}

	try {
		Sentry.init({
			dsn: `${env.PROTOCOL}://${env.SENTRY_DSN}.ingest.us.sentry.io/${env.SENTRY_PROJECT_ID}`,
			tracesSampleRate: 1.0, // 100% tracing — adjust in production if needed
			sendDefaultPii: true, // allows tracking user/session data securely
			integrations: [], // optional — custom integrations can be added later
		});

		console.log('[Sentry] Initialized successfully.');
	} catch (err) {
		console.error('[Sentry] Initialization failed:', err.message);
	}
};

/**
 * Report a captured error manually to Sentry.
 * Used for runtime errors caught in try/catch blocks.
 */
export const reportError = (err) => {
	if (!env.SENTRY_DSN) return; // skip if disabled

	try {
		Sentry.captureException(err);
	} catch (captureErr) {
		console.error(
			'[Sentry] Failed to capture exception:',
			captureErr.message
		);
	}
};

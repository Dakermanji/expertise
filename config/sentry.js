//! config/sentry.js

/**
 * Sentry configuration
 * --------------------
 * Handles initialization and error reporting to Sentry.
 *
 * Features:
 *  - Automatic setup (skipped if DSN missing)
 *  - Standard error capture via `reportError`
 *  - Contextual capture via `captureWithContext` for richer debugging
 *
 * DSN format example:
 * fafafafafafafafafafafafafa@eadf123456789
 */

import * as Sentry from '@sentry/node';
import env from './dotenv.js';

/**
 * Initialize Sentry with environment-specific settings.
 * Automatically skipped if SENTRY_DSN is missing.
 */
export const initSentry = (app) => {
	if (!env.SENTRY_DSN) {
		console.warn('🟡🎯 [Sentry] DSN not found — skipping initialization.');
		return;
	}

	try {
		Sentry.init({
			dsn: `${env.PROTOCOL}://${env.SENTRY_DSN}.ingest.us.sentry.io/${env.SENTRY_PROJECT_ID}`,
			tracesSampleRate: 1.0, // Adjust sampling rate in production
			sendDefaultPii: true,
			integrations: [],
		});

		console.log('🟢🎯 [Sentry] Initialized successfully.');
	} catch (err) {
		console.error('🔴🎯 [Sentry] Initialization failed:', err.message);
	}
};

/**
 * Basic error capture — sends an exception to Sentry.
 */
export const captureError = (err) => {
	if (!env.SENTRY_DSN) return;
	try {
		Sentry.captureException(err);
	} catch (captureErr) {
		console.error(
			'[Sentry] Failed to capture exception:',
			captureErr.message
		);
	}
};

/**
 * Advanced contextual capture — attaches environment, user, or request context.
 *
 * Example usage:
 *   captureWithContext(err, {
 *     user: { id: user.id, email: user.email },
 *     tags: { module: 'booking', severity: 'critical' },
 *     extra: { requestBody: req.body },
 *   });
 */
export const captureWithContext = (err, context = {}) => {
	if (!env.SENTRY_DSN) return;
	try {
		Sentry.withScope((scope) => {
			// Attach user info, tags, and extra data when available
			if (context.user) scope.setUser(context.user);
			if (context.tags)
				Object.entries(context.tags).forEach(([k, v]) =>
					scope.setTag(k, v)
				);
			if (context.extra)
				Object.entries(context.extra).forEach(([k, v]) =>
					scope.setExtra(k, v)
				);
			if (context.level) scope.setLevel(context.level); // e.g., 'warning', 'error'

			Sentry.captureException(err);
		});
	} catch (captureErr) {
		console.error(
			'[Sentry] Failed to capture contextual exception:',
			captureErr.message
		);
	}
};

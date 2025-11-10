//! config/sentry.js

import * as Sentry from '@sentry/node';
import env from './dotenv.js';

export const initSentry = (app) => {
	if (!env.SENTRY_DSN) return;
	Sentry.init({
		dsn: `https://${env.SENTRY_DSN}.ingest.us.sentry.io/${env.SENTRY_PROJECT_ID}`,
		// Setting this option to true will send default PII data to Sentry.
		tracesSampleRate: 1.0,
		sendDefaultPii: true,
	});
};

export const reportError = (err) => {
	if (env.SENTRY_DSN) {
		Sentry.captureException(err);
	}
};

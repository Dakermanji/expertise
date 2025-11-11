//! config/errorHandler.js

import env from '../config/dotenv.js';
import { logger } from '../utils/logger.js';
import { reportError } from './sentry.js';

export function registerErrorHandlers(app) {
	app.use((err, req, res, next) => {
		logger.error(err);
		reportError(err);

		if (res.headersSent) return next(err);
		res.status(500).render('error', {
			title: '',
			styles: [],
			scripts: [],
			message: 'Internal Server Error',
			google_place_id: env.GOOGLE_PLACE_ID,
		});
	});
}

export function registerProcessHandlers() {
	process.on('uncaughtException', (err) => {
		logger.fatal(err);
		reportError(err);
	});
	process.on('unhandledRejection', (reason) => {
		logger.fatal(reason);
		reportError(reason);
	});
}

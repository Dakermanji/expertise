//! config/errorHandler.js

import { logger } from '../utils/logger.js';
import { reportError } from './sentry.js';

export function registerErrorHandlers(app) {
	app.use((err, req, res, next) => {
		logger.error(err);
		reportError(err);

		if (res.headersSent) return next(err);
		res.status(500).render('error', {
			title: '',
			message: 'Internal Server Error',
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

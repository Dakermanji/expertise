//! app.js

/**
 * Entry point of the Expertise Pro web application.
 * -------------------------------------------------
 * This file:
 *  - Loads environment variables
 *  - Creates and starts the HTTP server
 *  - Registers process-level error handlers
 *  - Starts scheduled background tasks (e.g., Google Reviews sync)
 */

import env from './config/dotenv.js';
import app from './config/express.js';
import { logger } from './utils/logger.js';
import { registerProcessHandlers } from './config/errorHandler.js';
import { startGoogleReviewsCron } from './cron/reviewsCron.js';
import http from 'http';

/**
 * Create a raw HTTP server around the Express app.
 * (In production we can later switch to HTTPS if needed.)
 */
const server = http.createServer(app);

/**
 * Start listening for incoming connections.
 * Logs the URL for quick reference.
 */
server.listen(env.PORT, () => {
	logger.info(
		`🟢💻 [Server] Server is running at ${env.PROTOCOL}://${env.HOST}:${env.PORT}`
	);
});

/**
 * Capture and log low-level server errors
 * such as EADDRINUSE or permission issues.
 */
server.on('error', (err) => logger.error(err));

/**
 * Register handlers for unhandled errors at the process level
 * (uncaught exceptions and unhandled promise rejections).
 * Keeps the app from silently crashing.
 */
registerProcessHandlers();

/**
 * Start background cron job for fetching and caching
 * Google Reviews periodically.
 * Wrapped in try/catch to prevent cron failure from breaking startup.
 */
try {
	startGoogleReviewsCron();
} catch (err) {
	logger.error(`⭐ [Cron] Failed to start Google Reviews cron: ${err}`);
}

/**
 * Graceful shutdown handler — optional but useful
 * for WHC or any shared hosting that might send SIGTERM.
 */
process.on('SIGTERM', () => {
	logger.info('🚩💻 [Process] SIGTERM received, shutting down gracefully...');
	server.close(() => {
		logger.info('🟢💻 [Server] Closed successfully.');
		process.exit(0);
	});
});

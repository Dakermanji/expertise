//! app.js

import env from './config/dotenv.js';
import app from './config/express.js';
import { logger } from './utils/logger.js';
import { registerProcessHandlers } from './config/errorHandler.js';
import { startGoogleReviewsCron } from './cron/reviewsCron.js';
import http from 'http';

const server = http.createServer(app);

server.listen(env.PORT, () => {
	logger.info(`Server running at http://${env.HOST}:${env.PORT}`);
});

server.on('error', (err) => logger.error(err));

// Capture fatal/unhandled process errors
registerProcessHandlers();

// Start scheduled cron safely
try {
	startGoogleReviewsCron();
} catch (err) {
	logger.error(`Failed to start Google Reviews cron: ${err}`);
}

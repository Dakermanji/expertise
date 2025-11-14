//! utils/logger.js
/**
 * Custom Logger Utility
 * ---------------------
 * Provides lightweight structured logging with:
 *  - Emoji-based status indicators
 *  - Timestamps
 *  - Automatic log file creation
 *  - Separate files for errors and fatal events
 *  - Safe handling of thrown errors vs plain messages
 *
 * Log Levels:
 *  🟢 info   - Normal operation messages
 *  🟡 warn   - Recoverable or expected issues
 *  🔴 error  - Logged to errors.log
 *  ☠️ fatal  - Logged to fatal.log (critical, may crash process)
 */

import fs from 'fs';
import path from 'path';

// Create /logs directory if not present
const logDir = path.resolve('logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

/**
 * Write a message into a log file with ISO timestamp.
 */
function writeLog(file, message) {
	const filePath = path.join(logDir, file);
	const timestamp = new Date().toISOString();
	fs.appendFileSync(filePath, `[${timestamp}] ${message}\n\n`);
}

/**
 * Normalize any error/message into a clean string.
 */
function normalizeMessage(input) {
	if (input instanceof Error) return input.stack || input.message;
	if (typeof input === 'object') return JSON.stringify(input, null, 2);
	return String(input);
}

/**
 * Logger object
 */
export const logger = {
	/**
	 * 🟢 INFO
	 * Informational messages about normal operation.
	 */
	info: (msg) => {
		console.log(`🟢${normalizeMessage(msg)}`);
	},

	/**
	 * 🟡 WARN
	 * Non-fatal issues, unexpected behavior, or soft failures.
	 */
	warn: (msg) => {
		console.warn(`🟡${normalizeMessage(msg)}`);
	},

	/**
	 * 🔴 ERROR
	 * Errors that get logged to errors.log but don't crash the app.
	 */
	error: (err) => {
		const text = normalizeMessage(err);
		writeLog('errors.log', text);
		console.error(`🔴${text}`);
	},

	/**
	 * ☠️ FATAL
	 * Critical failures that likely lead to shutdown.
	 */
	fatal: (err) => {
		const text = normalizeMessage(err);
		writeLog('fatal.log', text);
		console.error(`☠️${text}`);
	},
};

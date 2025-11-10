//! utils/logger.js

import fs from 'fs';
import path from 'path';

const logDir = path.resolve('logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

function writeLog(file, message) {
	const filePath = path.join(logDir, file);
	const timestamp = new Date().toISOString();
	fs.appendFileSync(filePath, `[${timestamp}] ${message}\n\n`);
}

export const logger = {
	info: (msg) => console.log(`ℹ️ ${msg}`),
	warn: (msg) => console.warn(`⚠️ ${msg}`),
	error: (err) => {
		const text = err?.stack || err?.message || String(err);
		writeLog('errors.log', text);
		console.error(`❌ ${text}`);
	},
	fatal: (err) => {
		const text = err?.stack || err?.message || String(err);
		writeLog('fatal.log', text);
		console.error(`🚨 FATAL: ${text}`);
	},
};

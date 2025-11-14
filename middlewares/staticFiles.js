//! middlewares/staticFiles.js

/**
 * Static file middleware
 * ----------------------
 * Serves static assets (CSS, JS, images, videos, etc.) from the /public directory.
 *
 * This middleware should be registered early, before routes,
 * so that requests for static files don’t reach route handlers unnecessarily.
 *
 * Example usage:
 *   /public/css/style.css  →  accessible at  /css/style.css
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

/**
 * Resolve the current file path since ES Modules do not support __dirname natively.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Registers Express static file serving middleware.
 * Uses a relative path to the project’s /public directory.
 */
export function staticFiles(app) {
	const publicPath = path.join(__dirname, '..', 'public');

	app.use(
		express.static(publicPath, {
			maxAge: '1d', // Cache static assets for 1 day in production
			etag: true, // Enables ETag headers for efficient caching
		})
	);

	logger.info(`📁 [Static] Serving files from: ${publicPath}`);
}

//! middlewares/bodyParsers.js

/**
 * Body parsing middleware
 * -----------------------
 * Adds support for parsing incoming request bodies in various formats.
 *
 * Features:
 *  - Parses JSON payloads (for APIs or fetch requests)
 *  - Parses URL-encoded form data (for HTML form submissions)
 *
 * This middleware must be applied early in the stack — before routes and sessions.
 */

import express from 'express';

/**
 * Registers body parser middleware on the Express app.
 *
 * @param {import('express').Express} app - The Express application instance.
 */
export function bodyParsers(app) {
	// Parse application/x-www-form-urlencoded (form submissions)
	app.use(express.urlencoded({ extended: false }));

	// Parse application/json (AJAX or API requests)
	app.use(express.json({ limit: '1mb' })); // optional limit to prevent abuse
}

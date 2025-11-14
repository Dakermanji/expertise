//! config/middleware.js

/**
 * Global middleware configuration
 * --------------------------------
 * Applies all core middleware to the Express app in a consistent order.
 *
 * Order is important:
 * 1. Body parsers and static files come first.
 * 2. View engine setup before any session or flash logic.
 * 3. Session and flash must be ready before localization.
 * 4. Full URL middleware before i18n to provide language detection context.
 */

import { viewEngine } from '../middlewares/viewEngine.js';
import { initializeSession } from '../middlewares/session.js';
import { initializeFlash } from '../middlewares/flash.js';
import { setupI18n } from '../middlewares/i18n.js';
import { bodyParsers } from '../middlewares/bodyParsers.js';
import { staticFiles } from '../middlewares/staticFiles.js';
import { initializeFullUrl } from '../middlewares/fullUrl.js';

/**
 * Apply all global middlewares to the Express app.
 * Each middleware encapsulates its own setup logic.
 */
const applyMiddlewares = (app) => {
	// Parse request bodies and handle static assets early
	bodyParsers(app);
	staticFiles(app);

	// Initialize EJS (or another view engine)
	viewEngine(app);

	// Enable sessions and flash messages
	initializeSession(app);
	initializeFlash(app);

	// Compute full URL info
	initializeFullUrl(app);

	// Setup multilingual support (English, French, Arabic)
	setupI18n(app);
};

export default applyMiddlewares;

//! config/routes.js

/**
 * Application route configuration
 * --------------------------------
 * Centralizes and registers all route groups for the app.
 * Keeps the main Express configuration file clean and organized.
 *
 * Each route file should export an Express Router instance.
 * Example:
 *   import express from 'express';
 *   const router = express.Router();
 *   router.get('/', controllerFunction);
 *   export default router;
 */

import indexRoutes from '../routes/indexRoutes.js';
import langRoutes from '../routes/langRoutes.js';
import bookingRoutes from '../routes/bookingRoutes.js';

/**
 * Registers all route groups on the provided Express app instance.
 * New route modules (auth, chat, payments, etc.) can be added here easily.
 */
export default function setupRoutes(app) {
	// Homepage and general pages
	app.use('/', indexRoutes);

	// Language switcher and localization routes
	app.use('/lang', langRoutes);

	// Booking system routes (driving lessons, rentals, etc.)
	app.use('/booking', bookingRoutes);
}

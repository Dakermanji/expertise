//! config/express.js

/**
 * Express application configuration
 * ---------------------------------
 * This module:
 *  - Creates and configures the Express instance.
 *  - Initializes Sentry (error tracking).
 *  - Applies all global middlewares.
 *  - Registers the app routes.
 *  - Adds the global error handler.
 *
 * The resulting app instance is imported by app.js,
 * where it is wrapped in an HTTP server.
 */

import express from 'express';
import applyMiddlewares from './middleware.js';
import setupRoutes from './routes.js';
import { initSentry } from './sentry.js';
import { registerErrorHandlers } from './errorHandler.js';
import env from './dotenv.js';

/**
 * Create an Express application instance.
 * This is the core of the web server.
 */
const app = express();

/**
 * Enable 'trust proxy' when running behind a reverse proxy (e.g., WHC, Nginx, or Cloudflare).
 * This ensures that secure cookies and HTTPS redirects work properly.
 *
 * When 'trust proxy' is true, Express will respect the 'X-Forwarded-Proto' and
 * 'X-Forwarded-For' headers set by the proxy.
 */
if (env.PROTOCOL === 'https') {
	app.set('trust proxy', true);
}

/**
 * Initialize Sentry for monitoring errors and performance.
 * Will only activate if SENTRY_DSN is provided in .env.
 */
initSentry(app);

/**
 * Apply all middleware functions to the app.
 * Includes session, i18n, flash, parsers, static files, etc.
 */
applyMiddlewares(app);

/**
 * Register all defined routes (index, language, booking, etc.).
 * Keeps route organization modular and scalable.
 */
setupRoutes(app);

/**
 * Register a centralized error handler
 * that catches unhandled errors and renders error pages gracefully.
 */
registerErrorHandlers(app);

/**
 * Export the configured app instance.
 * The HTTP server (in app.js) will import and start it.
 */
export default app;

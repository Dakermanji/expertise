//! middlewares/sessionMiddleware.js

/**
 * Session middleware
 * ------------------
 * Configures Express sessions using in-memory storage by default.
 *
 * Sessions are required for:
 *  - Flash messages
 *  - Authentication (local or OAuth)
 *  - Persistent user data between requests
 *
 * Notes:
 *  - Uses the SESSION_SECRET from .env for encryption.
 *  - Default cookie max age: 2 hours.
 *  - Safe for development; consider a persistent store (e.g., MySQL, Redis)
 *    for production to prevent session loss on restart.
 */

import session from 'express-session';
import env from '../config/dotenv.js';
import { logger } from '../utils/logger.js';

/**
 * Initialize and attach the session middleware.
 * Applies secure cookie settings dynamically based on the environment.
 *
 * @param {import('express').Express} app - The Express application instance.
 */
export function initializeSession(app) {
	const isProduction = env.PROTOCOL === 'https';

	app.use(
		session({
			secret: env.SESSION_SECRET,
			resave: false, // avoids unnecessary session saves
			saveUninitialized: false, // avoids empty session creation
			cookie: {
				httpOnly: true, // prevents client-side JS access to cookies
				secure: isProduction, // use HTTPS-only cookies in production
				maxAge: 1000 * 60 * 60 * 2, // 2 hours
				sameSite: isProduction ? 'strict' : 'lax', // stronger CSRF protection
			},
		})
	);

	const mode = isProduction ? 'secure' : 'dev';
	const message = `🔐 [Session] Initialized (${mode} mode, 2h lifetime)`;

	// Production → info, Development → warn
	if (isProduction) {
		logger.info(message);
	} else {
		logger.warn(message);
	}
}

/**
 * * Later:
 * For persistent sessions:
 *   import MySQLStore from 'express-mysql-session';
 *   const store = new MySQLStore({}, promisePool);
 *   session({ store, ...options })
 */

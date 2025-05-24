//! middlewares/sessionMiddleware.js

import session from 'express-session';
import env from '../config/dotenv.js';

// Session middleware (required for flash + login)
export function initializeSession(app) {
	app.use(
		session({
			secret: env.SESSION_SECRET,
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 2, // 2 hours
			},
		})
	);
}

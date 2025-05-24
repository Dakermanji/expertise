//! middlewares/flashMiddleware.js

import flash from 'express-flash';

// Adds flash() method to req and exposes res.locals.{success,error}
export function initializeFlash(app) {
	app.use(flash());

	// Custom: expose to views
	app.use((req, res, next) => {
		res.locals.success = req.flash('success');
		res.locals.error = req.flash('error');
		next();
	});
}

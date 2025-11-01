//! middlewares/flashMiddleware.js

import flash from 'connect-flash';

export function initializeFlash(app) {
	app.use(flash());

	app.use((req, res, next) => {
		if (req.method === 'GET') {
			const success = req.flash('success');
			const error = req.flash('error');
			res.locals.messages = { success, error };
		}
		next();
	});
}

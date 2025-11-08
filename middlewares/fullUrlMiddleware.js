//! middlewares/fullUrlMiddleware.js

function fullUrlMiddleware(req, res, next) {
	const protocol = req.protocol;
	const host = req.get('host');
	const path = req.originalUrl;

	res.locals.fullUrl = `${protocol}://${host}${path}`;
	next();
}

export function initializeFullUrl(app) {
	app.use(fullUrlMiddleware);
}

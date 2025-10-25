//! config/routes.js

import indexRoutes from '../routes/indexRoutes.js';
import langRoutes from '../routes/langRoutes.js';
import bookingRoutes from '../routes/bookingRoutes.js';

export default function setupRoutes(app) {
	app.use('/', indexRoutes);
	app.use('/lang', langRoutes);
	app.use('/booking', bookingRoutes);
}

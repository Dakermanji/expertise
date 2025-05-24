//! config/routes.js

import indexRoutes from '../routes/indexRoutes.js';

// Register all routes here
export default function setupRoutes(app) {
	app.use('/', indexRoutes);
}

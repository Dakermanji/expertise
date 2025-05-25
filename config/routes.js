//! config/routes.js

import indexRoutes from '../routes/indexRoutes.js';
import aboutRoutes from '../routes/aboutRoutes.js';

// Register all routes here
export default function setupRoutes(app) {
	app.use('/', indexRoutes);
	app.use('/about', aboutRoutes);
}

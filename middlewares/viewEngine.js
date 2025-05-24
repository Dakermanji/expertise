//! middlewares/viewEngine.js

import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure EJS + Layout system
export function viewEngine(app) {
	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, '..', 'views'));
	app.use(expressLayouts);
	app.set('layout', 'layout'); // default layout file: views/layout.ejs
}

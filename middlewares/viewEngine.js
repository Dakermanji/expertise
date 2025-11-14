//! middlewares/viewEngine.js

/**
 * View engine configuration (EJS)
 * -------------------------------
 * Sets up EJS as the templating engine with express-ejs-layouts.
 *
 * Features:
 *  - Enables reusable layouts (e.g., header/footer)
 *  - Centralizes view directory setup
 *  - Makes template rendering consistent across routes
 *
 * Example:
 *   res.render('index', { title: 'Home' });
 *   → views/index.ejs (wrapped by views/layout.ejs)
 */

import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';

/**
 * Resolve directory for ES Modules
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Registers and configures the EJS view engine with layout support.
 *
 * @param {import('express').Express} app - The Express application instance.
 */
export function viewEngine(app) {
	try {
		app.set('view engine', 'ejs');
		app.set('views', path.join(__dirname, '..', 'views'));

		// Enable EJS layouts (DRY structure for header/footer)
		app.use(expressLayouts);

		// Set default layout file (views/layout.ejs)
		app.set('layout', 'layout');

		console.log(
			'🟢🎨 [ViewEngine] EJS with layouts initialized successfully.'
		);
	} catch (err) {
		console.error(
			'🔴🎨 [ViewEngine] Failed to initialize EJS:',
			err.message
		);
	}
}

/**
 * Note:
 * You can later support multiple layout themes (e.g. "adminLayout", "userLayout")
 * by passing { layout: 'adminLayout' } to res.render().
 */

//! middlewares/i18nMiddleware.js

import i18n from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure i18n translation middleware
export function setupI18n(app) {
	i18n.configure({
		locales: ['en', 'fr', 'ar'],
		defaultLocale: 'en',
		queryParameter: 'lang',
		directory: path.join(__dirname, '..', 'locales'),
		autoReload: true,
		syncFiles: true,
		cookie: 'lang',
		objectNotation: true,
		fallbacks: { fr: 'en', ar: 'en' },
	});
	app.use(i18n.init);

	// Make current language accessible to views
	app.use((req, res, next) => {
		res.locals.currentLang = req.getLocale();
		res.locals.__ = res.__; // for global access in views
		next();
	});
}

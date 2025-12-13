//! middlewares/i18n.js

/**
 * Internationalization (i18n) middleware
 * --------------------------------------
 * Provides multilingual support using the `i18n` npm package.
 *
 * Features:
 *  - Supports English, French, and Arabic (expandable)
 *  - Automatically reloads locale files in development
 *  - Detects language from session or browser
 *  - Exposes `__` helper with default fallback support in EJS templates
 *  - Keeps translation keys synchronized across locales
 */

import i18n from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

// Supported locales
export const SUPPORTED_LANGS = ['en', 'fr', 'ar', 'es', 'de'];

// Setup __dirname since ES Modules don’t support it natively
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configure and initialize i18n middleware.
 * Should be applied after fullUrlMiddleware and before routes.
 *
 * @param {import('express').Express} app - The Express application instance.
 */
export function setupI18n(app) {
	i18n.configure({
		// Supported locales
		locales: SUPPORTED_LANGS,

		// Default language (French preferred for Montreal)
		defaultLocale: 'fr',

		// Directory containing translation JSON files
		directory: path.join(__dirname, '..', 'locales'),

		autoReload: true,
		syncFiles: true,
		objectNotation: true,

		// Fallbacks to French if key or language missing
		fallbacks: { en: 'fr', ar: 'fr', es: 'fr', de: 'fr' },
	});

	app.use(i18n.init);

	/**
	 * Locale selection logic
	 * ----------------------
	 * Uses session language if set, otherwise detects from browser.
	 * Exposes helpers and language info to templates.
	 */
	app.use((req, res, next) => {
		if (req.session.lang) {
			req.setLocale(req.session.lang);
		} else {
			req.session.lang = req.getLocale();
		}

		// Attach the active language to locals
		res.locals.currentLang = req.getLocale();

		/**
		 * Expose a safer translation helper to EJS.
		 * Allows optional fallback default value:
		 *   <%= __(‘missing.key’, 'Default text') %>
		 */
		res.locals.__ = (key, fallback = '') => {
			const translation = res.__(key);
			// If i18n returns the key itself, fallback to provided default
			return translation === key ? fallback || key : translation;
		};

		// Full catalog for the current locale
		res.locals.translations = i18n.getCatalog(req);

		next();
	});

	logger.info('🌐 [i18n] Multilingual support initialized.');
}

/**
 * Tip:
 * To add new languages (e.g., Spanish, German):
 *  1. Add locale code to `locales` above.
 *  2. Create /locales/[code].json file.
 *  3. Restart app — autoReload syncs new keys automatically.
 */

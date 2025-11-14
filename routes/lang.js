//! routes/lang.js

/**
 * Language routes
 * ----------------
 * Handles language switching for the multilingual interface.
 *
 * Example:
 *   GET /lang/en  → sets session language to English
 *   GET /lang/fr  → sets session language to French
 *   GET /lang/ar  → sets session language to Arabic
 *
 * After switching, the controller redirects the user
 * back to the previous page or home by default.
 */

import express from 'express';
import { setLang } from '../controllers/lang.js';

const router = express.Router();

/**
 * Route: GET /lang/:code
 * ----------------------
 * :code → the language code (e.g., 'en', 'fr', 'ar')
 *
 * Calls the controller that updates the session language and redirects.
 */
router.get('/:code', setLang);

export default router;

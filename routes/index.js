//! routes/index.js

/**
 * Home Routes
 * -----------
 * Handles all main website landing page requests.
 *
 * Example:
 *   GET /  → renders the homepage (index)
 *
 * The controller returns the fully localized and
 * dynamic home page using the configured view engine.
 */

import express from 'express';
import { getHome } from '../controllers/index.js';

const router = express.Router();

/**
 * Route: GET /
 * -----------
 * Renders the main landing page of the website.
 */
router.get('/', getHome);

export default router;

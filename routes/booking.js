//! routes/booking.js

/**
 * Booking Routes
 * --------------
 * Defines all routes related to booking SAAQ exam car rentals and
 * improvement driving lessons.
 *
 * Responsibilities:
 *   - Serve the booking page with all required localized content
 *   - Validate booking form input before processing
 *   - Forward valid submissions to the booking controller
 *
 * Routes:
 *   GET  /booking  → Render the booking page
 *   POST /booking  → Validate and submit the booking form
 *
 * Notes:
 *   - Validation logic lives in middlewares/validators/booking.js
 *   - Processing logic (email sending) lives in controllers/booking.js
 */

import express from 'express';
import { getBooking, handleBooking } from '../controllers/booking.js';
import { validateBooking } from '../middlewares/validators/booking.js';

const router = express.Router();

/**
 * Route: GET /booking
 * -------------------
 * Renders the booking page using the configured view engine.
 *
 * Injects:
 *   - Localized page title (meta.titles.booking)
 *   - Section-specific CSS and JS assets
 *   - Google Place ID for review links
 */
router.get('/', getBooking);

// Alias route: auto-select car rental
router.get('/rental', (req, res) =>
	getBooking(req, res, { preselect: 'rental' })
);

// Alias route: auto-select improvement lessons
router.get('/improvement', (req, res) =>
	getBooking(req, res, { preselect: 'improvement' })
);

/**
 * Route: POST /booking
 * --------------------
 * Processes booking form submissions.
 *
 * Flow:
 *   1. validateBooking middleware:
 *        - Sanitizes & validates all user input
 *        - Ensures date is within allowed range
 *        - Returns multiple localized errors if validation fails
 *
 *   2. handleBooking controller:
 *        - Sends booking details via email
 *        - Flashes success or error messages
 *
 * Expected request body fields:
 *   - service_type
 *   - full_name
 *   - phone
 *   - preferred_date
 *   - preferred_language
 *   - notes (optional)
 */
router.post('/', validateBooking, handleBooking);

export default router;

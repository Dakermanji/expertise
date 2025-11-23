//! routes/booking.js

/**
 * Booking Routes
 * --------------
 * Handles all requests related to booking driving lessons or SAAQ exam car rentals.
 *
 * Example:
 *   GET  /booking   → Renders the booking page
 *   POST /booking   → Submits booking form data and sends email notification
 *
 * The controller handles both rendering and form processing.
 */

import express from 'express';
import { getBooking, handleBooking } from '../controllers/booking.js';

const router = express.Router();

/**
 * Route: GET /booking
 * -------------------
 * Renders the booking page, including all localized text,
 * required CSS sections, and the Google Place ID for links.
 */
router.get('/', getBooking);

/**
 * Route: POST /booking
 * --------------------
 * Handles form submission from the booking page.
 * Sends the booking request to the administrative email.
 *
 * Expected request body:
 *   - service_type
 *   - name, phone, preferred_date, preferred_language, notes (varies)
 *
 * On success → flashes success message
 * On failure → flashes error message
 */
router.post('/', handleBooking);

export default router;

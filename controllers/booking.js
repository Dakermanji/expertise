//! controllers/booking.js

/**
 * Booking Controller
 * ------------------
 * Handles rendering of the booking page and processing of booking submissions.
 *
 * Expected Routes:
 *   GET  /booking  → Renders the booking form
 *   POST /booking  → Sends booking email and returns flash feedback
 */

import env from '../config/dotenv.js';
import { sendBookingEmail } from '../utils/bookingMailer.js';
import { logger } from '../utils/logger.js';

/**
 * Renders the booking page (views/booking.ejs)
 *
 * Injects:
 *  - Page title (meta.titles.booking)
 *  - Section-specific CSS files
 *  - booking.js client script
 *  - Google Place ID for localized review links
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function getBooking(req, res) {
	res.render('booking', {
		title: 'booking',
		styles: ['booking_page'],
		scripts: ['booking'],
		google_place_id: env.GOOGLE_PLACE_ID,
	});
}

/**
 * Handles booking form submission
 * -------------------------------
 * Sends an email containing all booking information to the admin inbox.
 *
 * Flow:
 *   1. Extracts booking fields from req.body
 *   2. Sends email via nodemailer (sendBookingEmail)
 *   3. On success → flash success message
 *   4. On failure → flash error message & logs error
 *   5. Redirects back to /booking
 *
 * Notes:
 *   - Validation middleware should be added later for security.
 *   - Consider rate limiting and spam protection.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function handleBooking(req, res) {
	const { service_type, ...data } = req.body;

	try {
		await sendBookingEmail({ serviceType: service_type, data });

		req.flash('success', 'flash.booking.sent');
		logger.info('📧 [Booking] Booking email sent successfully.');
	} catch (err) {
		logger.error(`📧 [Booking] Failed to send booking email: ${err}`);
		req.flash('error', 'flash.booking.error');
	}

	res.redirect('/booking');
}

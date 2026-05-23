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
import {
	createMontrealCarRentalCheckoutSession,
	getMontrealCarRentalPaymentSummary,
	requiresMontrealCarRentalPayment,
} from '../utils/payments.js';

/**
 * Booking Controller
 * ------------------
 * Renders the booking page with all required assets and metadata.
 *
 * Supports optional pre-selection of a booking service when coming
 * from alias routes:
 *   /booking/car_rental
 *   /booking/improvement_lessons
 *
 * Injected into the view:
 *  - title              → Localization key (meta.titles.booking)
 *  - styles             → booking_page.css
 *  - scripts            → booking.js (for service selection logic)
 *  - google_place_id    → For review links and Google integrations
 *  - preselect          → Optional service auto-selection ("car_rental" or "improvement_lessons")
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Object} [extra]            Additional parameters (used for pre-selection)
 * @param {string|null} [extra.preselect]  Pre-selected service identifier
 */
export function getBooking(req, res, extra = {}) {
	const { preselect = null } = extra;

	res.render('booking', {
		title: 'booking',
		styles: ['booking_page'],
		scripts: ['booking'],
		google_place_id: env.GOOGLE_PLACE_ID,
		preselect,
		montrealCarRentalPayment: getMontrealCarRentalPaymentSummary(
			req.getLocale()
		),
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

	if (requiresMontrealCarRentalPayment(req.body)) {
		try {
			const session = await createMontrealCarRentalCheckoutSession(req, req.body);
			return res.redirect(303, session.url);
		} catch (err) {
			logger.error(`💳 [Booking] Failed to start Stripe Checkout: ${err}`);
			req.flash('error', 'flash.payment.error');
			return res.redirect('/booking');
		}
	}

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

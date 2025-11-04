//! controllers/bookingController.js

import env from '../config/dotenv.js';
import { sendBookingEmail } from '../utils/bookingMailer.js';

export async function getBooking(req, res) {
	res.render('booking', {
		title: 'Booking',
		styles: ['booking_page'],
		scripts: ['booking'],
		google_place_id: env.GOOGLE_PLACE_ID,
	});
}

export async function handleBooking(req, res) {
	const { service_type, ...data } = req.body;

	try {
		await sendBookingEmail({ serviceType: service_type, data });
		req.flash('success', 'flash.booking.sent');
	} catch (err) {
		console.error('Booking email error:', err);
		req.flash('error', 'flash.booking.error');
	}
	res.redirect('/booking');
}

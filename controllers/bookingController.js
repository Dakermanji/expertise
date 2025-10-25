//! controllers/bookingController.js

export async function getBooking(req, res) {
	res.render('booking', {
		title: 'Booking',
		styles: ['booking_page'],
		scripts: ['booking'],
	});
}

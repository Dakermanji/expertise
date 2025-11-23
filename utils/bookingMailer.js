//! utils/bookingMailer.js

/**
 * Booking Mailer Utility
 * ----------------------
 * Handles sending booking request emails through Nodemailer.
 *
 * Used by:
 *   - controllers/booking.js → handleBooking()
 *
 * Responsibilities:
 *   ✓ Build a consistent email subject based on service type
 *   ✓ Format incoming form data with labels
 *   ✓ Send the email using the pre-configured transporter
 *
 * Notes:
 *   - The same email is used for both sender and recipient (admin-only)
 *   - Booking emails contain only user-provided fields, formatted safely in HTML
 */

import env from '../config/dotenv.js';
import transporter from '../config/nodemailer.js';

/**
 * Sends a booking request email.
 *
 * @param {Object} payload
 * @param {string} payload.serviceType - Service selected by the user (car_rental, improvement_lessons)
 * @param {Object} payload.data - All other form fields submitted by the client
 *
 * @returns {Promise<void>} Sends the email asynchronously
 */
export async function sendBookingEmail({ serviceType, data }) {
	/**
	 * Map of service types to human-readable email subjects.
	 * Falls back to a generic subject if the key is missing.
	 */
	const subjectMap = {
		car_rental: 'New Car Rental Booking Request',
		improvement_lessons: 'New Improvement Lesson Booking Request',
	};

	const subject = subjectMap[serviceType] || 'New Booking Request';

	/**
	 * Convert incoming form data into readable HTML list entries.
	 * Example:
	 *   full_name: "John Doe" → "<strong>full name:</strong> John Doe<br />"
	 */
	const formattedData = Object.entries(data)
		.map(([key, value]) => {
			const label = key.replace(/_/g, ' ');
			return `<strong>${label}:</strong> ${value}<br />`;
		})
		.join('\n');

	/**
	 * Nodemailer configuration for sending the message.
	 * Currently sends email only to the configured admin inbox.
	 */
	const mailOptions = {
		from: env.EMAIL_USER, // sender
		to: env.EMAIL_USER, // recipient (admin inbox)
		subject,
		html: `
      <p>You have received a new booking request for <strong>${serviceType}</strong>.</p>
      <hr />
      ${formattedData}
      <hr />
      <p>This message was sent from the Expertise Pro website booking form.</p>
    `,
	};

	// Send the email via Nodemailer transporter
	return transporter.sendMail(mailOptions);
}

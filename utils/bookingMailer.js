//! utils/bookingMailer.js

import env from '../config/dotenv.js';
import transporter from '../config/nodemailer.js';

export async function sendBookingEmail({ serviceType, data }) {
	const subjectMap = {
		car_rental: 'New Car Rental Booking Request',
		improvement_lessons: 'New Improvement Lesson Booking Request',
	};

	const subject = subjectMap[serviceType] || 'New Booking Request';

	const formattedData = Object.entries(data)
		.map(
			([key, value]) =>
				`<strong>${key.replace(/_/g, ' ')}:</strong> ${value}<br />`
		)
		.join('\n');

	const mailOptions = {
		from: env.EMAIL_USER,
		to: env.EMAIL_USER,
		subject,
		html: `
      <p>You have received a new booking request for <strong>${serviceType}</strong>.</p>
      <hr />
      ${formattedData}
      <hr />
      <p>This message was sent from the Expertise Pro website booking form.</p>
    `,
	};

	return transporter.sendMail(mailOptions);
}

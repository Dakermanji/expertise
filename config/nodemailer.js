//! config/nodemailer.js

/**
 * Nodemailer configuration
 * ------------------------
 * Handles email delivery setup for the Expertise Pro platform.
 *
 * Uses environment-based credentials and service selection.
 *
 * Example environment variables:
 *   EMAIL_SERVICE=gmail
 *   EMAIL_USER=example@gmail.com
 *   EMAIL_PASS=app_specific_password
 *
 * This transporter can be imported anywhere emails need to be sent:
 *   import transporter from '../config/nodemailer.js';
 *   await transporter.sendMail({...});
 */

import nodemailer from 'nodemailer';
import env from './dotenv.js';
import { logger } from '../utils/logger.js';

/**
 * Create the email transporter using credentials from .env.
 * By default, this uses a predefined email service (e.g., Gmail, Outlook, etc.).
 * For production SMTP servers, replace 'service' with 'host' + 'port' + 'secure'.
 */
const transporter = nodemailer.createTransport({
	service: env.EMAIL_SERVICE,
	auth: {
		user: env.EMAIL_USER,
		pass: env.EMAIL_PASS,
	},
});

/**
 * Optional: Verify the transporter configuration.
 * Helps catch invalid credentials or connectivity issues at startup.
 * This check runs only once when the app initializes.
 */
transporter
	.verify()
	.then(() =>
		logger.info('✉️ [Nodemailer] Transporter verified successfully.')
	)
	.catch((err) =>
		logger.error(
			`✉️ [Nodemailer] Transporter verification failed: ${err.message}`
		)
	);

export default transporter;

//! controllers/payments.js

import env from '../config/dotenv.js';
import { sendBookingEmail } from '../utils/bookingMailer.js';
import { logger } from '../utils/logger.js';
import { getStripeClient } from '../utils/payments.js';

export async function getPaymentSuccess(req, res) {
	const stripe = getStripeClient();
	const sessionId = req.query.session_id;

	if (!stripe || !sessionId) {
		req.flash('error', 'flash.payment.error');
		return res.redirect('/booking');
	}

	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status !== 'paid') {
			req.flash('error', 'flash.payment.error');
			return res.redirect('/booking');
		}

		req.flash('success', 'flash.payment.success');
		return res.redirect('/');
	} catch (err) {
		logger.error(`💳 [Payment] Failed to retrieve checkout session: ${err}`);
		req.flash('error', 'flash.payment.error');
		return res.redirect('/booking');
	}
}

export function getPaymentCancel(req, res) {
	req.flash('error', 'flash.payment.cancelled');
	res.redirect('/booking');
}

export async function handleStripeWebhook(req, res) {
	const stripe = getStripeClient();

	if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
		logger.error('💳 [Stripe] Webhook received before Stripe was configured.');
		return res.sendStatus(500);
	}

	let event;

	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			req.headers['stripe-signature'],
			env.STRIPE_WEBHOOK_SECRET
		);
	} catch (err) {
		logger.warn(`💳 [Stripe] Invalid webhook signature: ${err.message}`);
		return res.sendStatus(400);
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;

		if (session.payment_status === 'paid') {
			const metadata = session.metadata || {};

			try {
				await sendBookingEmail({
					serviceType: metadata.service_type,
					data: {
						...metadata,
						payment_status: 'paid',
						stripe_checkout_session_id: session.id,
					},
				});
				logger.info(`💳 [Stripe] Paid booking email sent for ${session.id}.`);
			} catch (err) {
				logger.error(`💳 [Stripe] Failed to send paid booking email: ${err}`);
				return res.sendStatus(500);
			}
		}
	}

	res.sendStatus(200);
}

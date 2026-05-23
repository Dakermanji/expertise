//! controllers/payments.js

import env from '../config/dotenv.js';
import { sendBookingEmail } from '../utils/bookingMailer.js';
import { logger } from '../utils/logger.js';
import {
	buildPaidBookingEmailData,
	getStripeClient,
} from '../utils/payments.js';

async function sendPaidBookingEmailOnce(stripe, session, source) {
	const latestSession = await stripe.checkout.sessions.retrieve(session.id);
	const metadata = latestSession.metadata || {};

	if (metadata.admin_booking_email_sent === 'true') {
		logger.info(
			`💳 [Stripe] Paid booking email already sent for ${latestSession.id}.`
		);
		return;
	}

	await sendBookingEmail({
		serviceType: metadata.service_type,
		data: buildPaidBookingEmailData(latestSession),
	});

	await stripe.checkout.sessions.update(latestSession.id, {
		metadata: {
			...metadata,
			admin_booking_email_sent: 'true',
			admin_booking_email_source: source,
			admin_booking_email_sent_at: new Date().toISOString(),
		},
	});

	logger.info(
		`💳 [Stripe] Paid booking email sent for ${latestSession.id} from ${source}.`
	);
}

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

		try {
			await sendPaidBookingEmailOnce(stripe, session, 'success_redirect');
		} catch (err) {
			logger.error(
				`💳 [Payment] Payment succeeded but admin email failed for ${session.id}: ${err}`
			);
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
			try {
				await sendPaidBookingEmailOnce(stripe, session, 'webhook');
			} catch (err) {
				logger.error(`💳 [Stripe] Failed to send paid booking email: ${err}`);
				return res.sendStatus(500);
			}
		}
	}

	res.sendStatus(200);
}

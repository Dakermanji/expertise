//! utils/payments.js

import Stripe from 'stripe';
import env from '../config/dotenv.js';

const GST_RATE = 0.05;
const QST_RATE = 0.09975;

export const MONTREAL_CAR_RENTAL_PAYMENT = {
	serviceType: 'car_rental',
	region: 'montreal',
	currency: env.PAYMENT_CURRENCY.toLowerCase(),
	subtotalCents: env.MONTREAL_CAR_RENTAL_PRICE_CENTS,
	gstCents: Math.round(env.MONTREAL_CAR_RENTAL_PRICE_CENTS * GST_RATE),
	qstCents: Math.round(env.MONTREAL_CAR_RENTAL_PRICE_CENTS * QST_RATE),
};

MONTREAL_CAR_RENTAL_PAYMENT.totalCents =
	MONTREAL_CAR_RENTAL_PAYMENT.subtotalCents +
	MONTREAL_CAR_RENTAL_PAYMENT.gstCents +
	MONTREAL_CAR_RENTAL_PAYMENT.qstCents;

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

export function getStripeClient() {
	return stripe;
}

export function requiresMontrealCarRentalPayment(data) {
	return (
		data.service_type === MONTREAL_CAR_RENTAL_PAYMENT.serviceType &&
		data.region === MONTREAL_CAR_RENTAL_PAYMENT.region
	);
}

export function formatMoney(
	cents,
	currency = MONTREAL_CAR_RENTAL_PAYMENT.currency,
	locale = 'en-CA',
) {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency.toUpperCase(),
	}).format(cents / 100);
}

function getMoneyLocale(locale) {
	const localeMap = {
		ar: 'ar-CA',
		de: 'de-CA',
		en: 'en-CA',
		es: 'es-CA',
		fr: 'fr-CA',
	};

	return localeMap[locale] || 'en-CA';
}

export function getMontrealCarRentalPaymentSummary(locale = 'en') {
	const moneyLocale = getMoneyLocale(locale);

	return {
		subtotal: formatMoney(
			MONTREAL_CAR_RENTAL_PAYMENT.subtotalCents,
			MONTREAL_CAR_RENTAL_PAYMENT.currency,
			moneyLocale,
		),
		gst: formatMoney(
			MONTREAL_CAR_RENTAL_PAYMENT.gstCents,
			MONTREAL_CAR_RENTAL_PAYMENT.currency,
			moneyLocale,
		),
		qst: formatMoney(
			MONTREAL_CAR_RENTAL_PAYMENT.qstCents,
			MONTREAL_CAR_RENTAL_PAYMENT.currency,
			moneyLocale,
		),
		total: formatMoney(
			MONTREAL_CAR_RENTAL_PAYMENT.totalCents,
			MONTREAL_CAR_RENTAL_PAYMENT.currency,
			moneyLocale,
		),
	};
}

function getBaseUrl(req) {
	if (env.PUBLIC_BASE_URL) return env.PUBLIC_BASE_URL.replace(/\/$/, '');
	return `${req.protocol}://${req.get('host')}`;
}

function safeMetadataValue(value) {
	return String(value || '').slice(0, 450);
}

function buildBookingMetadata(data) {
	return {
		service_type: safeMetadataValue(data.service_type),
		student_name: safeMetadataValue(data.student_name),
		phone: safeMetadataValue(data.phone),
		email: safeMetadataValue(data.email),
		region: safeMetadataValue(data.region),
		exam_date: safeMetadataValue(data.exam_date),
		exam_time: safeMetadataValue(data.exam_time),
		preferred_language: safeMetadataValue(data.preferred_language),
		notes: safeMetadataValue(data.notes),
		subtotal: formatMoney(MONTREAL_CAR_RENTAL_PAYMENT.subtotalCents),
		gst: formatMoney(MONTREAL_CAR_RENTAL_PAYMENT.gstCents),
		qst: formatMoney(MONTREAL_CAR_RENTAL_PAYMENT.qstCents),
		total: formatMoney(MONTREAL_CAR_RENTAL_PAYMENT.totalCents),
	};
}

function requirePayPalConfig() {
	if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
		throw new Error(
			`PayPal is not configured. Missing ${env.PAYPAL_CLIENT_ID_NAME} or ${env.PAYPAL_CLIENT_SECRET_NAME}.`
		);
	}
}

async function getPayPalAccessToken() {
	requirePayPalConfig();

	const credentials = Buffer.from(
		`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`
	).toString('base64');

	const response = await fetch(`${env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${credentials}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: 'grant_type=client_credentials',
	});

	if (!response.ok) {
		throw new Error(`PayPal token request failed with ${response.status}.`);
	}

	const data = await response.json();
	return data.access_token;
}

export function buildPaidBookingEmailData(session) {
	const metadata = session.metadata || {};

	return {
		...metadata,
		payment_status: session.payment_status,
		stripe_checkout_session_id: session.id,
		stripe_payment_intent_id: session.payment_intent || '',
	};
}

export function buildPaidPayPalBookingEmailData(order, bookingData) {
	const capture =
		order.purchase_units?.[0]?.payments?.captures?.[0] || {};

	return {
		...buildBookingMetadata(bookingData),
		payment_status: capture.status || order.status,
		paypal_order_id: order.id,
		paypal_capture_id: capture.id || '',
	};
}

export async function createMontrealCarRentalCheckoutSession(req, data) {
	if (!stripe) {
		throw new Error('Stripe is not configured. Missing configured secret key.');
	}

	const baseUrl = getBaseUrl(req);
	const metadata = buildBookingMetadata(data);

	return stripe.checkout.sessions.create({
		mode: 'payment',
		customer_email: data.email || undefined,
		locale: 'auto',
		submit_type: 'pay',
		success_url: `${baseUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${baseUrl}/payments/cancel`,
		invoice_creation: {
			enabled: true,
			invoice_data: {
				description: 'Montreal SAAQ car rental booking',
				metadata,
			},
		},
		line_items: [
			{
				quantity: 1,
				price_data: {
					currency: MONTREAL_CAR_RENTAL_PAYMENT.currency,
					unit_amount: MONTREAL_CAR_RENTAL_PAYMENT.subtotalCents,
					product_data: {
						name: 'Montreal SAAQ car rental',
					},
				},
			},
			{
				quantity: 1,
				price_data: {
					currency: MONTREAL_CAR_RENTAL_PAYMENT.currency,
					unit_amount: MONTREAL_CAR_RENTAL_PAYMENT.gstCents,
					product_data: {
						name: 'GST (5%)',
					},
				},
			},
			{
				quantity: 1,
				price_data: {
					currency: MONTREAL_CAR_RENTAL_PAYMENT.currency,
					unit_amount: MONTREAL_CAR_RENTAL_PAYMENT.qstCents,
					product_data: {
						name: 'QST (9.975%)',
					},
				},
			},
		],
		metadata,
		payment_intent_data: {
			description: 'Montreal SAAQ car rental booking',
			metadata,
			receipt_email: data.email || undefined,
		},
	});
}

export async function createMontrealCarRentalPayPalOrder(req, data) {
	const accessToken = await getPayPalAccessToken();
	const baseUrl = getBaseUrl(req);
	const metadata = buildBookingMetadata(data);
	const total = (MONTREAL_CAR_RENTAL_PAYMENT.totalCents / 100).toFixed(2);
	const subtotal = (MONTREAL_CAR_RENTAL_PAYMENT.subtotalCents / 100).toFixed(2);
	const gst = (MONTREAL_CAR_RENTAL_PAYMENT.gstCents / 100).toFixed(2);
	const qst = (MONTREAL_CAR_RENTAL_PAYMENT.qstCents / 100).toFixed(2);

	const response = await fetch(`${env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			intent: 'CAPTURE',
			purchase_units: [
				{
					description: 'Montreal SAAQ car rental booking',
					custom_id: metadata.email || metadata.phone,
					amount: {
						currency_code: MONTREAL_CAR_RENTAL_PAYMENT.currency.toUpperCase(),
						value: total,
						breakdown: {
							item_total: {
								currency_code: MONTREAL_CAR_RENTAL_PAYMENT.currency.toUpperCase(),
								value: total,
							},
						},
					},
					items: [
						{
							name: 'Montreal SAAQ car rental',
							quantity: '1',
							unit_amount: {
								currency_code: MONTREAL_CAR_RENTAL_PAYMENT.currency.toUpperCase(),
								value: subtotal,
							},
						},
						{
							name: 'GST (5%)',
							quantity: '1',
							unit_amount: {
								currency_code: MONTREAL_CAR_RENTAL_PAYMENT.currency.toUpperCase(),
								value: gst,
							},
						},
						{
							name: 'QST (9.975%)',
							quantity: '1',
							unit_amount: {
								currency_code: MONTREAL_CAR_RENTAL_PAYMENT.currency.toUpperCase(),
								value: qst,
							},
						},
					],
				},
			],
			payment_source: {
				paypal: {
					experience_context: {
						brand_name: 'Expertise Pro',
						shipping_preference: 'NO_SHIPPING',
						user_action: 'PAY_NOW',
						return_url: `${baseUrl}/payments/paypal/return`,
						cancel_url: `${baseUrl}/payments/paypal/cancel`,
					},
				},
			},
		}),
	});

	if (!response.ok) {
		throw new Error(`PayPal order request failed with ${response.status}.`);
	}

	const order = await response.json();
	const approvalLink = order.links?.find((link) => link.rel === 'payer-action')
		|| order.links?.find((link) => link.rel === 'approve');

	if (!approvalLink?.href) {
		throw new Error('PayPal order did not include an approval link.');
	}

	return { order, approvalUrl: approvalLink.href };
}

export async function capturePayPalOrder(orderId) {
	const accessToken = await getPayPalAccessToken();

	const response = await fetch(
		`${env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		}
	);

	if (!response.ok) {
		throw new Error(`PayPal capture request failed with ${response.status}.`);
	}

	return response.json();
}

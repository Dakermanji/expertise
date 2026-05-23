//! controllers/legal.js

const LEGAL_PAGES = {
	privacy: {
		title: 'Privacy Policy',
		updated: 'May 23, 2026',
		intro:
			'This policy explains how Expertise Pro collects, uses, stores, and protects personal information submitted through this website.',
		sections: [
			{
				heading: 'Information we collect',
				body: [
					'Booking details such as name, phone number, email address, selected service, region, exam date, preferred language, and notes.',
					'Payment status and transaction references from Stripe or PayPal after a payment is completed.',
					'Technical information required to operate the site, such as session cookies, language preference, and basic server logs.',
				],
			},
			{
				heading: 'How we use information',
				body: [
					'To respond to booking requests, process payments, confirm appointments, provide customer support, and maintain business records.',
					'We do not sell personal information. We do not use booking information for marketing unless you separately agree to receive marketing messages.',
				],
			},
			{
				heading: 'Payment providers',
				body: [
					'Payments are processed by third-party providers such as Stripe and PayPal. Payment card or wallet details are handled by those providers, not stored by Expertise Pro.',
				],
			},
			{
				heading: 'Retention and access',
				body: [
					'We keep booking and payment records only as long as reasonably needed for customer service, accounting, fraud prevention, and legal obligations.',
					'You may contact us to request access, correction, or deletion of your personal information, subject to legal and business record requirements.',
				],
			},
			{
				heading: 'Contact',
				body: [
					'For privacy questions, contact us at location.que.ca@gmail.com.',
				],
			},
		],
	},
	cookies: {
		title: 'Cookie Policy',
		updated: 'May 23, 2026',
		intro:
			'This page explains what cookies and similar browser storage are used on this website.',
		sections: [
			{
				heading: 'Essential cookies',
				body: [
					'The site uses essential cookies for sessions, flash messages, language preference, and payment return flows. These are required for the website to work properly.',
				],
			},
			{
				heading: 'Consent storage',
				body: [
					'Your cookie choice is stored in your browser using localStorage. This avoids showing the banner on every visit.',
				],
			},
			{
				heading: 'Analytics and marketing cookies',
				body: [
					'We do not currently use analytics or marketing cookies. If those are added later, the banner should be updated so visitors can reject non-essential cookies before they are loaded.',
				],
			},
			{
				heading: 'Third-party services',
				body: [
					'Stripe, PayPal, Google Maps, or other third-party services may use their own cookies or browser storage when you interact with their services.',
				],
			},
		],
	},
	terms: {
		title: 'Terms of Service',
		updated: 'May 23, 2026',
		intro:
			'These terms describe the conditions for using the Expertise Pro website and booking services.',
		sections: [
			{
				heading: 'Booking requests',
				body: [
					'Submitting a booking form or payment does not automatically guarantee appointment availability. We will contact you to confirm the booking details.',
				],
			},
			{
				heading: 'Customer responsibilities',
				body: [
					'You are responsible for providing accurate contact, exam, location, and licence-related information.',
					'You must meet all SAAQ and legal requirements for the service you request.',
				],
			},
			{
				heading: 'Payments',
				body: [
					'Online payments may be processed by Stripe, PayPal, or another provider shown at checkout. Payment provider terms may also apply.',
				],
			},
			{
				heading: 'Website content',
				body: [
					'We try to keep information accurate, but prices, service areas, appointment availability, and policies may change.',
				],
			},
		],
	},
	'cancellation-refund': {
		title: 'Cancellation and Refund Policy',
		updated: 'May 23, 2026',
		intro:
			'This policy explains how cancellations, rescheduling, and refunds are handled for booking requests.',
		sections: [
			{
				heading: 'Appointment confirmation',
				body: [
					'Payment confirms that we received your request. The final appointment details are confirmed by phone, email, or message after we review availability.',
				],
			},
			{
				heading: 'Cancellations and rescheduling',
				body: [
					'Please contact us as early as possible if you need to cancel or reschedule. We generally require at least 24 hours notice.',
				],
			},
			{
				heading: 'Refunds',
				body: [
					'If we cannot provide the requested service, we will offer a reschedule or refund where appropriate.',
					'Payment processor fees, short-notice cancellations, no-shows, or incorrect information provided by the customer may affect refund eligibility.',
				],
			},
			{
				heading: 'Contact',
				body: ['For cancellation or refund questions, contact us at location.que.ca@gmail.com.'],
			},
		],
	},
};

export function getLegalPage(req, res) {
	const page = LEGAL_PAGES[req.params.page];

	if (!page) {
		return res.status(404).render('error', {
			title: 'error',
			message: 'Page not found',
		});
	}

	return res.render('legal', {
		title: 'legal',
		styles: ['legal'],
		page,
	});
}

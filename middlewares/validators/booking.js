//! middlewares/validators/booking.js

import validator from 'validator';
import { logger } from '../../utils/logger.js';

const ALLOWED_SERVICES = ['car_rental', 'improvement_lessons'];
const ALLOWED_LANGS = ['en', 'fr', 'ar', 'de', 'es'];
const BOOKING_FIELD_NAMES = [
	'service_type',
	'student_name',
	'phone',
	'email',
	'region',
	'exam_date',
	'exam_time',
	'preferred_date',
	'preferred_time',
	'preferred_language',
	'notes',
	'payment_provider',
];

function preserveBookingInput(req) {
	const preservedInput = {};

	BOOKING_FIELD_NAMES.forEach((field) => {
		if (req.body[field] !== undefined) {
			preservedInput[field] = String(req.body[field]);
		}
	});

	req.flash('booking_input', JSON.stringify(preservedInput));
}

function parseDateOnly(value) {
	const [year, month, day] = String(value).split('-').map(Number);

	if (!year || !month || !day) return null;

	return new Date(year, month - 1, day);
}

function startOfToday() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return today;
}

export function validateBooking(req, res, next) {
	const errors = [];

	const {
		service_type = '',
		student_name = '',
		phone = '',
		preferred_language = '',
		notes = '',
	} = req.body;

	const preferred_date = req.body.preferred_date || req.body.exam_date;

	/** SERVICE TYPE */
	if (!ALLOWED_SERVICES.includes(service_type)) {
		errors.push('flash.booking.invalid_service');
	}

	/** NAME */
	const cleanName = validator.trim(student_name);
	if (!validator.isLength(cleanName, { min: 2, max: 60 })) {
		errors.push('flash.booking.invalid_name');
	}

	/** PHONE */
	const cleanPhone = validator.trim(phone);
	if (!validator.isMobilePhone(cleanPhone, 'any')) {
		errors.push('flash.booking.invalid_phone');
	}

	/** DATE */
	if (!preferred_date || !validator.isDate(preferred_date)) {
		errors.push('flash.booking.invalid_date');
	} else {
		const today = startOfToday();
		const chosen = parseDateOnly(preferred_date);

		const max = new Date();
		max.setHours(0, 0, 0, 0);
		max.setDate(max.getDate() + 60);

		if (!chosen) {
			errors.push('flash.booking.invalid_date');
		} else {
			if (chosen < today) errors.push('flash.booking.date_past');
			if (chosen > max) errors.push('flash.booking.date_too_far');
		}
	}

	/** LANGUAGE */
	if (!ALLOWED_LANGS.includes(preferred_language)) {
		errors.push('flash.booking.invalid_language');
	}

	/** SANITIZE NOTES */
	req.body.notes = validator.escape(notes);

	/** HANDLE ERRORS */
	if (errors.length > 0) {
		logger.warn(`📋 [Booking] Validation failed with ${errors.length} error(s).`);
		preserveBookingInput(req);
		req.flash('error_list', errors);
		return res.redirect('/booking');
	}

	// Save sanitized values
	req.body.student_name = cleanName;
	req.body.phone = cleanPhone;

	next();
}

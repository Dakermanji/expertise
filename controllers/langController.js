//! routes/langController.js

import express from 'express';
const router = express.Router();

export async function setLang(req, res) {
	const supported = ['en', 'fr', 'ar'];
	const code = req.params.code;

	if (supported.includes(code)) {
		req.session.lang = code;
		req.setLocale(code);
	}

	const returnTo = req.get('Referer') || '/';
	res.redirect(returnTo);
}

export default router;

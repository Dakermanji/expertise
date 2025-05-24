//! middlewares/bodyParsers.js

import express from 'express';

// Middleware to parse form and JSON bodies
export function bodyParsers(app) {
	app.use(express.urlencoded({ extended: false })); // Parses URL-encoded forms
	app.use(express.json()); // Parses JSON payloads (e.g. from API clients)
}

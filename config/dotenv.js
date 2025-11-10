//! config/dotenv.js

import dotenv from 'dotenv';
dotenv.config();

// Utility to throw errors for required variables
function requireEnv(variable) {
	const value = process.env[variable];
	if (!value) {
		throw new Error(`[Missing Env]: ${variable} is required`);
	}
	return value;
}

// Utility for optional envs
function optionalEnv(variable, defaultValue) {
	if (!process.env[variable]) {
		console.warn(
			`[Default Env]: ${variable} not found, using ${defaultValue}`
		);
	}
	return process.env[variable] || defaultValue;
}

const env = {
	// Server
	PORT: optionalEnv('PORT', 3000),
	HOST: optionalEnv('HOST', 'localhost'),
	SESSION_SECRET: requireEnv('SESSION_SECRET'),

	// Database
	DB_HOST: optionalEnv('DB_HOST', 'localhost'),
	DB_USER: optionalEnv('DB_USER', 'root'),
	DB_PASSWORD: requireEnv('DB_PASSWORD'),
	DB_NAME: requireEnv('DB_NAME'),
	DB_PORT: optionalEnv('DB_PORT', 3305),

	// Google
	GOOGLE_PLACE_ID: requireEnv('GOOGLE_PLACE_ID'),
	GOOGLE_API_KEY: requireEnv('GOOGLE_API_KEY'),

	// Email
	EMAIL_SERVICE: optionalEnv('EMAIL_SERVICE', 'gmail'),
	EMAIL_USER: requireEnv('EMAIL_USER'),
	EMAIL_PASS: requireEnv('EMAIL_PASS'),

	// Sentry
	SENTRY_DSN: optionalEnv('SENTRY_DSN', ''),
	SENTRY_PROJECT_ID: optionalEnv('SENTRY_PROJECT_ID', ''),
};

export default env;

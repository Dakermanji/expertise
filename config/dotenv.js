//! config/dotenv.js

/**
 * Loads environment variables and provides a strict, validated configuration object.
 * -------------------------------------------------------------------------------
 * - Throws on missing required variables to prevent silent misconfigurations.
 * - Provides default values for optional variables with a clear console warning.
 * - Centralized configuration for server, database, Google APIs, email, and Sentry.
 */

import dotenv from 'dotenv';
dotenv.config();

/**
 * Throws an error if a required environment variable is missing.
 * Helps catch deployment issues early.
 */
function requireEnv(variable) {
	const value = process.env[variable];
	if (!value) {
		throw new Error(`[Missing Env]: ${variable} is required`);
	}
	return value;
}

/**
 * Returns the value of an optional environment variable.
 * Falls back to a default value if not found and logs a warning.
 */
function optionalEnv(variable, defaultValue) {
	if (!process.env[variable]) {
		console.warn(
			`🟡⚙️ [Default Env]: ${variable} not found, using ${defaultValue}`
		);
	}
	return process.env[variable] || defaultValue;
}

/**
 * Main environment configuration object.
 * Centralizes access to all application-level variables.
 */
const env = {
	// Server
	PROTOCOL: optionalEnv('PROTOCOL', 'http'), // corrected key here
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

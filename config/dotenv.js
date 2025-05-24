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
	PORT: optionalEnv('PORT', 3000),
	HOST: optionalEnv('HOST', 'localhost'),
	SESSION_SECRET: requireEnv('SESSION_SECRET'),

	// DB Config
	DB_HOST: optionalEnv('DB_HOST', 'localhost'),
	DB_USER: optionalEnv('DB_USER', 'root'),
	DB_PASSWORD: requireEnv('DB_PASSWORD'),
	DB_NAME: requireEnv('DB_NAME'),
	DB_PORT: optionalEnv('DB_PORT', 3305),
};

export default env;

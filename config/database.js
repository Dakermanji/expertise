//! config/database.js

/**
 * Database configuration (MySQL)
 * -------------------------------
 * Establishes and exports a connection pool using mysql2.
 * Provides both callback-based and promise-based interfaces.
 *
 * Key features:
 *  - Connection pooling for better performance
 *  - Safe reconnection via waitForConnections
 *  - Promise wrapper for modern async/await syntax
 */

import mysql from 'mysql2';
import dotenv from './dotenv.js';
import { logger } from '../utils/logger.js';

/**
 * Create a connection pool for reusing MySQL connections.
 * This improves scalability and avoids exhausting connections under load.
 */
const pool = mysql.createPool({
	host: dotenv.DB_HOST,
	port: dotenv.DB_PORT,
	user: dotenv.DB_USER,
	password: dotenv.DB_PASSWORD,
	database: dotenv.DB_NAME,
	waitForConnections: true, // waits instead of throwing on max connections
	connectionLimit: 10, // can be tuned based on expected concurrency
	queueLimit: 0, // unlimited queued connection requests
});

/**
 * Convert the pool into a Promise-based interface for async/await usage.
 * Example:
 *   const [rows] = await promisePool.query('SELECT * FROM users');
 */
const promisePool = pool.promise();

/**
 * Optional: Basic connection test (can be commented out in production)
 * Helps verify DB credentials and connectivity during startup.
 */
(async () => {
	try {
		const connection = await promisePool.getConnection();
		logger.info('💾 [Database] Connected successfully.');
		connection.release();
	} catch (err) {
		logger.error(`💾 [Database] Connection failed: ${err.message}`);
	}
})();

/**
 * Safe query executor — wraps all DB calls with unified try/catch.
 * Always returns: { rows, fields, error }
 *
 * Usage:
 *   const { rows, error } = await db.query('SELECT ...');
 */
export const db = {
	async query(sql, params = []) {
		try {
			const [rows, fields] = await promisePool.query(sql, params);
			return { rows, fields, error: null };
		} catch (error) {
			logger.error(`💾 [DB ERROR] ${error.message} — SQL: ${sql}`);
			return { rows: null, fields: null, error };
		}
	},

	async execute(sql, params = []) {
		try {
			const [result] = await promisePool.execute(sql, params);
			return { result, error: null };
		} catch (error) {
			logger.error(`💾 [DB ERROR] ${error.message} — SQL: ${sql}`);
			return { result: null, error };
		}
	},
};


export { pool, promisePool };
export default db;

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
		console.log('🟢💾 [Database] Connected successfully.');
		connection.release();
	} catch (err) {
		console.error('🔴💾 [Database] Connection failed:', err.message);
	}
})();

export { pool, promisePool };

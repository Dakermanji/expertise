//! config/database.js

import mysql from 'mysql2';
import dotenv from './dotenv.js';

const pool = mysql.createPool({
	host: dotenv.DB_HOST,
	port: dotenv.DB_PORT,
	user: dotenv.DB_USER,
	password: dotenv.DB_PASSWORD,
	database: dotenv.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

const promisePool = pool.promise();

export { pool, promisePool };

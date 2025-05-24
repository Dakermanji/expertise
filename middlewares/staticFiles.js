//! middlewares/staticFiles.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to serve public static files
export function staticFiles(app) {
	app.use(express.static(path.join(__dirname, '..', 'public')));
}

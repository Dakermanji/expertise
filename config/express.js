//! config/express.js

// Import the Express library
import express from 'express';

// Import the middleware initialization function
import applyMiddlewares from './middleware.js';

// Create an Express application instance
const app = express();

// Apply all core middlewares
applyMiddlewares(app);

// Placeholder for routes (we’ll connect router later)
app.get('/', (req, res) => {
	res.render('home', { title: 'Welcome to Expertise' });
});

// Export the app instance so it can be used by app.js
export default app;

//! config/express.js

// External Imports
import express from 'express';

// Import the middleware initialization function
import applyMiddlewares from './middleware.js';

// Routes imports
import setupRoutes from './routes.js';

// Create an Express application instance
const app = express();

// Apply all core middlewares
applyMiddlewares(app);

// Apply Routes
setupRoutes(app);

// Export the app instance so it can be used by app.js
export default app;

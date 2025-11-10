//! config/express.js

import express from 'express';
import applyMiddlewares from './middleware.js';
import setupRoutes from './routes.js';
import { initSentry } from './sentry.js';
import { registerErrorHandlers } from './errorHandler.js';

// Create an Express application instance
const app = express();

// Sentry
initSentry(app);

// Apply all core middlewares
applyMiddlewares(app);

// Apply Routes
setupRoutes(app);

// Error handler
registerErrorHandlers(app);

// Export the app instance so it can be used by app.js
export default app;

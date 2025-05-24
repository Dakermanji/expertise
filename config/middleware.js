//! config/middleware.js

import { viewEngine } from '../middlewares/viewEngine.js';
import { initializeSession } from '../middlewares/sessionMiddleware.js';
import { initializeFlash } from '../middlewares/flashMiddleware.js';
import { setupI18n } from '../middlewares/i18nMiddleware.js';
import { bodyParsers } from '../middlewares/bodyParsers.js';
import { staticFiles } from '../middlewares/staticFiles.js';

const applyMiddlewares = (app) => {
	bodyParsers(app);
	staticFiles(app);
	viewEngine(app);
	initializeSession(app);
	initializeFlash(app);
	setupI18n(app);
};

export default applyMiddlewares;

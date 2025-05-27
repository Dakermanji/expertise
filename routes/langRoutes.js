//! routes/langRoutes.js

import express from 'express';
import { setLang } from '../controllers/langController.js';
const router = express.Router();

router.get('/:code', setLang);

export default router;

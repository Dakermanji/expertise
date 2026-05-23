//! routes/legal.js

import express from 'express';
import { getLegalPage } from '../controllers/legal.js';

const router = express.Router();

router.get('/:page', getLegalPage);

export default router;

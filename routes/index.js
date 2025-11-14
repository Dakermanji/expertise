//! routes/index.js

import express from 'express';
import { getHome } from '../controllers/index.js';

const router = express.Router();

router.get('/', getHome);

export default router;

//! routes/bookingRoutes.js

import express from 'express';
import { getBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.get('/', getBooking);

export default router;

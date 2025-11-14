//! routes/booking.js

import express from 'express';
import { getBooking, handleBooking } from '../controllers/booking.js';

const router = express.Router();

router.get('/', getBooking);
router.post('/', handleBooking);

export default router;

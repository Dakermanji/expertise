//! routes/payments.js

import express from 'express';
import {
	getPaymentCancel,
	getPaymentSuccess,
} from '../controllers/payments.js';

const router = express.Router();

router.get('/success', getPaymentSuccess);
router.get('/cancel', getPaymentCancel);

export default router;

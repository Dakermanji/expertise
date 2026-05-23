//! routes/payments.js

import express from 'express';
import {
	getPayPalCancel,
	getPayPalReturn,
	getPaymentCancel,
	getPaymentSuccess,
} from '../controllers/payments.js';

const router = express.Router();

router.get('/success', getPaymentSuccess);
router.get('/cancel', getPaymentCancel);
router.get('/paypal/return', getPayPalReturn);
router.get('/paypal/cancel', getPayPalCancel);

export default router;

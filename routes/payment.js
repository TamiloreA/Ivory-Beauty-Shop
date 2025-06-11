const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { requireLogin } = require('../middlewares/auth');

router.post('/initiate', requireLogin, paymentController.initiatePayment);
router.get('/verify', paymentController.verifyPayment);
router.post('/webhook', express.json({ type: 'application/json' }), paymentController.webhookHandler);

module.exports = router;
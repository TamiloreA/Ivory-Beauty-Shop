const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireLogin } = require('../middlewares/auth');

// Checkout process
router.get('/checkout', requireLogin, orderController.getCheckout);
router.post('/place-order', requireLogin, orderController.placeOrder);

// Order confirmation
router.get('/confirmation/:id', requireLogin, orderController.getOrderConfirmation);

module.exports = router;
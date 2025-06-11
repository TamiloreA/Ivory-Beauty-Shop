const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { requireLogin } = require('../middlewares/auth');

router.post('/add-to-cart', requireLogin, cartController.addToCart);
router.get('/', requireLogin, cartController.viewCart);

router.put('/update-quantity', requireLogin, cartController.updateQuantity);
router.delete('/remove-item', requireLogin, cartController.removeItem);

module.exports = router;

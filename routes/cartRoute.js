const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { requireLogin } = require('../middlewares/auth');
const { getCartCount } = require('../controllers/userController')

router.post('/add-to-cart', requireLogin, cartController.addToCart);
router.get('/count', requireLogin, async (req, res) => {
    try {
        const count = await getCartCount(req.session.userId);
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/', requireLogin, cartController.viewCart);

router.put('/update-quantity', requireLogin, cartController.updateQuantity);
router.delete('/remove-item', requireLogin, cartController.removeItem);

module.exports = router;

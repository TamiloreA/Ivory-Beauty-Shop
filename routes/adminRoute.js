const express = require('express');
const router = express.Router();
const auth = require('../controllers/adminAuthController');
const admin = require('../controllers/adminController');
const upload = require('../config/upload');

router.get('/signup', auth.getSignup);
router.post('/signup', auth.signup);
router.get('/login', auth.getLogin);
router.post('/login', auth.login);
router.get('/logout', auth.logout);

router.get('/dashboard', auth.requireAuth, admin.adminDashboard);
router.get('/collections', auth.requireAuth, admin.viewCollections);
router.get('/products', auth.requireAuth, admin.viewProducts);
router.get('/orders', auth.requireAuth, admin.viewOrders);
router.get('/customers', auth.requireAuth, admin.viewCustomers);

router.post('/add-collection', auth.requireAuth, admin.addCollection);
router.post('/add-product', 
    auth.requireAuth,
    upload.single('image'),
    admin.addProduct
);

router.post('/edit-product/:id',
    auth.requireAuth,
    upload.single('image'), 
    admin.updateProduct
);
router.post('/edit-collection/:id', auth.requireAuth, admin.updateCollection);


router.post('/delete-product/:id', auth.requireAuth, admin.deleteProduct);
router.post('/delete-collection/:id', auth.requireAuth, admin.deleteCollection);

router.get('/export-orders', auth.requireAuth, admin.exportRecentOrders);
router.put('/update-order-status', auth.requireAuth, admin.updateOrderStatus);



module.exports = router;

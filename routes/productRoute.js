const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

router.get('/products', controller.showAllProducts);
router.get('/collections', controller.showCollections);
router.get('/collections/:id', controller.showCollectionProducts);
router.get('/search', controller.searchProducts);

module.exports = router;

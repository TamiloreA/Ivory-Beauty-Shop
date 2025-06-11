const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.landingPage);
router.get('/signup', userController.getSignup);
router.post('/signup', userController.signup);
router.get('/about', userController.about);

router.get('/login', userController.getLogin);
router.post('/login', userController.login);

router.get('/logout', userController.logout);


module.exports = router;
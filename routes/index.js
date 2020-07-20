const express = require('express');

const router = express.Router();
const authCtrl = require('../controllers/auth');
const userCtrl = require('../controllers/user');
const cartCtrl = require('../controllers/cart');
const middleware = require('../controllers/verifyToken');

router.post('/login', authCtrl.AuthObj.login);
router.post('/validate-token', middleware.verifyToken, authCtrl.AuthObj.isValidToken);

router.post('/user/register', userCtrl.UserObj.register.bind(userCtrl.UserObj));
router.get('/user/activate/*', userCtrl.activateUser);
router.get('/user/user-profile', middleware.verifyToken, userCtrl.UserObj.userProfile.bind(userCtrl.UserObj));

router.get('/user/get-cart', middleware.checkTokenAvailable, cartCtrl.CartObj.getCartItems);
router.post('/user/add-to-cart', middleware.checkTokenAvailable, cartCtrl.CartObj.addToCart);
router.post('/user/delete-cart-item', middleware.checkTokenAvailable, cartCtrl.CartObj.deleteCartItem);

module.exports = router;

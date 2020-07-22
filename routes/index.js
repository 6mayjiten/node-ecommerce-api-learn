const express = require('express');

const router = express.Router();
const authCtrl = require('../controllers/auth');
const userCtrl = require('../controllers/user');
const cartCtrl = require('../controllers/cart');
const addressCtrl = require('../controllers/user-address');

const middleware = require('../controllers/verifyToken');

router.post('/login', authCtrl.AuthObj.login);
router.post('/validate', middleware.verifyToken, authCtrl.AuthObj.isValidToken);

router.post('/user', userCtrl.UserObj.register.bind(userCtrl.UserObj));
router.get('/user/activate/:activationCode', userCtrl.activateUser);
router.get('/user', middleware.verifyToken, userCtrl.UserObj.userProfile.bind(userCtrl.UserObj));
router.post('/user/update', middleware.verifyToken, userCtrl.UserObj.updateUserProfile);

router.get('/user/address', middleware.verifyToken, addressCtrl.AddressObj.getAddresses);
router.get('/user/address/:id', middleware.verifyToken, addressCtrl.AddressObj.getAddressById);
router.post('/user/address', middleware.checkTokenAvailable, addressCtrl.AddressObj.addAddress.bind(addressCtrl));
router.post('/user/address/update', middleware.verifyToken, addressCtrl.AddressObj.updateAddress);
router.delete('/user/address/:id', middleware.verifyToken, addressCtrl.AddressObj.deleteAddress);

router.get('/user/cart', middleware.checkTokenAvailable, cartCtrl.CartObj.getCartItems);
router.post('/user/cart', middleware.checkTokenAvailable, cartCtrl.CartObj.addToCart);
router.post('/user/cart/update', middleware.checkTokenAvailable, cartCtrl.CartObj.deleteCartItem);
router.delete('/user/cart/:id', middleware.checkTokenAvailable, cartCtrl.CartObj.deleteCartItem);

module.exports = router;

const express = require('express');

const router = express.Router();
const authCtrl = require('../controllers/auth');
const userCtrl = require('../controllers/user');
const middleware = require('../controllers/verifyToken');

router.get('/user/activate/*', userCtrl.activate.bind(userCtrl));

router.post('/user/register', userCtrl.register.bind(userCtrl));
router.post('/user/login', authCtrl.login);
router.post('/validateToken', authCtrl.isValidToken);

router.get('/user/user-profile', middleware, userCtrl.getUserById);

module.exports = router;

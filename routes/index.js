const express = require('express');

const router = express.Router();
const authCtrl = require('../controllers/auth');
const userCtrl = require('../controllers/user');
const middleware = require('../controllers/verifyToken');

router.post('/user/register', userCtrl.register);
router.post('/user/login', authCtrl.login);
router.post('/validateToken', authCtrl.isValidToken);

router.get('/user-profile', middleware, userCtrl.getUserById);

module.exports = router;

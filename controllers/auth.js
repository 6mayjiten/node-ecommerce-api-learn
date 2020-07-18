const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config'); // get our config file
const userController = require('./user');

module.exports = {
    login: async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: true, message: 'Email or Password are missing.' });
        }
        const user = await userController.getUserByEmaill(req, res);
        if (user) {
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) return res.status(401).json({ error: true, message: 'Wrong password.' });

            const token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: '720h', // expires in 30 days
            });
            const userInfo = {
                email: user.email,
                id: user._id,
            };
            return res.status(200).json({ auth: true, token, userInfo });
        }
        return res.status(500).json({ error: true, message: 'Something went wrong.' });
    },
    isValidToken: (req, res) => {
        if (!req.body.token) {
            return res.status(403).json({ error: true, message: 'No token provided.' });
        }
        jwt.verify(req.body.token, config.secret, (err) => {
            if (err) {
                return res.status(200).json({ auth: false, message: 'Session Expired.' });
            }
            return res.status(200).json({ auth: true, message: 'authenticated successfully.' });
        });
        return res.status(500).json({ auth: false, message: 'Something went wrong.' });
    },
};

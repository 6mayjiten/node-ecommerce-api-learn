const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../config'); // get our config file

module.exports = {
    login: (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: true, message: 'Email or Password are missing.' });
        }
        db.Users.findOne({ email: req.body.email }, (err, user) => {
            if (err) return res.status(500).json({ error: true, message: 'Something went wrong.' });
            if (!user) return res.status(404).json({ error: true, message: "User doesn't exist." });

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
        });
        return res.status(500).json({ error: true, message: 'Something went wrong.' });
    },

    verifyToken: (req, res) => {
        if (!req.body.token) {
            return res.status(403).json({ error: true, message: 'No token provided.' });
        }
        jwt.verify(req.body.token, config.secret, (err) => {
            if (err) {
                return res.status(200).json({ auth: false, message: 'Session Expired.' });
            }
            return res.status(200).json({ auth: true, message: 'authenticated successfully.' });
        });
        return res.status(500).json({ auth: false, message: 'something went wrong.' });
    },
};

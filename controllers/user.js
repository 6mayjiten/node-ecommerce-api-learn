const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../config');

module.exports = {
    register: async (req, res) => {
        if (!req.body.email || !req.body.password || !req.body.first_name) {
            return res.status(400).json({ error: true, message: 'email, password or first_name parameters are missing.' });
        }
        if (req.body.password.length < 8) {
            return res.status(400).json({ error: true, message: 'Password length must be 8.' });
        }
        const userData = await this.getUserByEmail(req, res);
        if (userData) {
            return res.status(200).json({ error: true, message: 'User already exist.' });
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        const lastName = req.body.last_name ? req.body.last_name : '';

        db.Users.create({
            first_name: req.body.first_name,
            last_name: lastName,
            email: req.body.email,
            password: hashedPassword,
        },
        (err, user) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: 'There was a problem registering the user.',
                });
            }
            const token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: '720h', // expires in 30 days
            });
            const userInfo = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                id: user._id,
            };
            return res.status(200).json({ auth: true, token, userInfo });
        });
        return res.status(500).json({ error: true, message: 'something went wrong.' });
    },

    getUserByEmail: async (req, res) => {
        if (!req.body.email) {
            return res.status(400).json({ error: true, message: 'email parameters is missing.' });
        }
        await db.Users.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
                return res.status(500)
                    .json({
                        error: true,
                        message: 'Something went wrong.',
                    });
            }
            if (!user) return null;
            return user;
        });
        return null;
    },

    getUserById: async (req, res) => {
        if (!req.body.email) {
            return res.status(400).json({ error: true, message: 'email parameters is missing.' });
        }
        await db.Users.findOne({ _id: req.body.user_id }, (err, user) => {
            if (err) {
                return res.status(500)
                    .json({
                        error: true,
                        message: 'Something went wrong.',
                    });
            }
            if (!user) return null;
            return user;
        });
        return null;
    },
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../config');
const email = require('../helpers/sendgrid');

class User {
    constructor() {
        console.log('hello user controller');
        this.register = this.register.bind(this);
        this.activate = this.activate.bind(this);
    }

    static async register(req, res) {
        if (!req.body.email || !req.body.password || !req.body.confirm_password
            || !req.body.first_name) {
            return res.status(400).json({ error: true, message: 'email, password, confirm_password or first_name parameters are missing.' });
        }
        if (req.body.password.length < 8) {
            return res.status(400).json({ error: true, message: 'password length must be 8.' });
        } else if (req.body.password !== req.body.confirm_password) {
            return res.status(400).json({ error: true, message: 'password and confirm_password doesn\'t match' });
        }
        const userData = await this.getUserByEmail(req, res);
        if (userData) {
            return res.status(200).json({ error: true, message: 'User already exist.' });
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        const lastName = req.body.last_name ? req.body.last_name : '';

        await db.Users.create({
            first_name: req.body.first_name,
            last_name: lastName,
            email: req.body.email,
            password: hashedPassword,
        }, (err, user) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: 'There was a problem registering the user.',
                });
            }

            const token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: '720h', // expires in 30 days
            }).replace(/\./g, '_');
            const activationUrl = `http://${req.get('host')}/activate/${token}`;
            const htmlMessage = `Hi ${user.first_name}, <br/><br/>
            Welcome to ECommerce Please Click <a href="${activationUrl}">Here</a> to activate account.
            If you are having problem please use below url in browser.<br/><br/>
            ${activationUrl}<br/><br/>Thanks,<br/>
            Team Ecommerce`;

            email.sendMail(user.email, 'Account Activation Email', '', htmlMessage);

            const info = {
                message: 'Please check your email to activate account',
            };
            return res.status(200).json({ success: true, info });
        });
    }

    static async activate(req, res) {
        const activationToken = req.originalUrl.split('/').slice(-1)[0].replace(/_/g, '.');
        jwt.verify(activationToken, config.secret, (err, decoded) => {
            if (err) {
                return res.status(500)
                    .json({
                        error: true,
                        message: 'Failed to activate account.',
                    });
            }
            db.Users.findOneAndUpdate({ _id: decoded.id }, { is_active: true }, { new: true })
                // eslint-disable-next-line no-unused-vars
                .exec((error, user) => {
                    if (error) {
                        res.status(500).json({ success: true, message: 'Something wrong happen.' });
                    }
                    res.status(200).json({ success: true, message: 'Account activated' });
                });
        });
    }

    static async getUserById(req, res) {
        return new Promise((resolve, reject) => {
            if (!req.body.user_id) {
                return res.status(400).json({ error: true, message: 'email parameters is missing.' });
            }
            db.Users.findOne({ _id: req.body.user_id }).exec((err, user) => {
                if (err) {
                    reject(new Error({
                        error: true,
                        message: 'Something went wrong.',
                    }));
                }
                if (!user) resolve(null);
                resolve(user);
            });
        });
    }

    static async getUserByEmail(req, res) {
        return new Promise((resolve, reject) => {
            if (!req.body.email) {
                return res.status(400).json({ error: true, message: 'email parameters is missing.' });
            }
            db.Users.findOne({ email: req.body.email }).exec((err, user) => {
                if (err) {
                    reject(new Error({
                        error: true,
                        message: 'Something went wrong.',
                    }));
                }
                if (!user) resolve(null);
                resolve(user);
            });
        });
    }
}
module.exports = User;

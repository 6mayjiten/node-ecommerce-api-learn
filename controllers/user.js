const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { oneLine } = require('common-tags');
const db = require('../models');
const config = require('../config');
const email = require('../helpers/sendgrid');
const HTTPCodes = require('../helpers/httpStatusCodes');
const responseMessage = require('../helpers/responseMessage');

class User {
    constructor() {
        this.register = this.register.bind(this);
        this.activate = this.activate.bind(this);
        this.userProfile = this.userProfile.bind(this);
    }

    static async register(req, res) {
        if (!req.body.email || !req.body.password || !req.body.confirm_password
            || !req.body.first_name) {
            return res.status(HTTPCodes.BadRequestCode).json(
                responseMessage.createErrorMessage(oneLine`email, password, confirm_password or
                first_name parameters are missing.`),
            );
        }
        if (req.body.password.length < 8) {
            return res.status(HTTPCodes.BadRequestCode).json(
                responseMessage.createErrorMessage('password length must be 8.'),
            );
        } else if (req.body.password !== req.body.confirm_password) {
            return res.status(HTTPCodes.BadRequestCode).json(
                responseMessage.createErrorMessage('password and confirm_password doesn\'t match'),
            );
        }
        const userData = await this.getUserByEmail(req, res);
        if (userData) {
            return res.status(HTTPCodes.SuccessRequestCode).json(
                responseMessage.createErrorMessage('User already exist.'),
            );
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
                return res.status(HTTPCodes.InternalServerErrorCode).json(
                    responseMessage.createInternalErrorMessage(),
                );
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
            return res.status(HTTPCodes.SuccessRequestCode).json(
                responseMessage.createSuccessMessage('Please check your email to activate account'),
            );
        });
    }

    static async activate(req, res) {
        const activationToken = req.originalUrl.split('/').slice(-1)[0].replace(/_/g, '.');
        jwt.verify(activationToken, config.secret, (err, decoded) => {
            if (err) {
                return res.status(HTTPCodes.BadRequestCode).json(
                    responseMessage.createErrorMessage('Invalid activation link!'),
                );
            }
            db.Users.findOneAndUpdate({ _id: decoded.id }, { is_active: true }, { new: true })
                // eslint-disable-next-line no-unused-vars
                .exec((error, user) => {
                    if (error) {
                        res.status(HTTPCodes.InternalServerErrorCode)
                            .json(
                                responseMessage.createInternalErrorMessage(),
                            );
                    }
                    res.status(HTTPCodes.SuccessRequestCode)
                        .json(
                            responseMessage.createSuccessMessage('Account activated'),
                        );
                });
        });
    }

    static async userProfile(req, res) {
        const user = await this.getUserById(req);
        if (user) {
            res.status(HTTPCodes.SuccessRequestCode).json(
                responseMessage.createSuccessMessage({ user }),
            );
        } else {
            res.status(HTTPCodes.InternalServerErrorCode).json(
                responseMessage.createInternalErrorMessage(),
            );
        }
        return null;
    }

    static async getUserById(req) {
        return new Promise((resolve, reject) => {
            if (req.body.user_id) {
                db.Users.findOne({ _id: req.body.user_id }, { _id: 0, __v: 0, password: 0 })
                    .exec((err, user) => {
                        if (err) {
                            reject(new Error({
                                error: true,
                                message: 'Something went wrong.',
                            }));
                        }
                        if (!user) resolve(null);
                        resolve(user);
                    });
            }
        });
    }

    static async getUserByEmail(req, res) {
        return new Promise((resolve, reject) => {
            if (!req.body.email) {
                res.status(HTTPCodes.BadRequestCode).json(
                    responseMessage.createErrorMessage('email parameters is missing.'),
                );
            }
            // lean() to make response normal javascript object rather than mongoose document
            db.Users.findOne({ email: req.body.email }, { __v: 0 }).lean()
                .exec((err, user) => {
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

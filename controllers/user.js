const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../config');
const email = require('../helpers/sendgrid');
const HTTPCodes = require('../helpers/httpStatusCodes');
const responseMessage = require('../helpers/responseMessage');

class User {
    static get UserObj() {
        return new User();
    }

    async register(req, res) {
        const newUser = new db.User({
            email: req.body.email || '',
            password: req.body.password || '',
            first_name: req.body.first_name || '',
            last_name: req.body.last_name || '',
            mobile_number: req.body.mobile_number || '',
        });
        try {
            await newUser.validate();
            if (req.body.password !== req.body.confirm_password) {
                return res.status(HTTPCodes.BadRequestCode)
                    .json(
                        responseMessage.createErrorMessage('password and confirm_password doesn\'t match'),
                    );
            }
            try {
                const userData = await this.getUserByEmail(req, res);
                if (userData) {
                    return res.status(HTTPCodes.SuccessRequestCode)
                        .json(
                            responseMessage.createErrorMessage('User already exist.'),
                        );
                }
                const password = bcrypt.hashSync(req.body.password, 8);
                newUser.password = password;
                db.User.create({}, (err, user) => {
                    if (err) {
                        return res.status(HTTPCodes.InternalServerErrorCode)
                            .json(
                                responseMessage.createInternalErrorMessage(),
                            );
                    }

                    const token = jwt.sign({ id: user._id }, config.secret, {
                        expiresIn: '720h', // expires in 30 days
                    })
                        .replace(/\./g, '_');
                    const activationUrl = `http://${req.get('host')}/activate/${token}`;

                    const htmlMessage = `Hi ${user.first_name}, <br/><br/>
                    Welcome to ECommerce Please Click <a href="${activationUrl}">Here</a> to activate account.
                    If you are having problem please use below url in browser.<br/><br/>
                    ${activationUrl}<br/><br/>Thanks,<br/>
                    Team Ecommerce`;

                    email.sendMail(user.email, 'Account Activation Email', '', htmlMessage);
                    return res.status(HTTPCodes.SuccessRequestCode)
                        .json(
                            responseMessage.createSuccessMessage('Please check your email to activate account'),
                        );
                });
            } catch (err) {
                return res.status(HTTPCodes.InternalServerErrorCode)
                    .json(
                        responseMessage.createInternalErrorMessage(),
                    );
            }
        } catch (error) {
            if (error.errors) {
                const modelError = {};
                Object.keys(error.errors).forEach((err) => {
                    modelError[err] = error.errors[err].message;
                });
                return res.status(HTTPCodes.BadRequestCode).json(
                    responseMessage.createErrorMessage(modelError),
                );
            } else {
                return res.status(HTTPCodes.InternalServerErrorCode).json(
                    responseMessage.createInternalErrorMessage(),
                );
            }
        }
    }

    static activateUser(req, res) {
        let activationToken = req.params.activationCode;
        activationToken = activationToken ? activationToken.replace(/_/g, '.') : activationToken;
        jwt.verify(activationToken, config.secret, (err, decoded) => {
            if (err) {
                return res.status(HTTPCodes.BadRequestCode)
                    .json(
                        responseMessage.createErrorMessage('Invalid activation link!'),
                    );
            }
            db.User.findOneAndUpdate({ _id: decoded.id }, { is_active: true }, { new: true })
                .exec((error, user) => {
                    if (error) {
                        res.status(HTTPCodes.InternalServerErrorCode)
                            .json(
                                responseMessage.createInternalErrorMessage(),
                            );
                    }
                    if (user) {
                        res.status(HTTPCodes.SuccessRequestCode)
                            .json(
                                responseMessage.createSuccessMessage('Account activated'),
                            );
                    }
                    res.status(HTTPCodes.NotFoundCode)
                        .json(
                            responseMessage.createErrorMessage('User Not Found'),
                        );
                });
        });
    }

    async userProfile(req, res) {
        try {
            const user = await this.getUserById(req);
            if (!user) {
                return res.status(HTTPCodes.SuccessRequestCode).json(
                    responseMessage.createErrorMessage('User does\'nt exist'),
                );
            }
            return res.status(HTTPCodes.SuccessRequestCode)
                .json(
                    responseMessage.createSuccessMessage({ user }),
                );
        } catch (err) {
            return res.status(HTTPCodes.InternalServerErrorCode)
                .json(
                    responseMessage.createInternalErrorMessage(),
                );
        }
    }

    updateUserProfile(req, res) {
        db.Cart.findOneAndUpdate({
            user_id: req.body.user_id,
        }, { quantity: req.body.quantity }, {
            new: true,
            __v: 0,
        })
            .exec((error, user) => {
                if (error) {
                    return res.status(HTTPCodes.InternalServerErrorCode)
                        .json(
                            responseMessage.createInternalErrorMessage(),
                        );
                }
                return res.status(HTTPCodes.SuccessRequestCode)
                    .json(
                        responseMessage.createSuccessMessage({ user }),
                    );
            });
    }

    getUserById(req) {
        return new Promise((resolve, reject) => {
            if (req.body.user_id) {
                db.User.findOne({ _id: req.body.user_id }, {
                    _id: 0,
                    __v: 0,
                    password: 0,
                })
                    .exec((err, user) => {
                        if (err) {
                            reject(new Error({
                                error: true,
                                message: 'Something went wrong.',
                            }));
                        }
                        if (user) resolve(user);
                        resolve(null);
                    });
            }
        });
    }

    getUserByEmail(req, res) {
        return new Promise((resolve, reject) => {
            if (!req.body.email) {
                res.status(HTTPCodes.BadRequestCode)
                    .json(
                        responseMessage.createErrorMessage('email parameters is missing.'),
                    );
            }
            // lean() to make response normal javascript object rather than mongoose document
            db.User.findOne({ email: req.body.email }, { __v: 0 })
                .lean()
                .exec((err, user) => {
                    if (err) {
                        reject(new Error({
                            error: true,
                            message: 'Something went wrong.',
                        }));
                    }
                    if (user) resolve(user);
                    resolve(null);
                });
        });
    }
}

module.exports = User;

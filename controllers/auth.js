const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userController = require('./user').UserObj;
const HTTPCodes = require('../helpers/httpStatusCodes');
const responseMessage = require('../helpers/responseMessage');

class AuthController {
    static get AuthObj() { return new AuthController(); }

    async login(req, res) {
        if (!req.body.email || !req.body.password) {
            return res.status(HTTPCodes.BadRequestCode).json(
                responseMessage.createErrorMessage('Email or Password are missing.'),
            );
        }
        try {
            const user = await userController.getUserByEmail(req, res);
            if (user) {
                const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
                if (!passwordIsValid) {
                    return res.status(HTTPCodes.BadRequestCode)
                        .json(
                            responseMessage.createErrorMessage('Wrong password.'),
                        );
                }
                if (!user.is_active) {
                    return res.status(HTTPCodes.BadRequestCode)
                        .json(
                            responseMessage.createErrorMessage('User is not activated! Please check your email to activate account.'),
                        );
                }

                const token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: '720h', // expires in 30 days
                });

                delete user.password;
                delete user._id;

                return res.status(HTTPCodes.SuccessRequestCode)
                    .json(
                        responseMessage.createSuccessMessage({
                            auth: true,
                            token,
                            user,
                        }),
                    );
            }
            return res.status(HTTPCodes.SuccessRequestCode)
                .json(
                    responseMessage.createErrorMessage('User not exist.'),
                );
        } catch (e) {
            return res.status(HTTPCodes.InternalServerErrorCode)
                .json(
                    responseMessage.createInternalErrorMessage(),
                );
        }
    }

    isValidToken(req, res) {
        if (req.body.user_id) {
            return res.status(HTTPCodes.SuccessRequestCode).json(
                responseMessage.createSuccessMessage('Valid token!'),
            );
        }
        return res.status(HTTPCodes.InternalServerErrorCode).json(
            responseMessage.createInternalErrorMessage(),
        );
    }
}
module.exports = AuthController;

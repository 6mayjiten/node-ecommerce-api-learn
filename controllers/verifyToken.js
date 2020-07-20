const jwt = require('jsonwebtoken');
const config = require('../config');
const HTTPCodes = require('../helpers/httpStatusCodes');
const responseMessage = require('../helpers/responseMessage');

module.exports = {
    verifyToken: (req, res, next) => {
        // check header or url parameters or post parameters for token
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(HTTPCodes.ForbiddenCode)
                .json(
                    responseMessage.createErrorMessage('Token missing!'),
                );
        }

        // verifies secret and checks exp
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(HTTPCodes.UnauthorizedRequestCode)
                    .json(
                        responseMessage.createErrorMessage('Invalid Token!'),
                    );
            }
            // if everything is good, save to request for use in other routes
            req.body.user_id = decoded.id;
            return next();
        });
    },
    checkTokenAvailable: (req, res, next) => {
        const token = req.headers['x-access-token'];
        if (!token) {
            req.body.user_id = null;
        } else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    return res.status(HTTPCodes.UnauthorizedRequestCode)
                        .json(
                            responseMessage.createErrorMessage('Invalid Token!'),
                        );
                }
                // if everything is good, save to request for use in other routes
                req.body.user_id = decoded.id;
            });
        }
        return next();
    },
};

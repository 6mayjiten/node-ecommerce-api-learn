const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
    verifyToken: (req, res, next) => {
        // check header or url parameters or post parameters for token
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(403)
                .json({
                    error: true,
                    message: 'No token provided.',
                });
        }

        // verifies secret and checks exp
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(500)
                    .json({
                        error: true,
                        message: 'invalid token.',
                    });
            }
            // if everything is good, save to request for use in other routes
            req.body.user_id = decoded.id;
            return next();
        });
    },
};

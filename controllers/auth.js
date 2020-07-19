const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userController = require('./user');

class AuthController {
    async login(req, res) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: true, message: 'Email or Password are missing.' });
        }
        const user = await userController.getUserByEmail(req, res);
        if (user) {
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) return res.status(401).json({ error: true, message: 'Wrong password.' });

            const token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: '720h', // expires in 30 days
            });

            delete user.password;
            delete user._id;

            return res.status(200).json({
                success: true, auth: true, token, user,
            });
        }
        return res.status(200).json({ error: true, message: 'User not exist.' });
    }

    async isValidToken(req, res) {
        if (req.body.user_id) {
            return res.status(200).json({ auth: true, message: 'valid token.' });
        }
        return res.status(500).json({ auth: false, message: 'Something went wrong.' });
    }
}
module.exports = new AuthController();

const db = require('../models');
const HTTPCodes = require('../helpers/httpStatusCodes');
const responseMessage = require('../helpers/responseMessage');

class Cart {
    static get CartObj() { return new Cart(); }

    addToCart(req, res) {
        console.log(req.session.user_session);
        let cartItemToInsert;
        if (req.body.user_id) {
            cartItemToInsert = new db.Cart({
                user_id: req.body.user_id,
                product_id: req.body.product_id,
                quantity: req.body.quantity,
            });
        } else if (req.session.id) {
            cartItemToInsert = new db.Cart({
                session_id: req.session.user_session,
                product_id: req.body.product_id,
                quantity: req.body.quantity,
            });
        }
        db.Cart.create(cartItemToInsert, (err, cart) => {
            if (err) {
                res.status(HTTPCodes.InternalServerErrorCode).json(
                    responseMessage.createInternalErrorMessage(),
                );
            }
            return res.status(HTTPCodes.SuccessRequestCode).json(
                responseMessage.createSuccessMessage({ cart }),
            );
        });
    }

    getCartItems(req, res) {
        let query;
        if (req.body.user_id) {
            query = db.Cart.find({ user_id: req.body.user_id }, { __v: 0 });
        } else if (req.session.id) {
            query = db.Cart.find({ session_id: req.session.id }, { __v: 0 });
        }
        query.exec((err, result) => {
            if (err) {
                return res.status(HTTPCodes.InternalServerErrorCode).json(
                    responseMessage.createInternalErrorMessage(),
                );
            }
            return res.status(HTTPCodes.SuccessRequestCode).json(
                responseMessage.createSuccessMessage({ result }),
            );
        });
    }

    updateCartItems(req, res) {
        let query;
        if (req.body.user_id) {
            query = db.Cart.findOneAndUpdate({
                user_id: req.body.user_id,
                product_id: req.body.product_id,
            }, { quantity: req.body.quantity }, { new: true, __v: 0 });
        } else if (req.session.id) {
            query = db.Cart.findOneAndUpdate({
                session_id: req.session.id,
                product_id: req.body.product_id,
            }, { quantity: req.body.quantity }, { new: true, __v: 0 });
        }
        query.exec((err, result) => {
            if (err) {
                return res.status(HTTPCodes.InternalServerErrorCode).json(
                    responseMessage.createInternalErrorMessage(),
                );
            }
            return res.status(HTTPCodes.SuccessRequestCode).json(
                responseMessage.createSuccessMessage({ result }),
            );
        });
    }

    deleteCartItem(req, res) {
        let query;
        if (req.body.user_id) {
            query = db.Cart.findOneAndDelete({
                user_id: req.body.user_id,
                product_id: req.body.product_id,
            }, { __v: 0 });
        } else if (req.session.id) {
            query = db.Cart.findOneAndDelete({
                session_id: req.session.id,
                product_id: req.body.product_id,
            }, { __v: 0 });
        }
        query.exec((err, result) => {
            if (err) {
                return res.status(HTTPCodes.InternalServerErrorCode).json(
                    responseMessage.createInternalErrorMessage(),
                );
            }
            return res.status(HTTPCodes.SuccessRequestCode).json(
                responseMessage.createSuccessMessage({ result }),
            );
        });
    }
}
module.exports = Cart;

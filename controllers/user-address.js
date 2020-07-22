const db = require('../models');
const HTTPCodes = require('../helpers/httpStatusCodes');
const responseMessage = require('../helpers/responseMessage');

class Address {
    static get AddressObj() { return new Address(); }

    addAddress(req, res) {
        this.addAddressHelper(req.body.user_id, req.session.user_session, req.body.address)
            .then((response) => res.status(HTTPCodes.SuccessRequestCode).json(
                responseMessage.createSuccessMessage({ response }),
            ))
            .catch((error) => {
                console.log(error);
                res.status(HTTPCodes.InternalServerErrorCode).json(
                    responseMessage.createInternalErrorMessage(),
                );
            });
    }

    getAddressById(req, res) {
        const addressId = req.params.id;
        db.UserAddress.findOne({ _id: addressId, user_id: req.body.user_id })
            .exec((error, result) => {
                if (error) {
                    return res.status(HTTPCodes.InternalServerErrorCode).json(
                        responseMessage.createInternalErrorMessage(),
                    );
                }
                return res.status(HTTPCodes.SuccessRequestCode).json(
                    responseMessage.createSuccessMessage({ result }),
                );
            });
    }

    getAddresses(req, res) {
        db.UserAddress.find({ user_id: req.body.user_id }).exec((error, result) => {
            if (error) {
                return res.status(HTTPCodes.InternalServerErrorCode).json(
                    responseMessage.createInternalErrorMessage(),
                );
            }
            return res.status(HTTPCodes.SuccessRequestCode).json(
                responseMessage.createSuccessMessage({ result }),
            );
        });
    }

    updateAddress(req, res) {
        db.User.findOneAndUpdate({ _id: req.body._id, user_id: req.body.user_id },
            req.body.address, { new: true })
            .exec((error, updatedAddress) => {
                if (error) {
                    return res.status(HTTPCodes.InternalServerErrorCode).json(
                        responseMessage.createInternalErrorMessage(),
                    );
                }
                return res.status(HTTPCodes.SuccessRequestCode).json(
                    responseMessage.createSuccessMessage({ updatedAddress }),
                );
            });
    }

    deleteAddress(req, res) {
        const addressId = req.params.id;
        db.User.findOneAndDelete({ _id: addressId, user_id: req.body.user_id })
            .exec((error, result) => {
                if (error) {
                    return res.status(HTTPCodes.InternalServerErrorCode).json(
                        responseMessage.createInternalErrorMessage(),
                    );
                }
                return res.status(HTTPCodes.SuccessRequestCode).json(
                    responseMessage.createSuccessMessage({ result }),
                );
            });
    }

    static async addAddressHelper(userId, sessionId, address) {
        const addressModel = address;
        addressModel.user_id = userId || null;
        addressModel.session_id = sessionId || null;
        db.UserAddress.create(addressModel, (error, result) => {
            if (error) {
                return Promise.reject(new Error({ error }));
            }
            return Promise.resolve({ success: true, address: result });
        });
    }
}
module.exports = Address;

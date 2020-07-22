const db = require('../models');

class Address {
    static addAddress(userId, sessionId, address) {
        const addressModel = address;
        addressModel.user_id = userId || null;
        addressModel.session_id = sessionId || null;
        db.UserAddress.create(addressModel, (error, result) => {

        });
    }

    static getAddressById(addressId, userId) {
        db.UserAddress.findOne({ _id: addressId, user_id: userId }).exec((error, result) => {

        });
    }

    static getAddresses(userId) {
        db.UserAddress.find({ user_id: userId }).exec((error, result) => {

        });
    }

    static updateAddress(userId, addressId, address) {
        db.User.findOneAndUpdate({ _id: addressId, user_id: userId }, address, { new: true })
            .exec((error, updatedAddress) => {

            });
    }

    static async deleteAddress(addressId, userId) {
        await db.User.findOneAndDelete({ _id: addressId, user_id: userId })
            .exec((error, result) => {

            });
    }
}
module.exports = Address;

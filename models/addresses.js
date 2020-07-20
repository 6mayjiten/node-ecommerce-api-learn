const mongoose = require('mongoose');

const { Schema } = mongoose;

mongoose.Promise = require('promise');

const addressSchema = new Schema({
    user_id: { type: String },
    session_id: { type: String },
    address_street_number: { type: String },
    address_street_name: { type: String, required: true },
    address_province: { type: String, required: true },
    address_city: { type: String, required: true },
    postal_code: { type: String, required: true },
    mobile_number: { type: String, required: true },
    created_date: {
        type: Date,
        default: Date.now(),
    },
    modified_at: {
        type: Date,
        default: Date.now(),
    },
});

const UserAddress = mongoose.model('user_address', addressSchema);

module.exports = UserAddress;

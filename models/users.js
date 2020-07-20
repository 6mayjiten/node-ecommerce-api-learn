const mongoose = require('mongoose');

const { Schema } = mongoose;

mongoose.Promise = require('promise');

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, default: null },
    mobile_number: { type: String, default: null },
    address_street_number: { type: String, default: null },
    address_street_name: { type: String, default: null },
    address_province: { type: String, default: null },
    address_city: { type: String, default: null },
    address_postal_code: { type: String, default: null },
    is_active: { type: Boolean, default: false },
    created_date: { type: Date, default: Date.now() },
    modified_at: { type: Date, default: Date.now() },
});

const User = mongoose.model('user', userSchema);

module.exports = User;

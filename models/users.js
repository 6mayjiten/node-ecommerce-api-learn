const mongoose = require('mongoose');

const { Schema } = mongoose;

mongoose.Promise = require('promise');

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    mobile_number: { type: String, required: true },
    address_id: { type: String, default: null },
    is_active: { type: Boolean, default: false },
    created_date: { type: Date, default: Date.now() },
    modified_at: { type: Date, default: Date.now() },
});

const User = mongoose.model('user', userSchema);

module.exports = User;

const validator = require('validator');
const { oneLine } = require('common-tags');

const mongoose = require('mongoose');

const { Schema } = mongoose;

mongoose.Promise = require('promise');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        validate: { validator: validator.isEmail, message: 'Invalid email!' },
    },
    password: {
        type: String,
        validate: {
            validator: (val) => validator.matches(val, /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/),
            message: oneLine`Invalid password!. Password at least 8 char long and must contain at least 1 digit, 
                1 lower case and 1 upper case letter with 1 special char(!@#$%^&*).`,
        },
    },
    first_name: { type: String, required: [true, 'First name is required!'] },
    last_name: { type: String, required: [true, 'Last name is required!'] },
    mobile_number: {
        type: String,
        required: [true, 'Mobile number is required!'],
        validate: { validator: (val) => validator.isLength(val, { min: 10, max: 10 }) && validator.isNumeric(val), message: 'Mobile number should be 10 digit!' },
    },
    address_id: { type: String, default: null },
    is_active: { type: Boolean, default: false },
    created_date: { type: Date, default: Date.now() },
    modified_at: { type: Date, default: Date.now() },
});

const User = mongoose.model('user', userSchema);

module.exports = User;

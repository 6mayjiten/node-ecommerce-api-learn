const mongoose = require('mongoose');

const { Schema } = mongoose;

mongoose.Promise = require('promise');

const cartSchema = new Schema({
    user_id: { type: String },
    session_id: { type: String },
    product_id: { type: String, required: true },
    quantity: { type: Number, default: 0, required: true },
    created_date: { type: Date, default: Date.now() },
    modified_at: { type: Date, default: Date.now() },
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;

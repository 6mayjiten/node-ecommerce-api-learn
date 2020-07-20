const mongoose = require('mongoose');

const { Schema } = mongoose;

mongoose.Promise = require('promise');

const orderSchema = new Schema({
    status: { type: String, default: 'Processing' },
    user_id: { type: String },
    session_id: { type: String },
    address_id: { type: String, required: true },
    transaction_id: { type: String, required: true },
    total_price: { type: Number, required: true },
    total_shipping_cost: { type: Number, required: true },
    total_tax: { type: Number, required: true },
    payment_status: { type: String, required: true },
    created_date: { type: Date, default: Date.now() },
    modified_at: { type: Date, default: Date.now() },
});

const Order = mongoose.model('order', orderSchema);

module.exports = Order;

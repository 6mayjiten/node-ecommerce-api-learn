const mongoose = require('mongoose');

const { Schema } = mongoose;
mongoose.Promise = require('promise');

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_description: { type: String, required: true },
    product_price: { type: Number, required: true },
    shipping_cost: { type: Number, required: true },
    product_category: { type: String, default: null },
    product_vendor_name: { type: String, default: null },
    created_date: { type: Date, default: Date.now() },
    modified_at: { type: Date, default: Date.now() },
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;

const mongoose = require('mongoose');

const { Schema } = mongoose;

mongoose.Promise = require('promise');

const productImageSchema = new Schema({
    product_id: { type: String, required: true },
    image_url: { type: URL, required: true },
    created_date: { type: Date, default: Date.now() },
    modified_at: { type: Date, default: Date.now() },
});

const ProductImage = mongoose.model('product_image', productImageSchema);

module.exports = ProductImage;

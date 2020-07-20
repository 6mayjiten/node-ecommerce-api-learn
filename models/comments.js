const mongoose = require('mongoose');

const { Schema } = mongoose;

mongoose.Promise = require('promise');

const commentSchema = new Schema({
    user_id: { type: String },
    session_id: { type: String },
    product_id: { type: String, required: true },
    product_comment: { type: String, required: true },
    product_rating: { type: Number, default: 3, required: true },
    created_date: { type: Date, default: Date.now() },
    modified_at: { type: Date, default: Date.now() },
});

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;

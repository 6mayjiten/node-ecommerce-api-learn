const mongoose = require('mongoose');

const { Schema } = mongoose;

mongoose.Promise = require('promise');

const commentImageSchema = new Schema({
    comment_id: { type: String, required: true },
    image_url: { type: String, required: true },
    created_date: { type: Date, default: Date.now() },
    modified_at: { type: Date, default: Date.now() },
});

const CommentImage = mongoose.model('comment_image', commentImageSchema);

module.exports = CommentImage;

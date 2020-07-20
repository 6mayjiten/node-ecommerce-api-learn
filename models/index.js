const User = require('./users');
const UserAddress = require('./addresses');
const Product = require('./products');
const ProductImage = require('./product_images');
const Cart = require('./carts');
const Order = require('./orders');
const ProductOrder = require('./product_orders');
const Comment = require('./comments');
const CommentImage = require('./comment_images');

module.exports = {
    User, UserAddress, Product, ProductImage, Cart, Order, ProductOrder, Comment, CommentImage,
};
console.log('Executing and Creating Model: index.js ...');

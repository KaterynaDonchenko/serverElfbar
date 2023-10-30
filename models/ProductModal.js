const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    dscr: {
        type: String,
        require: true
    },
    taste: {
        type: String,
        require: true
    },
    quantity: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    img: {
        type: String,
        require: true
    },
    lable: {
        type: String,
        require: false
    }   
});

const ProductModel = mongoose.model('products', ProductSchema);

module.exports = ProductModel;
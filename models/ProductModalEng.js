const mongoose = require('mongoose');

const ProductEngSchema = new mongoose.Schema({
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
    label: {
        type: String,
        require: false
    }   
});

const ProductEngModel = mongoose.model('eng-products', ProductEngSchema);

module.exports = ProductEngModel;
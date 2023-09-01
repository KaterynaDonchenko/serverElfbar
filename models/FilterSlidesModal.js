const mongoose = require('mongoose');

const FilterSlideSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    img: {
        type: String,
        require: true
    },
    color: {
        type: String,
        require: true  
    },
    info: {
        type: Object,
        require: true
    },
    dscr: {
        type: String, 
        require: false
    },
    additionalInfo: {
        type: String,
        require: false
    }


});

const FilterSlideModel = mongoose.model('filterslides', FilterSlideSchema);

module.exports = FilterSlideModel;
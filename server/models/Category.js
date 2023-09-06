const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    nameCategory: {
        type: String
    },
    description: {
        type: String
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
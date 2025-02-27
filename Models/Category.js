const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema ({
    category_name: {
        type: String,
        required: true
    },
}, { timestamps: true });

const CategoryModel = mongoose.model('categories', CategorySchema);
module.exports = CategoryModel
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema ({
    author_name: {
        type: String,
        required: true
    },
}, { timestamps: true });

const CategoryModel = mongoose.model('categories', CategorySchema);
module.exports = CategoryModel
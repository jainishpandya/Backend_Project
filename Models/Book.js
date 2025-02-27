const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema ({
    book_title: {
        type: String,
        required: true
    },
    author_id:{
        type: Schema.Types.ObjectId,
        ref: 'authors',
        required: true,
    },
    category_id:{
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: true,
    },
    club_id:{
        type: Schema.Types.ObjectId,
        ref: 'clubs',
        required: true,
    },
    book_summary:{
        type: String,
        required: true,
    },
    book_cover_url: {
        type: String,
        required: true
    },
    owner_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    genre: {
        type: [String],
        required: true
    }
}, { timestamps: true });

const BookModel = mongoose.model('books', BookSchema);
module.exports = BookModel;
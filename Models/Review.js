const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    book_id: {
        type: Schema.Types.ObjectId,
        ref: 'books',
        required: true
    },
    status: {
        type: String,
        required: true
    },
}, { timestamps: true })
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema ({
    book_id: {
        type: Schema.Types.ObjectId,
        reference: 'books',
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        reference: 'users',
        required: true
    },
    book_borrow_date: {
        type: Date,
        required: true
    },
    book_return_date: {
        type: Date,
        required: true
    },
    book_transaction_status: {
        type: String,
        required: true
    },
    book_current_location: {
        type: String,
        required: true
    },
}, { timestamps: true });

const TransactionModel = mongoose.model('transactions', TransactionSchema);
module.exports = TransactionModel
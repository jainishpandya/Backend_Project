const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LanguageSchema = new Schema ({
    language_name: {
        type: String,
        required: true
    },
}, { timestamps: true });

const LanguageModel = mongoose.model('languages', LanguageSchema);
module.exports = LanguageModel
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClubSchema = new Schema ({
    club_name: {
        type: String,
        required: true
    },
    club_contact_email: {
        type: String,
        required: true
    },
    club_thumbnail_url: {
        type: String,
        required: true
    },
    club_location: {
        type: String,
        required: true
    },
    club_central_location: {
        type: String
    }
}, { timestamps: true });

const ClubModel = mongoose.model('clubs', ClubSchema);
module.exports = ClubModel
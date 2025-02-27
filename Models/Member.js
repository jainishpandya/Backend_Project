const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberSchema = new Schema ({
    user_id: {
        type: Schema.Types.ObjectId,
        reference: 'users',
        required: true
    },
    club_id: {
        type: Schema.Types.ObjectId,
        reference: 'clubs',
        required: true
    },
    role: {
        type: Number,
        required: true
    },
    join_date: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

const MemberModel = mongoose.model('members', MemberSchema);
module.exports = MemberModel
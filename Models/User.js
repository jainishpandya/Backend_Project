const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    user_name: {
        type: String,
    },
    user_email: {
        type: String,
        unique: true
    },
    user_password: {
        type: String,
    },
    user_phone_no: {
        type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, { timestamps: true });

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
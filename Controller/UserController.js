const crypto = require('crypto');
const UserModel = require('../Models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { sendVerificationEmail, sendPasswordResetEmail } = require('../mailtrap/emails');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ user_email: email })

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.user_password);

            if (passwordMatch) {
                const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
                const response = await UserModel.findByIdAndUpdate(user._id,
                    {
                        verificationToken: verificationToken,
                        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
                    }
                )
                if (response) {

                    console.log(user);

                    const verificationEmail = await sendVerificationEmail(user.user_name.toString(), user.user_email.toString(), verificationToken);


                    if (verificationEmail.success) {
                        res.status(200).json({
                            message: "Login Successful",
                            success: true,
                            email,
                            userId: user._id,
                            name: user.name

                        })
                    } else {
                        console.error('Email Verification Error : ', error);
                        res.status(500).json({ message: 'Server error' })
                    }
                }


            } else {
                res.status(403).json({ message: "Invalid Credentials 2" })
            }
        } else {
            res.status(403).json({ message: "Invalid Credentials 1" })
        }
    } catch (error) {
        console.error('Login Error : ', error);
        res.status(500).json({ message: 'Server error' })
    }
}

const mfa = async (req, res) => {
    const { userId, code } = req.body;

    const user = await UserModel.findOne({ _id: userId });

    if (user) {
        if (user.verificationToken == code && user.verificationTokenExpiresAt > Date.now()) {
            res.status(201).json({
                message: "verification successful",
                success: true
            })
        } else {
            res.status(403).json({
                message: "Invalid Data"
            })
        }
    }

}
const signup = async (req, res) => {
    try {
        const { user_name, user_email, user_password } = req.body;
        const user = await UserModel.findOne({ user_email })

        if (user) {
            return res.status(409).json({ message: 'User already Exists', success: false });
        }
        const userModel = new UserModel({ user_name, user_email });
        userModel.user_password = await bcrypt.hash(user_password, 10);
        await userModel.save();
        res.status(201).json({
            message: "Signup Successfully",
            success: true
        })
    } catch (error) {
        console.error('signup Error: ', error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

const UpdateUser = async (req, res) => {
    try {

    } catch (error) {
        console.error("User Error: ", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}


const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ user_email: email });

        if (user) {
            const ResetPasswordToken = crypto.randomBytes(32).toString("hex");
            const ResetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

            user.resetPasswordToken = ResetPasswordToken;
            user.resetPasswordExpiresAt = ResetPasswordExpiresAt;

            await user.save();

            const respose = await sendPasswordResetEmail(user.user_email, `${process.env.CLIENT_URL}/reset-password/${ResetPasswordToken}`);

            if (respose) {
                res.status(200).json({
                    success: true,
                    message: "Password reset link set to your email"
                })
            }
        }
    } catch (error) {
        console.log("Error in Forgot Password :", error);
        res.status(400).json({ success: false, message: error })
    }
}


const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })

        const hashedPassword = await bcrypt.hash(password, 10);

        UserModel.user_password = hashedPassword;
        UserModel.resetPasswordToken = undefined;
        UserModel.resetPasswordExpiresAt = undefined;

        const response = await UserModel.save();

        if (response) {
            res.status(200).json({success: true, message: "password reset Successful"});
        } else {
            res.status(400).json({ success: false, message: "Internal Server Error"});
        }
    } catch (error) {
        console.log("Error in Forgot Password2 :", error);
        res.status(400).json({ success: false, message: "Internal Server Error" })
    }
}
module.exports = {
    signup,
    login,
    mfa,
    UpdateUser,
    forgotPassword
}
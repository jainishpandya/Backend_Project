const crypto = require('crypto');
const UserModel = require('../Models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();
const { sendVerificationEmail, sendPasswordResetEmail, sendSetPasswordEmail } = require('../mailtrap/emails');
const { log } = require('console');
const MemberModel = require('../Models/Member');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        const user = await UserModel.findOne({ user_email: email })

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.user_password);

            if (passwordMatch) {
                const verificationToken = await Math.floor(100000 + Math.random() * 900000).toString()
                const response = await UserModel.findByIdAndUpdate(user._id,
                    {
                        verificationToken: verificationToken,
                        verificationTokenExpiresAt: Date.now() + 60 * 60 * 1000
                    }
                )

                if (response) {
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
            user.verificationToken = undefined;
            user.verificationTokenExpiresAt = undefined;
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


const createUser = async (req, res) => {
    try {
        const { user_email, club_id, role } = req.body;
        const user = await UserModel.findOne({ user_email })

        if (user) {
            const member = await MemberModel.findOne({ user_id: user._id })

            if (member && member.club_id == club_id) {
                return res.status(409).json({ message: 'User already Exists in Your Club', success: false });
            } else {
                const memberModel = new MemberModel({
                    user_id: user._id,
                    club_id: club_id,
                    role_no: role
                })

                await memberModel.save();
                res.status(201).json({
                    message: "User Created Successfully",
                    success: true
                })
            }
        }
        verificationToken = crypto.randomBytes(32).toString("hex");
        const userModel = new UserModel({
            user_email,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 1 * 60 * 60 * 1000
        });
        const createdUser = await userModel.save();
        const verificationEmail = await sendSetPasswordEmail(createdUser.user_email.toString(), `${process.env.CLIENT_URL}/set-password/${verificationToken}`);
        console.log(verificationEmail);
        const memberModel = new MemberModel({
            user_id: createdUser._id,
            club_id: club_id,
            role_no: role
        })
        await memberModel.save();
        res.status(201).json({
            message: "User Created Successfully",
            success: true
        })
    } catch (error) {
        console.error('signup Error: ', error);
        res.status(500).json({ message: 'Server error' })
    }
}

const setPassword = async (req, res) => {
    try {
        const { token, password, name, phone_no } = req.body;

        const user = await UserModel.findOne({
            verificationToken: token,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            console.error('set-Password Error: ', error);
            res.status(500).json({ message: 'Internal Server error' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.user_name = name;
        user.user_password = hashedPassword;
        user.user_phone_no = phone_no;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined

        const response = await user.save();

        if (response) {
            res.status(200).json({ success: true, message: "password set Successful" });
        } else {
            res.status(400).json({ success: false, message: "Internal Server Error" });
        }

    } catch (error) {

    }
}
const UpdateUser = async (req, res) => {
    try {
        const { userId, user_name, user_email, user_phone_no } = req.body;
        const user = await UserModel.findOne({ _id: userId });

        if (!user) {
            res.status(409).json({ message: "User doesn't exists", success: false });
        }

        user.user_name = (user_name) ? user_name : user.user_name;
        user.user_email = (user_email) ? user_email : user.user_email;
        user.user_phone_no = (user_phone_no) ? user_phone_no : user.user_phone_no;

        const response = user.save();

        if (response) {
            res.status(200).json({ success: true, message: "Profile updates successful" });
        }

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
        const { token, password } = req.body;

        console.log(token);

        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(user);

        user.user_password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        const response = await user.save();

        if (response) {
            res.status(200).json({ success: true, message: "password reset Successful" });
        } else {
            res.status(400).json({ success: false, message: "Internal Server Error" });
        }
    } catch (error) {
        console.log("Error in Forgot Password2 :", error);
        res.status(400).json({ success: false, message: "Internal Server Error" })
    }
}
module.exports = {
    createUser,
    login,
    mfa,
    UpdateUser,
    forgotPassword,
    resetPassword,
    setPassword
}
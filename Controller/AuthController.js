const bcrypt = require('bcryptjs')
const UserModel = require('../Models/User');
const jwt  = require('jsonwebtoken');

const login = async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await UserModel.findOne({user_email: email})

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.user_password);

            if (passwordMatch) {
                const jwtToken = jwt.sign(
                    {email: user.email,_id: user._id},
                    process.env.JWT_SECRET,
                    {expiresIn: '24h'}
                )
                res.status(200).json({
                    message: "Login Successful",
                    success: true,
                    jwtToken,
                    email,
                    name: user.name

                })
            } else {
                res.status(403).json({message: "Invalid Credentials 2" })
            }
        } else {
            res.status(403).json({message: "Invalid Credentials 1" })
        }
    } catch (error) {
        console.error('Login Error : ', error);
        res.status(500).json({message: 'Server error'})
    }
}
const signup = async(req, res) => {
    try {
        const {user_name, user_email, user_password} = req.body;
        const user = await UserModel.findOne({user_email})

        if (user) {
            return res.status(409).json({message: 'User already Exists', success: false});
        }
        const userModel = new UserModel({user_name, user_email});
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

module.exports = {
    signup,
    login
}
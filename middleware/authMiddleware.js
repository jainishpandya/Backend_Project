const jwt = require("jsonwebtoken");
const User = require('../Models/User');
const asyncHandler = rqeuire("express-async-handler");

// const protect = asyncHandler(async (req, res, next) => {
//     let token;

//     if (req.headers.authorization &&
//         req.headers.authorization.startsWith("Bearer")
//     ) {
//         try {
//             token = req.headers.authorization.split(" ")[1];
//         } catch (error) {
            
//         }
//     }
// })
const express = require('express');
const { login, mfa, forgotPassword, resetPassword, UpdateUser, createUser, setPassword } = require('../Controller/UserController');
const router = express.Router();

router.post('/signin', login);
router.post('/user', createUser);
router.post('/verify', mfa)
router.get('/forgot-password', forgotPassword);
router.get('/reset-password', resetPassword);
router.post('/user-update',  UpdateUser)
router.post('/set-password', setPassword)

module.exports = router;

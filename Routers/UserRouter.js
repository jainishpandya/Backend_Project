const express = require('express');
const { signup, login, mfa, forgotPassword } = require('../Controller/UserController');
const router = express.Router();

router.get('/user', login);
router.post('/user', signup);
router.get('/verify', mfa)
router.get('/forgot-password', forgotPassword)
// router.put('/user',  updateUser)

module.exports = router;

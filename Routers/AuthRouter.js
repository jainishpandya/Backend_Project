const express = require('express');
const { signup, login } = require('../Controller/AuthController');
const IsAuthenticatedMiddleware = require('../Middlewares/IsAuthenticatedMiddleware');
const router = express.Router();

router.get('/login', login);
router.post('/signup', signup);

module.exports = router;

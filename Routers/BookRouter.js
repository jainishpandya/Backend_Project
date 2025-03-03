const express = require('express');
const { addBook, listBook } = require('../Controller/BookController');
const router = express.Router();


router.post('/book', addBook);
router.get('/book', listBook);

module.exports = router;

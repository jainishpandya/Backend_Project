const express = require('express');
const { addBook, listBook } = require('../Controller/BookController');
const router = express.Router();


router.post('/add_book', addBook);
router.get('/listbooks', listBook);

module.exports = router;

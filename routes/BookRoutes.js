const book_controller = require('../controllers/BookController');
const express = require('express');
const router = express.Router();

router.post('/books', book_controller.create)
router.get('/books', book_controller.get)
router.put('/books', book_controller.edit)
router.delete('/books', book_controller.delete)


module.exports = router;
const author_controller = require('../controllers/AuthorController');
const express = require('express');
const router = express.Router();

router.post('/authors', author_controller.create)
router.get('/authors', author_controller.get)
router.put('/authors', author_controller.edit)
router.delete('/authors', author_controller.delete)


module.exports = router;
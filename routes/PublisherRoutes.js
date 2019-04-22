const publisher_controller = require('../controllers/PublisherController');
const express = require('express');
const router = express.Router();


//CRUD ROUTES
router.post('/publishers', publisher_controller.create)
router.get('/publishers', publisher_controller.get)
router.put('/publishers', publisher_controller.edit)
router.delete('/publishers', publisher_controller.delete)


module.exports = router;
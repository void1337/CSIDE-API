const user_controller = require('../controllers/UserController');
const express = require('express');
const router = express.Router();

router.post('/users', user_controller.createUser)
router.put('/users', user_controller.editPassword)
router.delete('/users',user_controller.deleteUser)
router.get('/users', user_controller.get)


module.exports = router;
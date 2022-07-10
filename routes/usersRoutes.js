const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

router
    .route('/')
    .get(protect, userController.getUsers)
    .post(userController.createUser);

router.route('/login').post(userController.loginUser);

module.exports = router;

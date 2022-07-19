const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { protect, protect_admin } = require('../middleware/authMiddleware');

// register user
router.route('/').post(userController.createUser);
// login user
router.route('/login').post(userController.loginUser);
// get logged-in user details
router.route('/me').get(protect, userController.getMe);
// get all user
router.route('/').get(protect, userController.getUsers);
// update user
router.route('/update').put(protect, userController.updateUser);
// delete user
router.route('/delete').delete(protect_admin, userController.deleteUser);
module.exports = router;

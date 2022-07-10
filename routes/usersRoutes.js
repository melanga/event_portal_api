const express = require('express');
const { getUsers, createUser, loginUser } = require('../controllers/usersController');

const router = express.Router();

router.route('/').get(getUsers).post(createUser);

router.route('/login').post(loginUser);

module.exports = router;
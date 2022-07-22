const express = require('express');
const { getCustomerEvents } = require('../controllers/customerController');
const { protect_customer } = require('../middleware/authMiddleware');

const router = express.Router();
// get all customers events
router.route('/:id/events').get(protect_customer, getCustomerEvents);

module.exports = router;

const express = require('express');
const { getCustomerEvents } = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
// get all customers events
router.route('/:id/events').get(protect, getCustomerEvents);

module.exports = router;

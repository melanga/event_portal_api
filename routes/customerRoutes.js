const express = require('express');
const {
    getCustomerEvents,
    getMapDetails,
} = require('../controllers/customerController');
const { protect_customer } = require('../middleware/authMiddleware');

const router = express.Router();
// get all customers events
router.route('/:id/events').get(protect_customer, getCustomerEvents);

// maps test route
router.route('/maps').get(getMapDetails);

module.exports = router;

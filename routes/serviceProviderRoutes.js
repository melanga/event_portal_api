const express = require('express');
const protect = require('../middleware/authMiddleware');
const {
    getServiceProviderEvents,
} = require('../controllers/serviceProviderController');

const router = express.Router();

router.route('/:id/events').get(protect, getServiceProviderEvents);

module.exports = router;

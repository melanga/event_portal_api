const express = require('express');
const { protect_service_provider } = require('../middleware/authMiddleware');
const {
    getServiceProviderEvents,
} = require('../controllers/serviceProviderController');

const router = express.Router();

router
    .route('/:id/events')
    .get(protect_service_provider, getServiceProviderEvents);

module.exports = router;

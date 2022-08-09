const express = require('express');
const {
    protect_service_provider,
    protect_customer,
} = require('../middleware/authMiddleware');
const {
    getServiceProviderEvents,
    add_rating,
} = require('../controllers/serviceProviderController');

const router = express.Router();

router
    .route('/:id/events')
    .get(protect_service_provider, getServiceProviderEvents);

// add rating to service provider
router.route('/:id/rating').post(protect_customer, add_rating);

module.exports = router;

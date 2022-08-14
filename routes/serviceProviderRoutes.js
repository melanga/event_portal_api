const express = require('express');
const {
    protect_service_provider,
    protect_customer,
} = require('../middleware/authMiddleware');
const spController = require('../controllers/serviceProviderController');

const router = express.Router();

router
    .route('/:id/events')
    .get(protect_service_provider, spController.getServiceProviderEvents);

// add rating to service provider
router.route('/:id/rating').post(protect_customer, spController.add_rating);

// get service providers by search and filters
router
    .route('/search')
    .get(protect_service_provider, spController.getServiceProvidersBySearch);

module.exports = router;

const express = require('express');
const {
    protect_service_provider,
    protect_customer,
} = require('../middleware/authMiddleware');
const spController = require('../controllers/serviceProviderController');

const router = express.Router();
// get service providers by search and filters
router.route('/search').get(spController.getServiceProvidersBySearch);

router.route('/filter').get(spController.getServiceProvidersByFilter);

router.route('/recent').get(spController.getRecentServiceProviders);

// get service provider details
router.route('/:id').get(spController.getServiceProvider);

router
    .route('/:id/events')
    .get(protect_service_provider, spController.getServiceProviderEvents);

// add rating to service provider
router.route('/:id/rating').post(protect_customer, spController.add_rating);

router.route('/:id/bids').post(spController.getServiceProviderBids);

module.exports = router;

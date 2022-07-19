const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const EventRouter = require('../controllers/eventController');

const router = express.Router();

// create an event
router.route('/').post(protect, EventRouter.createEvent);
// get all events
router.route('/').get(protect, EventRouter.getEvents);
// get an event
router.route('/:id').get(protect, EventRouter.getAEvent);
// update an event
router.route('/:id').put(protect, EventRouter.updateEvent);
// delete an event
router.route('/:id').delete(protect, EventRouter.deleteEvent);
// GET event's all service_providers
router
    .route('/:id/service_providers')
    .get(protect, EventRouter.getEventServiceProviders);
router
    .route('/:event_id/service_providers/:service_provider_id')
    .put(protect, EventRouter.putEventServiceProvider);
// delete service_provider from an event
router
    .route('/:event_id/service_providers/:service_provider_id')
    .delete(protect, EventRouter.deleteEventServiceProvider);

module.exports = router;

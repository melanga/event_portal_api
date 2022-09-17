const express = require('express');
const {
    protect,
    protect_service_provider,
} = require('../middleware/authMiddleware');
const EventController = require('../controllers/eventController');

const router = express.Router();

// create | get -> event
router
    .route('/')
    .post(protect, EventController.createEvent)
    .get(protect, EventController.getEvents);

// get | update | delete -> event
router
    .route('/:id')
    .get(protect, EventController.getAEvent)
    .put(protect, EventController.updateEvent)
    .delete(protect, EventController.deleteEvent);

// GET event's all service_providers
router
    .route('/:id/service_providers')
    .get(protect, EventController.getEventServiceProviders);

// add | delete service_provider -> event
router
    .route('/:event_id/service_providers/:service_provider_id')
    .put(protect, EventController.putEventServiceProvider)
    .delete(protect, EventController.deleteEventServiceProvider);

// update service_provider_event c_confirmed
router
    .route('/:event_id/service_providers/:service_provider_id/c_confirmed')
    .put(protect, EventController.updateEventServiceProviderCConfirmed);
// update service_provider_event sp_confirmed
router
    .route('/:event_id/service_providers/:service_provider_id/sp_confirmed')
    .put(
        protect_service_provider,
        EventController.updateEventServiceProviderSPConfirmed
    );
router
    .route('/:event_id/service_providers/:service_provider_id/budget')
    .put(protect_service_provider, EventController.setEventBudget);

module.exports = router;

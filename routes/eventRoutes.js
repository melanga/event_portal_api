const express = require('express');
const protect = require('../middleware/authMiddleware');
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
module.exports = router;

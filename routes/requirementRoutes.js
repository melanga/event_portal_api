const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const RequirementController = require('../controllers/requirementController');

const router = express.Router();

// get requirement
router.route('/:event_id').get(protect, RequirementController.getRequirements);
// create requirement
router.route('/').post(protect, RequirementController.createRequirement);
// update requirement
router.route('/:id').put(protect, RequirementController.updateRequirement);
// delete requirement
router.route('/:id').delete(protect, RequirementController.deleteRequirement);
// get requirement bidding
router
    .route('/:id/bids')
    .get(protect, RequirementController.getEventRequirementBidding);
// create requirement bid
router
    .route('/:req_id/bids/:sp_id')
    .post(protect, RequirementController.createEventRequirementBidding);
router
    .route('/:req_id/bids/:sp_id')
    .get(protect, RequirementController.getEventRequirementBidPrice);
// delete requirement bid
router
    .route('/:req_id/bids/:sp_id')
    .delete(protect, RequirementController.deleteEventRequirementBidding);
module.exports = router;

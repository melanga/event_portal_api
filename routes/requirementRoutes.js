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

module.exports = router;

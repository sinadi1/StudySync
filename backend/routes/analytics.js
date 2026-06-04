const express = require('express');
const router = express.Router();
const { getAnalytics,getSubjectMilestone } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAnalytics);
router.route('/milestone/:id').get(protect, getSubjectMilestone);

module.exports = router;
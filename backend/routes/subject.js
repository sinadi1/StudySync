const express = require('express');
const router = express.Router();
const { createSubject, getSubjects } = require('../controllers/subjectController');
const { logHours, toggleSubjectStatus } = require('../controllers/hoursController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createSubject)
  .get(protect, getSubjects);
router.route('/:id/hours').put(protect, logHours);
router.route('/:id/toggle').put(protect, toggleSubjectStatus);

module.exports = router;
const express = require('express');
const router = express.Router();
const { createSubject, getSubjects } = require('../controllers/subjectController');
const { logHours } = require('../controllers/hoursController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createSubject)
  .get(protect, getSubjects);
  // 👇 ADD THIS LINE TO HANDLE TIME LOGS FOR A SPECIFIC SUBJECT ID
router.route('/:id/hours').put(protect, logHours);

module.exports = router;
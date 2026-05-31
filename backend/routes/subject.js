const express = require('express');
const router = express.Router();
const { createSubject, getSubjects } = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createSubject)
  .get(protect, getSubjects);

module.exports = router;
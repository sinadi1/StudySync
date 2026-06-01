const express = require('express');
const router = express.Router();
const { createTask, getTasks, toggleTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createTask)
  .get(protect, getTasks);

router.route('/:id')
  .put(protect, toggleTask);

module.exports = router;
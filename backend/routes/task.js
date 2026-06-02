const express = require('express');
const router = express.Router();
const { createTask, getTasks, toggleTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createTask)
  .get(protect, getTasks);

router.route('/:id')
  .put(protect, toggleTask)
  .delete(protect, deleteTask);

module.exports = router;
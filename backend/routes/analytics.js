const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => { 
  try {
    const { range } = req.query;
    const userId = req.user.id;

    let dateFilter = {};
    if (range && range !== 'all') {
      const days = parseInt(range, 10);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter = { updatedAt: { $gte: startDate } };
    }

    const subjects = await Subject.find({ user: userId, ...dateFilter });
    const tasks = await Task.find({ user: userId, ...dateFilter });

    const totalSubjects = subjects.length;
    const totalHours = subjects.reduce((acc, curr) => acc + (curr.hoursStudied || 0), 0);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalSubjects,
        totalHours: parseFloat(totalHours.toFixed(1)),
        totalTasks,
        completedTasks,
        taskCompletionRate,
        subjects,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
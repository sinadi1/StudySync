const Subject = require('../models/Subject');
const Task = require('../models/Task');

exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [subjects, tasks] = await Promise.all([
      Subject.find({ user: userId }),
      Task.find({ user: userId })
    ]);

    const totalSubjects = subjects.length;
    const totalHours = subjects.reduce((sum, subj) => sum + (subj.hoursStudied || 0), 0);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalSubjects,
        totalHours,
        totalTasks,
        completedTasks,
        taskCompletionRate
      }
    });
  } catch (error) {
    next(error);
  }
};
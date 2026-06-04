const Subject = require('../models/Subject');
const Task = require('../models/Task');
const User = require('../models/User'); 

exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [subjects, tasks] = await Promise.all([
      Subject.find({ user: userId }),
      Task.find({ user: userId })
    ]);

    const totalSubjects = subjects.length;
    const completedSubjects = subjects.filter(s => s.status === 'Completed').length; 
    const totalHours = subjects.reduce((sum, subj) => sum + (subj.hoursStudied || 0), 0);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: { 
        totalSubjects,
        completedSubjects, 
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

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, school } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (name) user.name = name;
    if (school) user.school = school;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        school: updatedUser.school
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubjectMilestone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const subject = await Subject.findOne({ _id: id, user: userId });
    if (!subject) {
      res.status(404);
      throw new Error('Subject track not found');
    }

    const tasks = await Task.find({ user: userId });
    const pendingTasksCount = tasks.filter(t => !t.completed).length;

    let insight = "Great initial push! Consistency is key to long-term retention.";
    if (subject.hoursStudied > 20) {
      insight = "Deep mastery achieved. Your intensive focus mirrors a highly disciplined engineering sprint.";
    } else if (subject.hoursStudied > 10) {
      insight = "Solid developmental block completed. You're building strong momentum.";
    }

    res.status(200).json({
      success: true,
      report: {
        name: subject.name,
        hoursStudied: subject.hoursStudied,
        status: subject.status,
        remainingQueueTasks: pendingTasksCount,
        recommendation: insight
      }
    });
  } catch (error) {
    next(error);
  }
};
const Subject = require('../models/Subject');
const Task = require('../models/Task');
const User = require('../models/User'); 
const mongoose = require('mongoose');

exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const [subjectStats, taskStats] = await Promise.all([
      Subject.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalHours: { $sum: "$hoursStudied" },
            totalSubjects: { $sum: 1 }
          }
        }
      ]),
      
      Task.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: { 
                $cond: [
                  { 
                    $or: [
                      { $eq: ["$completed", true] },
                      { $eq: ["$status", "Completed"] }
                    ]
                  }, 
                  1, 
                  0
                ] 
              }
            }
          }
        }
      ])
    ]);

    const sData = subjectStats[0] || { totalHours: 0, totalSubjects: 0 };
    const tData = taskStats[0] || { totalTasks: 0, completedTasks: 0 };
  
    const completionRate = tData.totalTasks > 0 
      ? Math.round((tData.completedTasks / tData.totalTasks) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalSubjects: sData.totalSubjects,
        totalHours: sData.totalHours,
        totalTasks: tData.totalTasks,
        completedTasks: tData.completedTasks,
        taskCompletionRate: completionRate
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, school } = req.body; 
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (name) user.name = name;
    if (email) user.email = email;
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
    const pendingTasksCount = tasks.filter(t => !t.completed && t.status !== 'Completed').length;

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

exports.updateUserStreak = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return 0;

    const todayStr = new Date().toISOString().split('T')[0];
    
    if (user.lastActiveDate === todayStr) {
      return user.streakCount;
    }

    if (!user.lastActiveDate) {
      user.streakCount = 1;
    } else {
      const lastActive = new Date(user.lastActiveDate);
      const today = new Date(todayStr);

      const diffTime = Math.abs(today - lastActive);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streakCount += 1;
      } else {
        user.streakCount = 1;
      }
    }

    user.lastActiveDate = todayStr;
    await user.save();
    return user.streakCount;
  } catch (error) {
    console.error("Streak calculation fault:", error);
    return 0;
  }
};

exports.getPerformanceReport = exports.getAnalytics;
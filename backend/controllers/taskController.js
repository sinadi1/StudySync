const Task = require('../models/Task');
const Subject = require('../models/Subject');
const { updateUserStreak } = require('./analyticsController');

exports.createTask = async (req, res, next) => {
  try {
    const { text, priority } = req.body;

    if (!text) {
      res.status(400);
      throw new Error('Please add task text');
    }

    const task = await Task.create({
      text,
      priority: priority || 'Medium',
      user: req.user.id,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    next(error);
  }
};

exports.toggleTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (task.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized');
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (task.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await task.deleteOne();

    res.status(200).json({ success: true, message: 'Task removed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.toggleTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, user: req.user.id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
    await task.save();

    let autoLogged = false;
    let streakCount = undefined;

    if (task.status === 'Completed') {
      let subject = await Subject.findOne({ 
        user: req.user.id, 
        name: { $regex: task.title.split(' ')[0], $options: 'i' } 
      });

      if (!subject) {
        subject = await Subject.findOne({ user: req.user.id });
      }

      if (subject && subject.status !== 'Completed') {
        subject.hoursStudied += 0.5;
        await subject.save();
        autoLogged = true;

        streakCount = await updateUserStreak(req.user.id);
      }
    }

    res.status(200).json({
      success: true,
      task,
      autoLogged,
      streakCount
    });
  } catch (error) {
    next(error);
  }
};
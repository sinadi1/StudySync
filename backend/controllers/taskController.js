const Task = require('../models/Task');

exports.createTask = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      res.status(400);
      throw new Error('Please add task text');
    }

    const task = await Task.create({
      text,
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
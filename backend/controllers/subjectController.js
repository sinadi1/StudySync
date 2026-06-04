const Subject = require('../models/Subject');
const { updateUserStreak } = require('./analyticsController');

exports.createSubject = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Please add a subject name');
    }

    const subject = await Subject.create({
      name,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      subject,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateHours = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { hours } = req.body;

    const subject = await Subject.findOne({ _id: id, user: req.user.id });

    if (!subject) {
      res.status(404);
      throw new Error('Subject track not found');
    }

    subject.hoursStudied += Number(hours);
    await subject.save();

    const updatedStreak = await updateUserStreak(req.user.id);

    res.status(200).json({
      success: true,
      message: "Hours logged successfully",
      hoursStudied: subject.hoursStudied,
      streakCount: updatedStreak
    });
  } catch (error) {
    next(error);
  }
};
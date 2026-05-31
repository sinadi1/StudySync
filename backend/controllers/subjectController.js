const Subject = require('../models/Subject');

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
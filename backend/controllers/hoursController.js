const Subject = require('../models/Subject');

exports.logHours = async (req, res, next) => {
  try {
    const { hours } = req.body;
    const subjectId = req.params.id;

    if (!hours || isNaN(hours) || hours <= 0) {
      res.status(400);
      throw new Error('Please add a valid number of hours');
    }

    const subject = await Subject.findById(subjectId);

    if (!subject) {
      res.status(404);
      throw new Error('Subject not found');
    }

    if (subject.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized');
    }

    subject.hoursStudied += Number(hours);
    if (subject.status === 'Not Started') {
      subject.status = 'In Progress';
    }

    await subject.save();

    res.status(200).json({
      success: true,
      subject
    });
  } catch (error) {
    next(error);
  }
};
exports.toggleSubjectStatus = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      res.status(404);
      throw new Error('Subject not found');
    }

    if (subject.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized');
    }

    if (subject.status === 'Completed') {
      subject.status = 'In Progress';
    } else {
      subject.status = 'Completed';
    }

    await subject.save();

    res.status(200).json({
      success: true,
      subject
    });
  } catch (error) {
    next(error);
  }
};
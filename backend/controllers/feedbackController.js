// controllers/feedbackController.js
const Feedback = require('../models/Feedback');

// GET /api/feedback - Get all feedbacks (with pagination)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v'); // Hide Mongoose version

    const total = await Feedback.countDocuments();

    res.json({
      success: true,
      data: feedbacks,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedbacks',
      error: error.message,
    });
  }
};

// POST /api/feedback - Add new feedback
exports.createFeedback = async (req, res) => {
  try {
    const { name, email, rating, text } = req.body;

    // Basic server-side validation (Mongoose will also validate)
    if (!name || !email || !rating || !text) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const feedback = new Feedback({ name, email, rating, text });
    await feedback.save();

    res.status(201).json({
      success: true,
      data: feedback,
      message: 'Feedback added successfully!',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to add feedback',
      error: error.message,
    });
  }
};

// DELETE /api/feedback/:id - Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.json({
      success: true,
      message: 'Feedback deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error.message,
    });
  }
};
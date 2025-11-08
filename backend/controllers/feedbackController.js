const Feedback = require("../models/Feedback");
const Booking = require("../models/Booking");

// GET /api/feedback - Get all feedbacks (with pagination) - unchanged
exports.getAllFeedbacks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

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
      message: "Failed to fetch feedbacks",
      error: error.message,
    });
  }
};

// POST /api/feedback - Add new feedback (updated for booking ref & duplicate check)
exports.createFeedback = async (req, res) => {
  try {
    const { bookingId, rating, text } = req.body;
    // Extract user ID from x-user-id header
    const userHeader = req.headers["x-user-id"];
    let userId;

    if (userHeader) {
      try {
        const userObj = JSON.parse(userHeader);
        userId = userObj.id;
      } catch (err) {
        return res.status(400).json({ message: "Invalid x-user-id header" });
      }
    }

    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!bookingId || !rating || !text) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if feedback already exists for this booking
    const existingFeedback = await Feedback.findOne({ booking: bookingId });
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "Feedback for this booking already exists",
      });
    }

    const feedback = new Feedback({
      user: userId,
      booking: bookingId,
      rating,
      text,
    });

    await feedback.save();

    // Update booking's feedbackGiven field
    await Booking.findByIdAndUpdate(bookingId, { feedbackGiven: true });

    res.status(201).json({
      success: true,
      data: feedback,
      message: "Feedback added successfully!",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to add feedback",
      error: error.message,
    });
  }
};

// DELETE /api/feedback/:id - Delete feedback - unchanged
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // Reset feedbackGiven on booking
    if (feedback.booking) {
      await Booking.findByIdAndUpdate(feedback.booking, {
        feedbackGiven: false,
      });
    }

    res.json({
      success: true,
      message: "Feedback deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
      error: error.message,
    });
  }
};

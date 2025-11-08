const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // ensures one feedback per booking
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    text: {
      type: String,
      required: [true, "Feedback text is required"],
      trim: true,
      minlength: [10, "Feedback must be at least 10 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-populate user info on find queries
feedbackSchema.pre(/^find/, function (next) {
  this.populate("user", "username email");
  next();
});

module.exports = mongoose.model("Feedback", feedbackSchema);

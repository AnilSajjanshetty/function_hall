// routes/feedbackeroute.js
const express = require("express");
const router = express.Router();
const feedBackController = require("../controllers/feedbackController");
const { authenticate, authorizeAdmin } = require("../middleware/auth"); // ✅ Correct import

// Public routes
router.post("/", feedBackController.createFeedback);

// Protected routes (admin only)
router.get("/", authenticate, feedBackController.getAllFeedbacks);
router.delete("/:id", authenticate, feedBackController.deleteFeedback);

module.exports = router;

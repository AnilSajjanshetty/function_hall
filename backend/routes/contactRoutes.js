const express = require("express");
const router = express.Router();
const {
  createMessage,
  getAllMessages,
  markAsRead,
} = require("../controllers/messageController");

// POST - Add new message
router.post("/", createMessage);

// GET - Get all messages
router.get("/", getAllMessages);

router.get("/:id", markAsRead);

module.exports = router;

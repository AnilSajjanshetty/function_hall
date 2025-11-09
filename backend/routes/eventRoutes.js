// routes/event.js
const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventMedia,
  setEventThumbnail,
} = require("../controllers/eventController");
const { authenticate } = require("../middleware/auth");
const upload = require("../utils/upload");

// GET /api/events
router.get("/", getAllEvents);

// GET /api/events/:id
router.get("/:id", getEvent);

// POST /api/events (CORRECTED: Handles text fields + files in multipart/form-data)
router.post(
  "/",
  authenticate,
  upload.fields([
    { name: "files", maxCount: 10 }, // Files
    { name: "title" }, // Text fields
    { name: "type" },
    { name: "date" },
    { name: "guests" },
    { name: "description" },
  ]),
  createEvent
);

// PATCH /api/events/:id
router.patch("/:id", authenticate, updateEvent);

// DELETE /api/events/:id
router.delete("/:id", authenticate, deleteEvent);

// POST /api/events/:id/media (unchanged)
router.post(
  "/:id/media",
  authenticate,
  upload.array("files", 10),
  (req, res, next) => {
    req.body.eventId = req.params.id;
    next();
  },
  uploadEventMedia
);

// PATCH /api/events/thumbnail
router.patch("/thumbnail", authenticate, setEventThumbnail);

module.exports = router;

// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, authorizeAdmin } = require('../middleware/auth'); // ✅ Correct import

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Protected routes (admin only)
router.post('/', authenticate, authorizeAdmin, eventController.createEvent);
router.put('/:id', authenticate, authorizeAdmin, eventController.updateEvent);
router.delete('/:id', authenticate, authorizeAdmin, eventController.deleteEvent);

module.exports = router;

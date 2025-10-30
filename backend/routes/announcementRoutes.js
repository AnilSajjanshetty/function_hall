// routes/announcementRoutes.js
const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', announcementController.getAllAnnouncements);

// Protected routes (admin only)
router.post('/', authenticateToken, announcementController.createAnnouncement);
router.delete('/:id', authenticateToken, announcementController.deleteAnnouncement);

module.exports = router;
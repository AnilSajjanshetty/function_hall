const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { authenticate,authorizeAdmin } = require('../middleware/auth');

// Public routes
router.get('/', announcementController.getAllAnnouncements);
// router.get('/:id', announcementController.getAnnouncementById);
router.get("/latest", announcementController.getLatestAnnouncements);

// Protected routes (admin only)
router.post('/', authenticate,authorizeAdmin, announcementController.createAnnouncement);
// router.put('/:id', authenticateToken, announcementController.updateAnnouncement);
router.delete('/:id', authenticate, authorizeAdmin,announcementController.deleteAnnouncement);

module.exports = router;

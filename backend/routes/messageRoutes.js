// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/auth');

// All routes are protected (admin only)
router.get('/', authenticateToken, messageController.getAllMessages);
router.put('/:id/read', authenticateToken, messageController.markAsRead);

module.exports = router;
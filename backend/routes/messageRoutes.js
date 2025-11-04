// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate,authorizeAdmin } = require('../middleware/auth');

// All routes are protected (admin only)
router.get('/', authenticate,authorizeAdmin, messageController.getAllMessages);
router.put('/:id/read', authenticate, authorizeAdmin,messageController.markAsRead);

module.exports = router;
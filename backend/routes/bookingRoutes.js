// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorizeAdmin } = require('../middleware/auth'); // ✅ Correct import

// Public routes
router.post('/', bookingController.createBooking);

// Protected routes (admin only)
router.get('/', authenticate,  bookingController.getAllBookings);
router.get('/:id', authenticate, bookingController.getBookingById);
router.put('/:id', authenticate, bookingController.updateBookingStatus);
router.delete('/:id', authenticate, bookingController.deleteBooking);

module.exports = router;

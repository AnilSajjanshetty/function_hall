// controllers/bookingController.js
const Booking = require('../models/Booking');
const { 
  sendBookingConfirmation, 
  sendAdminNotification, 
  sendRejectionEmail 
} = require('../utils/emailService');

// ✅ Get all bookings (Admin only)
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ submittedAt: -1 }).lean();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// ✅ Get booking by ID
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).lean();
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// ✅ Create a new booking (Public)
exports.createBooking = async (req, res, next) => {
  try {
    const { name, email, phone, eventType, date, guests, message } = req.body;

    // Validation
    if (!name || !email || !phone || !eventType || !date || !guests) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const newBooking = new Booking({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      eventType: eventType.trim(),
      date,
      guests: parseInt(guests),
      message: message?.trim() || ''
    });

    await newBooking.save();

    // Send notification emails (optional)
    try {
      await sendBookingConfirmation(newBooking);
      await sendAdminNotification(newBooking);
    } catch (mailError) {
      console.warn('Email sending failed:', mailError.message);
    }

    res.status(201).json({
      success: true,
      booking: newBooking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// ✅ Update booking status (Admin only)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    // Send email notification based on status
    try {
      if (status === 'approved') {
        await sendBookingConfirmation(booking, true);
      } else if (status === 'rejected') {
        await sendRejectionEmail(booking);
      }
    } catch (mailError) {
      console.warn('Status email sending failed:', mailError.message);
    }

    res.json({
      success: true,
      booking,
      message: `Booking ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

// ✅ Delete booking (Admin only)
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

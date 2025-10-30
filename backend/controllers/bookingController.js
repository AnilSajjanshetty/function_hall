// controllers/bookingController.js
const Booking = require('../models/Booking');
const { sendBookingConfirmation, sendAdminNotification } = require('../utils/emailService');

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .sort({ submittedAt: -1 })
      .lean();
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).lean();
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    next(error);
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const { name, email, phone, eventType, date, guests, message } = req.body;

    // Validation
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !eventType?.trim() || !date || !guests) {
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

    // Send emails
    await sendBookingConfirmation(newBooking);
    await sendAdminNotification(newBooking);

    res.status(201).json({
      success: true,
      booking: newBooking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    next(error);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    // Send status update emails
    if (status === 'approved') {
      await sendBookingConfirmation(booking, true);
    } else if (status === 'rejected') {
      await sendRejectionEmail(booking);
    }

    res.json({
      success: true,
      booking,
      message: `Booking ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    next(error);
  }
};

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
    next(error);
  }
};
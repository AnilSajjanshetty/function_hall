const Booking = require("../models/Booking");
const mongoose = require("mongoose");
const {
  sendBookingConfirmation,
  sendAdminNotification,
  sendRejectionEmail,
} = require("../utils/emailService");

// ✅ Get all bookings (Admin only) - unchanged
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ submittedAt: -1 }).lean();
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// ✅ Get booking by ID - unchanged
exports.getBookingsByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Find all bookings for this user
    const bookings = await Booking.find({
      user: new mongoose.Types.ObjectId(userId),
    })
      .sort({ submittedAt: -1 })
      .lean();

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ error: "No bookings found for this user" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings for user:", error);
    res.status(500).json({ error: "Failed to fetch bookings for user" });
  }
};

// ✅ Create a new booking (Public) - updated to use user ref
exports.createBooking = async (req, res, next) => {
  try {
    const { eventType, date, guests, message } = req.body;
    const userId = req.params.userId; // assuming authentication middleware

    if (!eventType || !date || !guests) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const newBooking = new Booking({
      user: userId,
      eventType: eventType.trim(),
      date,
      guests: parseInt(guests),
      message: message?.trim() || "",
    });

    await newBooking.save();

    // Send notification emails (optional)
    try {
      await sendBookingConfirmation(newBooking);
      await sendAdminNotification(newBooking);
    } catch (mailError) {
      console.warn("Email sending failed:", mailError.message);
    }

    res.status(201).json({
      success: true,
      booking: newBooking,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

// ✅ Update booking status (Admin only) - unchanged
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    // Send email notification based on status
    try {
      if (status === "approved") {
        await sendBookingConfirmation(booking, true);
      } else if (status === "rejected") {
        await sendRejectionEmail(booking);
      }
    } catch (mailError) {
      console.warn("Status email sending failed:", mailError.message);
    }

    res.json({
      success: true,
      booking,
      message: `Booking ${status} successfully`,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
};

// ✅ Delete booking (Admin only) - unchanged
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
};

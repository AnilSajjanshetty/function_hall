// controllers/announcementController.js
const Announcement = require('../models/Announcement');
const Booking = require('../models/Booking');
const { sendEmail } = require('../utils/emailService'); // or your email util

/**
 * GET /api/announcements
 * Get all announcements
 */
exports.getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find()
      .sort({ date: -1 }) // Latest first
      .lean();

    res.status(200).json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    next(error);
  }
};

/**
 * POST /api/announcements
 * Create new announcement + send to all customers
 */
exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, message } = req.body;

    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({
        error: 'Title and message are required'
      });
    }

    // Create announcement
    const newAnnouncement = await Announcement.create({
      title: title.trim(),
      message: message.trim()
    });

    // Get all unique customer emails
    const bookings = await Booking.find().select('email').lean();
    const customerEmails = [...new Set(bookings.map(b => b.email).filter(Boolean))];

    // Send email to each customer
    const emailPromises = customerEmails.map(email =>
      sendEmail({
        to: email,
        subject: title,
        text: message,
        html: `<p><strong>${title}</strong></p><p>${message}</p>`
      }).catch(err => {
        console.warn(`Failed to send email to ${email}:`, err.message);
      })
    );

    await Promise.allSettled(emailPromises);

    res.status(201).json({
      success: true,
      announcement: newAnnouncement,
      emailsSent: customerEmails.length,
      message: 'Announcement created and sent to customers'
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    next(error);
  }
};

/**
 * DELETE /api/announcements/:id
 * Delete announcement by ID
 */
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    await Announcement.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    next(error);
  }
};
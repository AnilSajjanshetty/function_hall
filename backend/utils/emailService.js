// utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const sendBookingConfirmation = async (booking, isApproval = false) => {
  const subject = isApproval ? 'Booking Approved!' : 'Booking Received';
  const text = isApproval 
    ? `Your booking for ${booking.eventType} on ${booking.date} has been APPROVED!`
    : `Your booking for ${booking.eventType} on ${booking.date} has been received.`;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: booking.email,
    subject,
    text,
    html: `<h2>${subject}</h2><p>${text}</p>`
  });
};

const sendAdminNotification = async (booking) => {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: 'admin@virajgarden.com',
    subject: 'New Booking Request',
    text: `New booking from ${booking.name}: ${booking.eventType} on ${booking.date}`
  });
};

const sendRejectionEmail = async (booking) => {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: booking.email,
    subject: 'Booking Update',
    text: `We regret to inform you that your booking for ${booking.date} cannot be accommodated.`
  });
};

const sendContactMessage = async ({ name, email, message }) => {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: 'admin@virajgarden.com',
    subject: `Contact Form: ${name}`,
    text: `From: ${name} (${email})\n\nMessage:\n${message}`
  });
};

module.exports = {
  sendBookingConfirmation,
  sendAdminNotification,
  sendRejectionEmail,
  sendContactMessage
};
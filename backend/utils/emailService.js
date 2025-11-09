const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = null;

// Create transporter only if env variables exist
if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
  console.log("📧 Email service configured successfully");
} else {
  console.warn("⚠️ Email service not configured — emails will be skipped.");
}

/**
 * Safe sendMail helper — skips silently if transporter is missing
 */
const safeSendMail = async (options) => {
  if (!transporter) {
    console.warn("📭 Email skipped — transporter not available.");
    return;
  }

  try {
    await transporter.sendMail(options);
    console.log(`✅ Email sent: ${options.subject}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
};

// ========================
// 📩 Email Functions
// ========================

const sendBookingConfirmation = async (booking, isApproval = false) => {
  const subject = isApproval ? "Booking Approved!" : "Booking Received";
  const text = isApproval
    ? `Your booking for ${booking.eventType} on ${booking.date} has been APPROVED!`
    : `Your booking for ${booking.eventType} on ${booking.date} has been received.`;

  await safeSendMail({
    from: process.env.GMAIL_USER,
    to: booking.email,
    subject,
    text,
    html: `<h2>${subject}</h2><p>${text}</p>`,
  });
};

const sendAdminNotification = async (booking) => {
  await safeSendMail({
    from: process.env.GMAIL_USER,
    to: "admin@virajgarden.com",
    subject: "New Booking Request",
    text: `New booking from ${booking.name}: ${booking.eventType} on ${booking.date}`,
  });
};

const sendRejectionEmail = async (booking) => {
  await safeSendMail({
    from: process.env.GMAIL_USER,
    to: booking.email,
    subject: "Booking Update",
    text: `We regret to inform you that your booking for ${booking.date} cannot be accommodated.`,
  });
};

const sendContactMessage = async ({ name, email, phone, message }) => {
  await safeSendMail({
    from: process.env.GMAIL_USER,
    to: "admin@virajgarden.com",
    subject: `Contact Form: ${name}`,
    text: `From: ${name} (${email})\nPhone: ${phone}\n\nMessage:\n${message}`,
  });
};

// ========================
// Exports
// ========================
module.exports = {
  sendBookingConfirmation,
  sendAdminNotification,
  sendRejectionEmail,
  sendContactMessage,
};

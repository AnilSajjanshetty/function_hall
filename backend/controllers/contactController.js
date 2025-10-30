// controllers/contactController.js
const { sendContactMessage } = require('../utils/emailService');

exports.sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await sendContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    });

    res.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending contact message:', error);
    next(error);
  }
};
// utils/smsService.js
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM_NUMBER = process.env.TWILIO_PHONE; // e.g., +1234567890

/**
 * Send SMS
 * @param {string} to - Recipient phone (E.164 format: +919876543210)
 * @param {string} body - Message body
 */
const sendSMS = async (to, body) => {
  if (!client || !FROM_NUMBER) {
    console.warn('Twilio not configured. SMS skipped.');
    return;
  }

  try {
    const message = await client.messages.create({
      body,
      from: FROM_NUMBER,
      to
    });
    console.log(`SMS sent to ${to}: ${message.sid}`);
  } catch (error) {
    console.error(`Failed to send SMS to ${to}:`, error.message);
  }
};

module.exports = { sendSMS };
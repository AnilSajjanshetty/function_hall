const twilio = require("twilio");
require("dotenv").config();

let client = null;
const FROM_NUMBER = process.env.TWILIO_PHONE; // e.g., +1234567890

// Initialize Twilio client only if credentials exist
if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN && FROM_NUMBER) {
  client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  console.log("📱 Twilio SMS service configured successfully");
} else {
  console.warn("⚠️ Twilio not configured — SMS sending will be skipped.");
}

/**
 * Send SMS safely
 * @param {string} to - Recipient phone (E.164 format: +919876543210)
 * @param {string} body - Message content
 */
const sendSMS = async (to, body) => {
  if (!client || !FROM_NUMBER) {
    console.warn(`📭 SMS skipped — Twilio credentials missing.`);
    return;
  }

  try {
    const message = await client.messages.create({
      body,
      from: FROM_NUMBER,
      to,
    });

    console.log(`✅ SMS sent successfully to ${to}: ${message.sid}`);
  } catch (error) {
    console.error(`❌ Failed to send SMS to ${to}:`, error.message);
  }
};

module.exports = { sendSMS };

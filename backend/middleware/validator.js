// middleware/validator.js
exports.validateBooking = (req, res, next) => {
  const { name, email, phone, eventType, date, guests } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!phone || !isValidPhone(phone)) {
    errors.push('Valid phone number is required');
  }

  if (!eventType) {
    errors.push('Event type is required');
  }

  if (!date || !isValidDate(date)) {
    errors.push('Valid future date is required');
  }

  if (!guests || guests < 1) {
    errors.push('Number of guests must be at least 1');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

exports.validateEvent = (req, res, next) => {
  const { title, type, date, guests, description } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (!type) {
    errors.push('Event type is required');
  }

  if (!date) {
    errors.push('Date is required');
  }

  if (!guests || guests < 1) {
    errors.push('Number of guests must be at least 1');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

exports.validateAnnouncement = (req, res, next) => {
  const { title, message } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (!message || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

// Helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}
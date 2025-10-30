// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; // Hashed password

// Hash password on startup if not set
let hashedPassword;
if (!ADMIN_PASSWORD_HASH) {
  bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10, (err, hash) => {
    if (!err) hashedPassword = hash;
  });
} else {
  hashedPassword = ADMIN_PASSWORD_HASH;
}

exports.login = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    
    if (isValidPassword) {
      const token = jwt.sign(
        { role: 'admin', timestamp: Date.now() },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        expiresIn: '24h'
      });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    next(error);
  }
};

exports.verifyToken = async (req, res) => {
  res.json({ 
    valid: true, 
    user: req.user 
  });
};
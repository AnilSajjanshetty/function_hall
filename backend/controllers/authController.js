// ============================================
// controllers/authController.js
// ============================================
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

// Generate access token
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Generate refresh token
const generateRefreshToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

// ✅ Register user
exports.register = async (req, res) => {
  try {
    const { username, email, mobileNo, password } = req.body;

    // Validation
    if (!username || !email || !mobileNo || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already registered' });
    }

    // Get or create user role
    let userRole = await Role.findOne({ name: 'user' });
    if (!userRole) {
      userRole = await Role.create({ name: 'user' });
    }

    // Create user
    const user = new User({
      username,
      email,
      mobileNo,
      password,
      role: userRole._id
    });

    await user.save();

    res.status(201).json({ 
      success: true,
      message: 'Registration successful' 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// ✅ Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role.name);
    const refreshToken = generateRefreshToken(user._id, user.role.name);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Send response
    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role.name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// ✅ Refresh access token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    // Find user and check if refresh token matches
    const user = await User.findById(decoded.id).populate('role');
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id, user.role.name);

    res.json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

// ✅ Logout user
exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Remove refresh token from database
    await User.findByIdAndUpdate(userId, { refreshToken: null });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
};

// ✅ Verify access token
exports.verifyToken = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

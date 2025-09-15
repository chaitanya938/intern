const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const { auth } = require('../middleware/auth');
const config = require('../config/environment');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('tenant').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, tenant } = req.body;
    console.log('Registration attempt for email:', email, 'tenant:', tenant);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Find or create tenant
    let tenantDoc = await Tenant.findOne({ slug: tenant });
    if (!tenantDoc) {
      tenantDoc = new Tenant({
        name: tenant,
        slug: tenant,
        subscription: 'free',
        maxUsers: 5,
        maxNotes: 100
      });
      await tenantDoc.save();
    }

    // Create user
    const user = new User({
      email,
      password,
      role: 'user',
      tenant: tenantDoc._id
    });

    await user.save();
    await user.populate('tenant');

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: {
          id: user.tenant._id,
          name: user.tenant.name,
          slug: user.tenant.slug,
          subscription: user.tenant.subscription
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Find user with tenant information
    const user = await User.findOne({ email }).populate('tenant');
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: {
          id: user.tenant._id,
          name: user.tenant.name,
          slug: user.tenant.slug,
          subscription: user.tenant.subscription
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('tenant');
    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: {
          id: user.tenant._id,
          name: user.tenant.name,
          slug: user.tenant.slug,
          subscription: user.tenant.subscription
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

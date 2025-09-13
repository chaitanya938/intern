const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users for current tenant
// @access  Private (Admin only)
router.get('/', [auth, requireRole(['admin'])], async (req, res) => {
  try {
    const users = await User.find({ tenant: req.user.tenant })
      .select('-password')
      .populate('tenant', 'name slug subscription');

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/invite
// @desc    Invite a new user to the tenant
// @access  Private (Admin only)
router.post('/invite', [
  auth,
  requireRole(['admin']),
  body('email').isEmail().normalizeEmail(),
  body('role').isIn(['admin', 'member'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with default password (in real app, send invitation email)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password', 10);

    const user = new User({
      email,
      password: hashedPassword,
      role,
      tenant: req.user.tenant
    });

    await user.save();
    await user.populate('tenant', 'name slug subscription');

    res.status(201).json({
      message: 'User invited successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: user.tenant
      }
    });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

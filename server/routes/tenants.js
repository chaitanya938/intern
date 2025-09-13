const express = require('express');
const Tenant = require('../models/Tenant');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/tenants/:slug/upgrade
// @desc    Upgrade tenant to Pro plan
// @access  Private (Admin only)
router.post('/:slug/upgrade', [auth, requireRole(['admin'])], async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Verify the tenant belongs to the current user
    if (req.user.tenant.slug !== slug) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tenant = await Tenant.findById(req.user.tenant._id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    tenant.subscription = 'pro';
    tenant.noteLimit = -1; // Unlimited
    await tenant.save();

    res.json({ 
      message: 'Tenant upgraded to Pro plan successfully',
      tenant: {
        id: tenant._id,
        name: tenant.name,
        slug: tenant.slug,
        subscription: tenant.subscription,
        noteLimit: tenant.noteLimit
      }
    });
  } catch (error) {
    console.error('Upgrade tenant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tenants/:slug
// @desc    Get tenant information
// @access  Private
router.get('/:slug', auth, async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Verify the tenant belongs to the current user
    if (req.user.tenant.slug !== slug) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tenant = await Tenant.findById(req.user.tenant._id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json({
      id: tenant._id,
      name: tenant.name,
      slug: tenant.slug,
      subscription: tenant.subscription,
      noteLimit: tenant.noteLimit
    });
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

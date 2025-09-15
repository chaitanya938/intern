const express = require('express');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const Tenant = require('../models/Tenant');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const tenant = await Tenant.findById(req.user.tenant);

    // Check note limit for free plan
    if (tenant.subscription === 'free') {
      const noteCount = await Note.countDocuments({ tenant: req.user.tenant });
      if (noteCount >= tenant.noteLimit) {
        return res.status(403).json({ 
          message: 'Free plan limit reached. Upgrade to Pro for unlimited notes.',
          limit: tenant.noteLimit,
          current: noteCount
        });
      }
    }

    const note = new Note({
      title,
      content,
      tenant: req.user.tenant,
      author: req.user._id
    });

    await note.save();
    await note.populate('author', 'email');

    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notes
// @desc    Get all notes for current tenant
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ tenant: req.user.tenant })
      .populate('author', 'email')
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notes/:id
// @desc    Get a specific note
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      tenant: req.user.tenant 
    }).populate('author', 'email');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', [
  auth,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const note = await Note.findOne({ 
      _id: req.params.id, 
      tenant: req.user.tenant 
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.title = title;
    note.content = content;
    note.updatedAt = new Date();

    await note.save();
    await note.populate('author', 'email');

    res.json(note);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      tenant: req.user.tenant 
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

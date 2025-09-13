const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const {
  updateProfile,
  updatePassword,
  getProfile,
  uploadAvatar
} = require('../controllers/userController');
const path = require('path');

// Protected routes
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.post('/avatar', uploadAvatar);
router.get('/avatar/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, '../uploads/avatars', req.params.filename));
});

// Get user by ID (must be after specific routes)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
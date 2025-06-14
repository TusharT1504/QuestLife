const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  getUserAchievements
} = require('../controllers/profileController');

router.use(auth);

// GET /api/profile - Get user profile
router.get('/', getUserProfile);

// PUT /api/profile - Update user profile
router.put('/', updateUserProfile);

// GET /api/profile/achievements - Get user achievements
router.get('/achievements', getUserAchievements);

module.exports = router; 
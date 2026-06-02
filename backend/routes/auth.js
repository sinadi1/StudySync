const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);

router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

router.put('/profile', protect, updateProfile);

module.exports = router;
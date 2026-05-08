const express = require('express');
const router = express.Router();
const { register, verifyOtp, login, getMe, updateProfile, resetAdminRoute, googleAuth, forgotPassword, resetPassword } = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);
router.post('/reset-admin', verifyAdmin, resetAdminRoute);

module.exports = router;

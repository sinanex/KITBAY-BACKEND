const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Hardcoded Admin Credentials (as requested)
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin@123';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ user: ADMIN_USER }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

// User Login via Phone and OTP (Hardcoded 0000)
router.post('/user/login', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (otp !== '0000') {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

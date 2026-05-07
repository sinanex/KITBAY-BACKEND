const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

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

module.exports = router;

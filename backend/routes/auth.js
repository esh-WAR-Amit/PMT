const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const { getUserByEmail, getUserById } = require('../models/user');



router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    // Verify user credentials
    const user = await getUserByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id },
      config.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }  // 15 minutes
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      config.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }  // 7 days
    );

    // Send tokens in response
    res.json({
      message: 'Login successful',
      tokens: {
        accessToken,
        refreshToken
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body; // Expecting token in the request body
  console.log("From /refresh:", refreshToken);

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);

    // Get user data to include in new access token
    const user = await getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user.id },
      config.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.json({
      message: 'Token refreshed',
      accessToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

module.exports = router;
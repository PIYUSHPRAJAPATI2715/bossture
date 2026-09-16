const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDB } = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check MongoDB if URI set, otherwise fallback to SQLite
    if (process.env.MONGODB_URI || process.env.USE_MONGO === 'true') {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email: cleanEmail,
        password: hashedPassword,
        phone: phone || '',
        role: 'user'
      });

      const userPayload = { id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role };
      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({ message: 'Registration successful', token, user: userPayload });
    } else {
      const db = await getDB();
      const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [cleanEmail]);
      if (existingUser) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.run(
        'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
        [name, cleanEmail, hashedPassword, phone || '', 'user']
      );

      const userPayload = { id: result.lastID, name, email: cleanEmail, phone: phone || '', role: 'user' };
      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({ message: 'Registration successful', token, user: userPayload });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (process.env.MONGODB_URI || process.env.USE_MONGO === 'true') {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) return res.status(401).json({ error: 'Invalid email or password' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

      const userPayload = { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role };
      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

      return res.json({ message: 'Login successful', token, user: userPayload });
    } else {
      const db = await getDB();
      const userRow = await db.get('SELECT * FROM users WHERE email = ?', [cleanEmail]);
      if (!userRow) return res.status(401).json({ error: 'Invalid email or password' });

      const isMatch = await bcrypt.compare(password, userRow.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

      const userPayload = { id: userRow.id, name: userRow.name, email: userRow.email, phone: userRow.phone, role: userRow.role };
      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

      return res.json({ message: 'Login successful', token, user: userPayload });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// GET ME
router.get('/me', authenticateToken, async (req, res) => {
  try {
    if (process.env.MONGODB_URI || process.env.USE_MONGO === 'true') {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, created_at: user.createdAt } });
    } else {
      const db = await getDB();
      const user = await db.get('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [req.user.id]);
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json({ user });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

module.exports = router;

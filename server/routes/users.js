const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { getDB } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const isMongo = () => Boolean(process.env.MONGODB_URI || process.env.USE_MONGO === 'true');

// GET ALL USERS (Admin Only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (isMongo()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      const formatted = users.map(u => ({ id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role, created_at: u.createdAt }));
      return res.json(formatted);
    } else {
      const db = await getDB();
      const users = await db.all('SELECT id, name, email, phone, role, created_at FROM users ORDER BY id DESC');
      return res.json(users);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// TOGGLE ROLE (Admin Only)
router.put('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (isMongo()) {
      await User.findByIdAndUpdate(req.params.id, { role });
      return res.json({ message: 'User role updated successfully' });
    } else {
      const db = await getDB();
      await db.run('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
      return res.json({ message: 'User role updated successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// DELETE USER (Admin Only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (isMongo()) {
      await User.findByIdAndDelete(req.params.id);
      return res.json({ message: 'User deleted successfully' });
    } else {
      const db = await getDB();
      await db.run('DELETE FROM users WHERE id = ?', [req.params.id]);
      return res.json({ message: 'User deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;

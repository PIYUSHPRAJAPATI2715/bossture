const express = require('express');
const router = express.Router();
const ContactInquiry = require('../models/ContactInquiry');
const { getDB } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const isMongo = () => Boolean(process.env.MONGODB_URI || process.env.USE_MONGO === 'true');

// CREATE INQUIRY
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone, and message are required' });
    }

    if (isMongo()) {
      const newInq = await ContactInquiry.create({ name, phone, email: email || '', service: service || 'General Inquiry', message, status: 'New' });
      return res.status(201).json({ message: 'Inquiry received successfully!', inquiry_id: newInq._id });
    } else {
      const db = await getDB();
      const result = await db.run(
        `INSERT INTO contact_inquiries (name, phone, email, service, message, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, phone, email || '', service || 'General Inquiry', message, 'New']
      );
      return res.status(201).json({ message: 'Inquiry received successfully!', inquiry_id: result.lastID });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to record inquiry' });
  }
});

// GET ALL INQUIRIES
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (isMongo()) {
      const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
      const formatted = inquiries.map(i => ({ id: i._id, name: i.name, phone: i.phone, email: i.email, service: i.service, message: i.message, status: i.status, created_at: i.createdAt }));
      return res.json(formatted);
    } else {
      const db = await getDB();
      const inquiries = await db.all('SELECT * FROM contact_inquiries ORDER BY created_at DESC');
      return res.json(inquiries);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// DELETE INQUIRY
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (isMongo()) {
      await ContactInquiry.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Inquiry deleted' });
    } else {
      const db = await getDB();
      await db.run('DELETE FROM contact_inquiries WHERE id = ?', [req.params.id]);
      return res.json({ message: 'Inquiry deleted' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const { getDB } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const isMongo = () => Boolean(process.env.MONGODB_URI || process.env.USE_MONGO === 'true');

// GET ALL PACKAGES
router.get('/', async (req, res) => {
  try {
    if (isMongo()) {
      const packages = await Package.find().sort({ _id: 1 });
      const formatted = packages.map(p => ({ id: p._id, title: p.title, category: p.category, duration: p.duration, price: p.price, badge: p.badge, image: p.image, description: p.description, highlights: p.highlights }));
      return res.json(formatted);
    } else {
      const db = await getDB();
      const packages = await db.all('SELECT * FROM packages ORDER BY id ASC');
      const parsed = packages.map(p => ({ ...p, highlights: p.highlights ? JSON.parse(p.highlights) : [] }));
      return res.json(parsed);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// ADD PACKAGE (Admin Only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, category, duration, price, badge, image, description, highlights } = req.body;
    if (!title || !category || !duration || !price) {
      return res.status(400).json({ error: 'Title, category, duration, and price are required' });
    }

    if (isMongo()) {
      const newPkg = await Package.create({
        title, category, duration, price, badge: badge || '', image: image || '/images/package-1.jpg', description: description || '', highlights: highlights || []
      });
      return res.status(201).json({ message: 'Package created successfully', package: { id: newPkg._id, ...newPkg._doc } });
    } else {
      const db = await getDB();
      const result = await db.run(
        `INSERT INTO packages (title, category, duration, price, badge, image, description, highlights) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, category, duration, price, badge || '', image || '/images/package-1.jpg', description || '', JSON.stringify(highlights || [])]
      );
      const newPkg = await db.get('SELECT * FROM packages WHERE id = ?', [result.lastID]);
      return res.status(201).json({ message: 'Package created successfully', package: { ...newPkg, highlights: newPkg.highlights ? JSON.parse(newPkg.highlights) : [] } });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to add package' });
  }
});

// UPDATE PACKAGE (Admin Only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, category, duration, price, badge, image, description, highlights } = req.body;
    if (isMongo()) {
      const pkg = await Package.findByIdAndUpdate(req.params.id, { title, category, duration, price, badge, image, description, highlights }, { new: true });
      if (!pkg) return res.status(404).json({ error: 'Package not found' });
      return res.json({ message: 'Package updated successfully', package: { id: pkg._id, ...pkg._doc } });
    } else {
      const db = await getDB();
      await db.run(
        `UPDATE packages SET title = COALESCE(?, title), category = COALESCE(?, category), duration = COALESCE(?, duration), price = COALESCE(?, price), badge = COALESCE(?, badge), image = COALESCE(?, image), description = COALESCE(?, description), highlights = COALESCE(?, highlights) WHERE id = ?`,
        [title, category, duration, price, badge, image, description, highlights ? JSON.stringify(highlights) : undefined, req.params.id]
      );
      const updatedPkg = await db.get('SELECT * FROM packages WHERE id = ?', [req.params.id]);
      return res.json({ message: 'Package updated successfully', package: { ...updatedPkg, highlights: updatedPkg.highlights ? JSON.parse(updatedPkg.highlights) : [] } });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update package' });
  }
});

// DELETE PACKAGE (Admin Only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (isMongo()) {
      const result = await Package.findByIdAndDelete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Package not found' });
      return res.json({ message: 'Package deleted successfully' });
    } else {
      const db = await getDB();
      const result = await db.run('DELETE FROM packages WHERE id = ?', [req.params.id]);
      if (result.changes === 0) return res.status(404).json({ error: 'Package not found' });
      return res.json({ message: 'Package deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

module.exports = router;

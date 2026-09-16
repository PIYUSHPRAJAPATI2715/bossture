const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const { getDB } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const isMongo = () => Boolean(process.env.MONGODB_URI || process.env.USE_MONGO === 'true');

// GET ALL CARS
router.get('/', async (req, res) => {
  try {
    if (isMongo()) {
      const cars = await Car.find().sort({ _id: 1 });
      const formatted = cars.map(c => ({ id: c._id, name: c.name, type: c.type, capacity: c.capacity, price_per_km: c.price_per_km, base_price: c.base_price, image: c.image, specs: c.specs, is_available: c.is_available }));
      return res.json(formatted);
    } else {
      const db = await getDB();
      const cars = await db.all('SELECT * FROM cars ORDER BY id ASC');
      const parsedCars = cars.map(c => ({ ...c, specs: c.specs ? JSON.parse(c.specs) : [] }));
      return res.json(parsedCars);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fleet cars' });
  }
});

// ADD CAR (Admin Only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, type, capacity, price_per_km, base_price, image, specs, is_available } = req.body;
    if (!name || !type || !capacity || !price_per_km || !base_price) {
      return res.status(400).json({ error: 'Name, type, capacity, price per km, and base price are required' });
    }

    if (isMongo()) {
      const newCar = await Car.create({
        name,
        type,
        capacity,
        price_per_km,
        base_price,
        image: image || '/images/fleet-sedan.jpg',
        specs: specs || [],
        is_available: is_available !== undefined ? is_available : true
      });
      return res.status(201).json({ message: 'Car added successfully', car: { id: newCar._id, ...newCar._doc } });
    } else {
      const db = await getDB();
      const result = await db.run(
        `INSERT INTO cars (name, type, capacity, price_per_km, base_price, image, specs, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, type, capacity, price_per_km, base_price, image || '/images/fleet-sedan.jpg', JSON.stringify(specs || []), is_available ? 1 : 0]
      );
      const newCar = await db.get('SELECT * FROM cars WHERE id = ?', [result.lastID]);
      return res.status(201).json({ message: 'Car added successfully', car: { ...newCar, specs: newCar.specs ? JSON.parse(newCar.specs) : [] } });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to add car' });
  }
});

// UPDATE CAR (Admin Only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, type, capacity, price_per_km, base_price, image, specs, is_available } = req.body;

    if (isMongo()) {
      const car = await Car.findByIdAndUpdate(req.params.id, { name, type, capacity, price_per_km, base_price, image, specs, is_available }, { new: true });
      if (!car) return res.status(404).json({ error: 'Car not found' });
      return res.json({ message: 'Car updated successfully', car: { id: car._id, ...car._doc } });
    } else {
      const db = await getDB();
      await db.run(
        `UPDATE cars SET name = COALESCE(?, name), type = COALESCE(?, type), capacity = COALESCE(?, capacity), price_per_km = COALESCE(?, price_per_km), base_price = COALESCE(?, base_price), image = COALESCE(?, image), specs = COALESCE(?, specs), is_available = COALESCE(?, is_available) WHERE id = ?`,
        [name, type, capacity, price_per_km, base_price, image, specs ? JSON.stringify(specs) : undefined, is_available !== undefined ? (is_available ? 1 : 0) : undefined, req.params.id]
      );
      const updatedCar = await db.get('SELECT * FROM cars WHERE id = ?', [req.params.id]);
      return res.json({ message: 'Car updated successfully', car: { ...updatedCar, specs: updatedCar.specs ? JSON.parse(updatedCar.specs) : [] } });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update car' });
  }
});

// DELETE CAR (Admin Only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (isMongo()) {
      const result = await Car.findByIdAndDelete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Car not found' });
      return res.json({ message: 'Car deleted successfully' });
    } else {
      const db = await getDB();
      const result = await db.run('DELETE FROM cars WHERE id = ?', [req.params.id]);
      if (result.changes === 0) return res.status(404).json({ error: 'Car not found' });
      return res.json({ message: 'Car deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

module.exports = router;

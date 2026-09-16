const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { getDB } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const isMongo = () => Boolean(process.env.MONGODB_URI || process.env.USE_MONGO === 'true');

// GET ALL BOOKINGS
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (isMongo()) {
      let query = {};
      if (req.user.role !== 'admin') {
        query = { $or: [{ user_id: req.user.id }, { email: req.user.email }] };
      }
      const bookings = await Booking.find(query).sort({ createdAt: -1 });
      const formatted = bookings.map(b => ({ id: b._id, booking_code: b.booking_code, customer_name: b.customer_name, phone: b.phone, email: b.email, service_type: b.service_type, pickup_location: b.pickup_location, drop_location: b.drop_location, pickup_date: b.pickup_date, pickup_time: b.pickup_time, vehicle_name: b.vehicle_name, total_amount: b.total_amount, status: b.status, notes: b.notes }));
      return res.json(formatted);
    } else {
      const db = await getDB();
      let bookings;
      if (req.user.role === 'admin') {
        bookings = await db.all('SELECT * FROM bookings ORDER BY created_at DESC');
      } else {
        bookings = await db.all('SELECT * FROM bookings WHERE user_id = ? OR email = ? ORDER BY created_at DESC', [req.user.id, req.user.email]);
      }
      return res.json(bookings);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// CREATE NEW BOOKING
router.post('/', async (req, res) => {
  try {
    const { user_id, customer_name, phone, email, service_type, pickup_location, drop_location, pickup_date, pickup_time, vehicle_name, total_amount, notes } = req.body;

    if (!customer_name || !phone || !pickup_location || !drop_location || !pickup_date) {
      return res.status(400).json({ error: 'Name, phone, pickup, drop, and pickup date are required' });
    }

    const booking_code = 'BT-' + Math.floor(100000 + Math.random() * 900000);

    if (isMongo()) {
      const newBooking = await Booking.create({
        booking_code,
        user_id: user_id || null,
        customer_name,
        phone,
        email: email || '',
        service_type: service_type || 'Outstation',
        pickup_location,
        drop_location,
        pickup_date,
        pickup_time: pickup_time || '',
        vehicle_name: vehicle_name || '',
        total_amount: total_amount || 0,
        status: 'Pending',
        notes: notes || ''
      });

      return res.status(201).json({ message: 'Booking created successfully', booking: { id: newBooking._id, ...newBooking._doc } });
    } else {
      const db = await getDB();
      const result = await db.run(
        `INSERT INTO bookings (booking_code, user_id, customer_name, phone, email, service_type, pickup_location, drop_location, pickup_date, pickup_time, vehicle_name, total_amount, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [booking_code, user_id || null, customer_name, phone, email || '', service_type || 'Outstation', pickup_location, drop_location, pickup_date, pickup_time || '', vehicle_name || '', total_amount || 0, 'Pending', notes || '']
      );
      const createdBooking = await db.get('SELECT * FROM bookings WHERE id = ?', [result.lastID]);
      return res.status(201).json({ message: 'Booking created successfully', booking: createdBooking });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// UPDATE BOOKING STATUS
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status, notes, total_amount } = req.body;

    if (isMongo()) {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ error: 'Booking not found' });

      if (req.user.role !== 'admin' && String(booking.user_id) !== String(req.user.id) && booking.email !== req.user.email) {
        return res.status(403).json({ error: 'Unauthorized to modify this booking' });
      }

      if (status) booking.status = status;
      if (notes) booking.notes = notes;
      if (total_amount) booking.total_amount = total_amount;
      await booking.save();

      return res.json({ message: 'Booking updated successfully', booking: { id: booking._id, ...booking._doc } });
    } else {
      const db = await getDB();
      await db.run(
        `UPDATE bookings SET status = COALESCE(?, status), notes = COALESCE(?, notes), total_amount = COALESCE(?, total_amount) WHERE id = ?`,
        [status, notes, total_amount, req.params.id]
      );
      const updatedBooking = await db.get('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
      return res.json({ message: 'Booking updated successfully', booking: updatedBooking });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// DELETE BOOKING (Admin Only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (isMongo()) {
      const result = await Booking.findByIdAndDelete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Booking not found' });
      return res.json({ message: 'Booking deleted successfully' });
    } else {
      const db = await getDB();
      const result = await db.run('DELETE FROM bookings WHERE id = ?', [req.params.id]);
      if (result.changes === 0) return res.status(404).json({ error: 'Booking not found' });
      return res.json({ message: 'Booking deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

module.exports = router;

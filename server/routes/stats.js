const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');
const ContactInquiry = require('../models/ContactInquiry');
const { getDB } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const isMongo = () => Boolean(process.env.MONGODB_URI || process.env.USE_MONGO === 'true');

// GET ADMIN DASHBOARD STATS
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (isMongo()) {
      const bookingsCount = await Booking.countDocuments();
      const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
      
      const revenueResult = await Booking.aggregate([
        { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } }
      ]);
      const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

      const carsCount = await Car.countDocuments();
      const usersCount = await User.countDocuments({ role: 'user' });
      const newInquiries = await ContactInquiry.countDocuments({ status: 'New' });

      return res.json({
        total_bookings: bookingsCount || 0,
        pending_bookings: pendingBookings || 0,
        total_revenue: totalRevenue || 0,
        total_cars: carsCount || 0,
        total_users: usersCount || 0,
        new_inquiries: newInquiries || 0
      });
    } else {
      const db = await getDB();
      const bookingsCount = await db.get('SELECT COUNT(*) as count FROM bookings');
      const pendingBookings = await db.get("SELECT COUNT(*) as count FROM bookings WHERE status = 'Pending'");
      const totalRevenue = await db.get("SELECT SUM(total_amount) as sum FROM bookings WHERE status IN ('Confirmed', 'Completed')");
      const carsCount = await db.get('SELECT COUNT(*) as count FROM cars');
      const usersCount = await db.get("SELECT COUNT(*) as count FROM users WHERE role = 'user'");
      const newInquiries = await db.get("SELECT COUNT(*) as count FROM contact_inquiries WHERE status = 'New'");

      return res.json({
        total_bookings: bookingsCount.count || 0,
        pending_bookings: pendingBookings.count || 0,
        total_revenue: totalRevenue.sum || 0,
        total_cars: carsCount.count || 0,
        total_users: usersCount.count || 0,
        new_inquiries: newInquiries.count || 0
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

module.exports = router;

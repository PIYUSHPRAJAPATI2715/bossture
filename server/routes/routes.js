const express = require('express');
const router = express.Router();
const RouteModel = require('../models/Route');
const { getDB } = require('../db');

const isMongo = () => Boolean(process.env.MONGODB_URI || process.env.USE_MONGO === 'true');

// GET ALL POPULAR ROUTES
router.get('/', async (req, res) => {
  try {
    if (isMongo()) {
      const routes = await RouteModel.find().sort({ to_city: 1 });
      const formatted = routes.map(r => ({ id: r._id, from_city: r.from_city, to_city: r.to_city, distance_km: r.distance_km, est_time: r.est_time, start_price: r.start_price, category: r.category }));
      return res.json(formatted);
    } else {
      const db = await getDB();
      const routes = await db.all('SELECT * FROM routes ORDER BY to_city ASC');
      return res.json(routes);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

module.exports = router;

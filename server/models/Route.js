const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  from_city: { type: String, required: true },
  to_city: { type: String, required: true },
  distance_km: { type: Number, required: true },
  est_time: { type: String, required: true },
  start_price: { type: Number, required: true },
  category: { type: String, default: 'outstation' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Route', routeSchema);

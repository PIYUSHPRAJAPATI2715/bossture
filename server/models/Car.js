const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  capacity: { type: String, required: true },
  price_per_km: { type: Number, required: true },
  base_price: { type: Number, required: true },
  image: { type: String, required: true },
  specs: [{ type: String }],
  is_available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Car', carSchema);

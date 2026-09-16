const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  badge: { type: String, default: '' },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  highlights: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Package', packageSchema);

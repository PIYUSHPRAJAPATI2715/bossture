const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  booking_code: { type: String, required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customer_name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  service_type: { type: String, default: 'Outstation' },
  pickup_location: { type: String, required: true },
  drop_location: { type: String, required: true },
  pickup_date: { type: String, required: true },
  pickup_time: { type: String, default: '' },
  vehicle_name: { type: String, default: '' },
  package_name: { type: String, default: '' },
  total_amount: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);

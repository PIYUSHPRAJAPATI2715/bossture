const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  service: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
  status: { type: String, enum: ['New', 'Contacted', 'Resolved'], default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactInquiry', contactInquirySchema);

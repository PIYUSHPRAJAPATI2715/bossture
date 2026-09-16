const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { getDB } = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware with 50MB payload limit for Base64 image uploads & rich data
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static image assets from root directory and client public directory
app.use('/images', express.static(path.join(__dirname, '..')));
app.use('/images', express.static(path.join(__dirname, '..', 'client', 'public', 'images')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/users', require('./routes/users'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/upload', require('./routes/upload'));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Boss Tours & Travels API',
    database: process.env.MONGODB_URI ? 'MongoDB' : 'SQLite',
    timestamp: new Date()
  });
});

// Initialize DB and start server
async function startServer() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB Atlas / Database successfully!');
    } catch (mongoErr) {
      console.error('⚠️ MongoDB Connection Error:', mongoErr.message);
    }
  } else {
    await getDB();
    console.log('✅ Connected to SQLite database successfully!');
  }

  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Boss Tours API Server running on port ${PORT}`);
    console.log(`===================================================`);
  });
}

startServer();

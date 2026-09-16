const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data', 'bosstours.db');

// Ensure directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let dbInstance = null;

async function getDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await initDB(dbInstance);
  return dbInstance;
}

async function initDB(db) {
  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON;');

  // Users Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Cars / Fleet Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      capacity TEXT NOT NULL,
      price_per_km REAL NOT NULL,
      base_price REAL NOT NULL,
      image TEXT NOT NULL,
      specs TEXT,
      is_available INTEGER DEFAULT 1
    );
  `);

  // Packages Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      duration TEXT NOT NULL,
      price REAL NOT NULL,
      badge TEXT,
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      highlights TEXT
    );
  `);

  // Routes Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_city TEXT NOT NULL,
      to_city TEXT NOT NULL,
      distance_km INTEGER NOT NULL,
      est_time TEXT NOT NULL,
      start_price REAL NOT NULL,
      category TEXT DEFAULT 'outstation'
    );
  `);

  // Bookings Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_code TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      service_type TEXT NOT NULL,
      pickup_location TEXT NOT NULL,
      drop_location TEXT NOT NULL,
      pickup_date TEXT NOT NULL,
      pickup_time TEXT,
      vehicle_id INTEGER,
      vehicle_name TEXT,
      package_id INTEGER,
      package_name TEXT,
      total_amount REAL,
      status TEXT DEFAULT 'Pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // Contact Inquiries Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      service TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'New',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

module.exports = { getDB };

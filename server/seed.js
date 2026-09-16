const bcrypt = require('bcryptjs');
const { getDB } = require('./db');

async function seed() {
  console.log('Seeding database...');
  const db = await getDB();

  // 1. Seed Users (Admin & Sample Customer)
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await db.run(`
    INSERT OR IGNORE INTO users (id, name, email, password, phone, role)
    VALUES 
    (1, 'Boss Admin', 'admin@bosstours.com', ?, '+91 9272174699', 'admin'),
    (2, 'Rahul Sharma', 'rahul@example.com', ?, '+91 9876543210', 'user')
  `, [adminPassword, userPassword]);

  // 2. Seed Fleet Cars
  await db.run(`DELETE FROM cars`);
  const carsData = [
    {
      name: 'Swift Dzire',
      type: 'Sedan',
      capacity: '4+1 Seater AC',
      price_per_km: 12,
      base_price: 2500,
      image: '/images/fleet-sedan.jpg',
      specs: JSON.stringify(['4 Passengers', '2 Bags', 'Air Conditioned', 'Clean & Sanitized', 'Bluetooth Music']),
      is_available: 1
    },
    {
      name: 'Maruti Ertiga',
      type: 'SUV',
      capacity: '6+1 Seater AC',
      price_per_km: 15,
      base_price: 3500,
      image: '/images/fleet-ertiga.jpg',
      specs: JSON.stringify(['6 Passengers', '4 Bags', 'Dual AC', 'Pushback Seats', 'Spacious Boot']),
      is_available: 1
    },
    {
      name: 'Toyota Innova Crysta',
      type: 'Premium SUV',
      capacity: '7 Seater Premium',
      price_per_km: 18,
      base_price: 4500,
      image: '/images/fleet-innova.jpg',
      specs: JSON.stringify(['7 Passengers', '5 Bags', 'Rear AC Vents', 'Reclining Seats', 'Captain Seats']),
      is_available: 1
    },
    {
      name: 'Tempo Traveller',
      type: 'Mini Bus',
      capacity: '13/17/20 Seater',
      price_per_km: 24,
      base_price: 6500,
      image: '/images/fleet-traveller.jpg',
      specs: JSON.stringify(['13-20 Passengers', 'Ample Luggage', 'High Roof AC', 'LCD Screen', 'Recliner Seats']),
      is_available: 1
    },
    {
      name: 'Boss Luxury Fleet',
      type: 'Luxury',
      capacity: 'VIP Executive',
      price_per_km: 35,
      base_price: 9500,
      image: '/images/fleet-luxury.jpg',
      specs: JSON.stringify(['4 Passengers', 'VIP Interior', 'Chauffeur in Uniform', 'Bottled Water', 'Premium Audio']),
      is_available: 1
    }
  ];

  for (const c of carsData) {
    await db.run(
      `INSERT INTO cars (name, type, capacity, price_per_km, base_price, image, specs, is_available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.name, c.type, c.capacity, c.price_per_km, c.base_price, c.image, c.specs, c.is_available]
    );
  }

  // 3. Seed Tour Packages
  await db.run(`DELETE FROM packages`);
  const packagesData = [
    {
      title: 'Shirdi Spiritual Darshan',
      category: 'Spiritual',
      duration: '2 Days / 1 Night',
      price: 5499,
      badge: 'Best Seller',
      image: '/images/package-1.jpg',
      description: 'Complete pilgrimage tour to Shirdi Sai Baba Temple & Shani Shingnapur with private door-to-door luxury transport.',
      highlights: JSON.stringify(['VIP Sai Baba Darshan Assistance', 'Visit Shani Shingnapur', 'AC Luxury Vehicle', 'Toll & Driver Allowance Included'])
    },
    {
      title: 'Goa Sunshine Beach Escape',
      category: 'Beach',
      duration: '4 Days / 3 Nights',
      price: 14999,
      badge: 'Popular Choice',
      image: '/images/package-2.jpg',
      description: 'Experience North & South Goa beaches, Dudhsagar waterfall safari, and cruise tours with premium comfort.',
      highlights: JSON.stringify(['Baga & Calangute Beach', 'Dudhsagar Waterfall Trip', 'Mandovi River Cruise', 'Hotel Pickup & Drop'])
    },
    {
      title: 'Lonavala & Khandala Breeze',
      category: 'Hill Station',
      duration: '1 Day Weekend Getaway',
      price: 3499,
      badge: 'Weekend Special',
      image: '/images/package-3.jpg',
      description: 'Refreshing hill station trip covering Tiger Point, Bhushi Dam, Karla Caves, and Wax Museum.',
      highlights: JSON.stringify(['Tiger Point Scenic View', 'Bhushi Dam & Waterfalls', 'Karla & Bhaja Caves', 'Same Day Return'])
    },
    {
      title: 'Mahabaleshwar & Panchgani Retreat',
      category: 'Hill Station',
      duration: '3 Days / 2 Nights',
      price: 9999,
      badge: 'Family Favorite',
      image: '/images/package-4.jpg',
      description: 'Explore Mapro Garden, Arthur Seat, Venna Lake boating, and Table Land in Panchgani.',
      highlights: JSON.stringify(['Mapro Garden Tour', 'Venna Lake Boating', 'Strawberry Farm Visit', 'Luxury Transport'])
    },
    {
      title: 'Trimbakeshwar & Nashik Grape County',
      category: 'Spiritual',
      duration: '2 Days / 1 Night',
      price: 6499,
      badge: 'Exclusive',
      image: '/images/package-5.jpg',
      description: 'Visit Jyotirlinga Trimbakeshwar Temple, Panchavati, Kalaram Temple, and Sula Vineyards.',
      highlights: JSON.stringify(['Trimbakeshwar Temple Darshan', 'Panchavati & Ram Kund', 'Sula Vineyard Tour', 'Doorstep Pickup'])
    },
    {
      title: 'Ashtavinayak Yatra Tour',
      category: 'Spiritual',
      duration: '3 Days / 2 Nights',
      price: 11999,
      badge: 'Divine Package',
      image: '/images/package-6.jpg',
      description: 'Sacred 8 Ganesha temples pilgrimage circuit across Maharashtra in total peace and luxury.',
      highlights: JSON.stringify(['All 8 Ganesha Temples Covered', 'Experienced Devotional Driver', 'Comfortable AC Vehicle', 'Custom Itinerary'])
    }
  ];

  for (const p of packagesData) {
    await db.run(
      `INSERT INTO packages (title, category, duration, price, badge, image, description, highlights)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.title, p.category, p.duration, p.price, p.badge, p.image, p.description, p.highlights]
    );
  }

  // 4. Seed Popular Outstation Routes
  await db.run(`DELETE FROM routes`);
  const routesData = [
    { from_city: 'Mumbai', to_city: 'Shirdi', distance_km: 240, est_time: '4.5 hrs', start_price: 3800 },
    { from_city: 'Mumbai', to_city: 'Pune', distance_km: 150, est_time: '3.0 hrs', start_price: 2400 },
    { from_city: 'Mumbai', to_city: 'Lonavala', distance_km: 85, est_time: '2.0 hrs', start_price: 2000 },
    { from_city: 'Mumbai', to_city: 'Khandala', distance_km: 80, est_time: '1.8 hrs', start_price: 1900 },
    { from_city: 'Mumbai', to_city: 'Mahabaleshwar', distance_km: 260, est_time: '5.5 hrs', start_price: 4200 },
    { from_city: 'Mumbai', to_city: 'Nashik', distance_km: 170, est_time: '3.5 hrs', start_price: 2800 },
    { from_city: 'Mumbai', to_city: 'Goa', distance_km: 590, est_time: '10.5 hrs', start_price: 9500 },
    { from_city: 'Mumbai', to_city: 'Trimbakeshwar', distance_km: 180, est_time: '3.8 hrs', start_price: 3000 },
    { from_city: 'Mumbai', to_city: 'Shani Shingnapur', distance_km: 290, est_time: '5.5 hrs', start_price: 4500 },
    { from_city: 'Mumbai', to_city: 'Aurangabad', distance_km: 340, est_time: '6.0 hrs', start_price: 5200 },
    { from_city: 'Mumbai', to_city: 'Alibaug', distance_km: 95, est_time: '2.5 hrs', start_price: 2200 },
    { from_city: 'Mumbai', to_city: 'Ratnagiri', distance_km: 330, est_time: '6.5 hrs', start_price: 5500 },
    { from_city: 'Mumbai', to_city: 'Kolhapur', distance_km: 380, est_time: '7.0 hrs', start_price: 6000 },
    { from_city: 'Mumbai', to_city: 'Surat', distance_km: 280, est_time: '5.0 hrs', start_price: 4500 },
    { from_city: 'Mumbai', to_city: 'Ahmedabad', distance_km: 530, est_time: '9.0 hrs', start_price: 8500 }
  ];

  for (const r of routesData) {
    await db.run(
      `INSERT INTO routes (from_city, to_city, distance_km, est_time, start_price)
       VALUES (?, ?, ?, ?, ?)`,
      [r.from_city, r.to_city, r.distance_km, r.est_time, r.start_price]
    );
  }

  // 5. Seed Sample Bookings
  await db.run(`DELETE FROM bookings`);
  await db.run(`
    INSERT INTO bookings (booking_code, user_id, customer_name, phone, email, service_type, pickup_location, drop_location, pickup_date, pickup_time, vehicle_name, total_amount, status, notes)
    VALUES 
    ('BT-9012', 2, 'Rahul Sharma', '+91 9876543210', 'rahul@example.com', 'Outstation', 'Bandra West, Mumbai', 'Shirdi Temple', '2026-09-20', '06:00 AM', 'Toyota Innova Crysta', 4500, 'Confirmed', 'Needs child seat'),
    ('BT-9013', NULL, 'Priya Patel', '+91 9820011223', 'priya@example.com', 'Package', 'Dadar, Mumbai', 'Goa Sunshine Beach Escape', '2026-10-05', '07:00 AM', 'Tempo Traveller', 14999, 'Pending', 'Family of 8'),
    ('BT-9014', NULL, 'Amit Deshmukh', '+91 9765432109', 'amit@example.com', 'Rental', 'Airport T2, Mumbai', 'Lonavala Resort', '2026-09-18', '10:00 AM', 'Swift Dzire', 2500, 'Completed', 'Airport pickup confirmed')
  `);

  // 6. Seed Sample Contact Inquiries
  await db.run(`DELETE FROM contact_inquiries`);
  await db.run(`
    INSERT INTO contact_inquiries (name, phone, email, service, message, status)
    VALUES
    ('Suresh Mehta', '+91 9811223344', 'suresh@mehta.com', 'Corporate Car Rental', 'Inquiring about monthly rental rates for executive Sedan fleet.', 'New'),
    ('Ananya Roy', '+91 9988776655', 'ananya@gmail.com', 'Spiritual Tours', 'Do you provide direct hotel pickup in Thane for Shirdi trip?', 'Contacted')
  `);

  console.log('Database seeded successfully!');
}

seed().catch(err => {
  console.error('Error seeding DB:', err);
});

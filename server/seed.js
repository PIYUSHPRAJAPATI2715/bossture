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
      name: 'Swift Dzire / Etios',
      type: 'Sedan',
      capacity: '4+1 Seater AC',
      price_per_km: 12,
      base_price: 2500,
      image: '/images/fleet-sedan.jpg',
      specs: JSON.stringify(['4 Passengers', '2 Bags', 'Air Conditioned', 'Clean & Sanitized', 'Bluetooth Music']),
      is_available: 1
    },
    {
      name: 'Maruti Ertiga / XL6',
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

  // 3. Seed All 8 Tour Packages (Exact Poster Titles & Images)
  await db.run(`DELETE FROM packages`);
  const packagesData = [
    {
      title: '3 Jyotirlinga + Shirdi + Shani Shingnapur Special Package',
      category: 'Spiritual',
      duration: '3 Days / 2 Nights',
      price: 0,
      badge: 'Special Yatra',
      image: '/images/package-3jyotirlinga.jpg',
      description: 'Sacred pilgrimage tour covering Trimbakeshwar Jyotirlinga, Shirdi Sai Baba Darshan, Shani Shingnapur, Grishneshwar Jyotirlinga & Bhimashankar Jyotirlinga.',
      highlights: JSON.stringify(['3 Jyotirlinga Darshan', 'Shirdi Sai Baba Darshan', 'Shani Shingnapur Darshan', 'Mumbai Pickup & Drop', 'Customizable Trip Duration'])
    },
    {
      title: 'Pandharpur • Tuljapur • Akkalkot • Gangapur Divine Darshan Package',
      category: 'Spiritual',
      duration: '3 Days / 2 Nights',
      price: 0,
      badge: 'Divine Blessings',
      image: '/images/package-pandharpur.jpg',
      description: 'Divine spiritual circuit covering Vitthal Rukmini Temple (Pandharpur), Maa Tulja Bhavani (Tuljapur), Swami Samarth (Akkalkot) & Dattatreya Temple (Gangapur).',
      highlights: JSON.stringify(['Pandharpur Vithal Darshan', 'Tuljapur Tulja Bhavani Temple', 'Akkalkot Swami Samarth Maharaj', 'Gangapur Dattatreya Temple', 'Family & Senior Citizen Friendly'])
    },
    {
      title: 'Shirdi & Shani Shingnapur Special Package',
      category: 'Spiritual',
      duration: '2 Days / 1 Night',
      price: 0,
      badge: 'Faith & Peace',
      image: '/images/package-shirdi-shani.jpg',
      description: 'Spiritual journey of faith & peace covering Shirdi Sai Baba Darshan, Kakad Aarti, Shani Shingnapur Temple Darshan, & Oil Offering.',
      highlights: JSON.stringify(['Shirdi Sai Baba Temple Darshan', 'Shani Shingnapur Temple Darshan', 'Oil Offering at Shani Dev', 'Comfortable AC Vehicle', 'Well Planned Itinerary'])
    },
    {
      title: 'Mahabaleshwar Special Trip (3 Days | 2 Nights)',
      category: 'Hill Station',
      duration: '3 Days / 2 Nights',
      price: 0,
      badge: 'Weekend Getaway',
      image: '/images/package-mahabaleshwar.jpg',
      description: 'Complete scenic trip covering Venna Lake boating, Arthur Seat, Mapro Garden strawberry delights, Lingmala Waterfall, & Panchgani Table Land.',
      highlights: JSON.stringify(['Venna Lake & Arthur Seat', 'Mapro Garden Strawberry Tour', 'Lingmala Waterfall Sightseeing', 'Panchgani Table Land & Sydney Point', 'Private AC Cab & Hotel Stay'])
    },
    {
      title: 'Lonavala & Khandala Weekend Getaway Package',
      category: 'Hill Station',
      duration: '1 Day / Weekend Special',
      price: 0,
      badge: 'Perfect Getaway',
      image: '/images/package-lonavala.jpg',
      description: 'Embrace the hills! Explore Bhushi Dam, Tiger Point, Lonavala Lake, Karla Caves, Lonavala Fort, & Chocolate Villa factory.',
      highlights: JSON.stringify(['Bhushi Dam Waterfalls', 'Tiger Point Sunrise View', 'Karla Caves & Lonavala Lake', 'Chocolate Villa Experience', 'Ideal for Couples & Family'])
    },
    {
      title: 'Special Alibag Beach Package (Flat 15% Off)',
      category: 'Beach',
      duration: '2 Days / 1 Night',
      price: 0,
      badge: 'Flat 15% Off',
      image: '/images/package-alibag.jpg',
      description: 'Escape to the serene shores of Alibag. Relax by Alibag Beach, Kolaba Fort, Kihim Beach, Versoli Beach, Nagaon Beach & historic forts.',
      highlights: JSON.stringify(['Alibag & Kihim Beach', 'Kolaba Fort & Nagaon Beach', 'Versoli & Kanakeshwar Temple', 'Doorstep Pickup from Mumbai', '15% Off Special Offer'])
    },
    {
      title: 'Kokan Darshan Special Package (Flat 15% Off)',
      category: 'Coastal Tour',
      duration: '4 Days / 3 Nights',
      price: 0,
      badge: 'Flat 15% Off',
      image: '/images/package-kokan.jpg',
      description: 'Explore coastal beauty of Ratnagiri, Malvan, Ganpati Phule, Sindhudurg Fort, & Tarkarli Beach where mountains meet the sea.',
      highlights: JSON.stringify(['Ratnagiri & Malvan Forts', 'Ganpati Phule Temple Darshan', 'Sindhudurg Fort & Tarkarli Beach', 'Devbagh Beach & Backwaters', '15% Off Coastal Package'])
    },
    {
      title: 'Mumbai Airport Pick-Up & Drop Service',
      category: 'Airport Transfer',
      duration: '24/7 Available',
      price: 0,
      badge: 'On-Time Guaranteed',
      image: '/images/package-airport.jpg',
      description: 'Hassle-free, punctual airport transfers to & from Mumbai International Airport (T1 & T2), Thane, Navi Mumbai, Kalyan, Pune, & all over Maharashtra.',
      highlights: JSON.stringify(['Zero Waiting Delay', 'T1 & T2 Terminal Transfers', 'Sedan / SUV / Innova Fleet', 'Flight Status Monitoring', 'Best Rate Guarantee'])
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
    { from_city: 'Mumbai', to_city: 'Pandharpur', distance_km: 360, est_time: '6.5 hrs', start_price: 5500 },
    { from_city: 'Mumbai', to_city: 'Shani Shingnapur', distance_km: 290, est_time: '5.5 hrs', start_price: 4500 },
    { from_city: 'Mumbai', to_city: 'Aurangabad', distance_km: 340, est_time: '6.0 hrs', start_price: 5200 },
    { from_city: 'Mumbai', to_city: 'Alibaug', distance_km: 95, est_time: '2.5 hrs', start_price: 2200 },
    { from_city: 'Mumbai', to_city: 'Ratnagiri', distance_km: 330, est_time: '6.5 hrs', start_price: 5500 }
  ];

  for (const r of routesData) {
    await db.run(
      `INSERT INTO routes (from_city, to_city, distance_km, est_time, start_price)
       VALUES (?, ?, ?, ?, ?)`,
      [r.from_city, r.to_city, r.distance_km, r.est_time, r.start_price]
    );
  }

  console.log('Database seeded successfully with all 8 poster packages!');
}

seed().catch(err => {
  console.error('Error seeding DB:', err);
});

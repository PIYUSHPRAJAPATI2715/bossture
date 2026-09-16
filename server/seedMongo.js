const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Car = require('./models/Car');
const Package = require('./models/Package');
const Route = require('./models/Route');
const Booking = require('./models/Booking');
const ContactInquiry = require('./models/ContactInquiry');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bosstours';

async function seedMongo() {
  console.log(`Connecting to MongoDB Atlas...`);
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 15000
  });
  console.log('✅ Connected to MongoDB Atlas successfully!');

  // 1. Seed Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await User.deleteMany({});
  const adminUser = await User.create({
    name: 'Boss Admin',
    email: 'admin@bosstours.com',
    password: adminPassword,
    phone: '+91 9272174699',
    role: 'admin'
  });

  const demoUser = await User.create({
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: userPassword,
    phone: '+91 9876543210',
    role: 'user'
  });

  // 2. Seed Fleet Cars
  await Car.deleteMany({});
  await Car.insertMany([
    {
      name: 'Swift Dzire / Etios',
      type: 'Sedan',
      capacity: '4+1 Seater AC',
      price_per_km: 12,
      base_price: 2500,
      image: '/images/fleet-sedan.jpg',
      specs: ['4 Passengers', '2 Bags', 'Air Conditioned', 'Clean & Sanitized', 'Bluetooth Music'],
      is_available: true
    },
    {
      name: 'Maruti Ertiga / XL6',
      type: 'SUV',
      capacity: '6+1 Seater AC',
      price_per_km: 15,
      base_price: 3500,
      image: '/images/fleet-ertiga.jpg',
      specs: ['6 Passengers', '4 Bags', 'Dual AC', 'Pushback Seats', 'Spacious Boot'],
      is_available: true
    },
    {
      name: 'Toyota Innova Crysta',
      type: 'Premium SUV',
      capacity: '7 Seater Premium',
      price_per_km: 18,
      base_price: 4500,
      image: '/images/fleet-innova.jpg',
      specs: ['7 Passengers', '5 Bags', 'Rear AC Vents', 'Reclining Seats', 'Captain Seats'],
      is_available: true
    },
    {
      name: 'Tempo Traveller',
      type: 'Mini Bus',
      capacity: '13/17/20 Seater',
      price_per_km: 24,
      base_price: 6500,
      image: '/images/fleet-traveller.jpg',
      specs: ['13-20 Passengers', 'Ample Luggage', 'High Roof AC', 'LCD Screen', 'Recliner Seats'],
      is_available: true
    },
    {
      name: 'Boss Luxury Fleet',
      type: 'Luxury',
      capacity: 'VIP Executive',
      price_per_km: 35,
      base_price: 9500,
      image: '/images/fleet-luxury.jpg',
      specs: ['4 Passengers', 'VIP Interior', 'Chauffeur in Uniform', 'Bottled Water', 'Premium Audio'],
      is_available: true
    }
  ]);

  // 3. Seed Tour Packages (Exact Poster Titles & Images)
  await Package.deleteMany({});
  await Package.insertMany([
    {
      title: '3 Jyotirlinga + Shirdi + Shani Shingnapur Special Package',
      category: 'Spiritual',
      duration: '3 Days / 2 Nights',
      price: 0,
      badge: 'Special Yatra',
      image: '/images/package-3jyotirlinga.jpg',
      description: 'Sacred pilgrimage tour covering Trimbakeshwar Jyotirlinga, Shirdi Sai Baba Darshan, Shani Shingnapur, Grishneshwar Jyotirlinga & Bhimashankar Jyotirlinga.',
      highlights: ['3 Jyotirlinga Darshan', 'Shirdi Sai Baba Darshan', 'Shani Shingnapur Darshan', 'Mumbai Pickup & Drop', 'Customizable Trip Duration']
    },
    {
      title: 'Mahabaleshwar Special Trip (3 Days | 2 Nights)',
      category: 'Hill Station',
      duration: '3 Days / 2 Nights',
      price: 0,
      badge: 'Weekend Getaway',
      image: '/images/package-mahabaleshwar.jpg',
      description: 'Complete scenic trip covering Venna Lake boating, Arthur Seat, Mapro Garden strawberry delights, Lingmala Waterfall, & Panchgani Table Land.',
      highlights: ['Venna Lake & Arthur Seat', 'Mapro Garden Strawberry Tour', 'Lingmala Waterfall Sightseeing', 'Panchgani Table Land & Sydney Point', 'Private AC Cab & Hotel Stay']
    },
    {
      title: 'Mumbai Airport Pick-Up & Drop Service',
      category: 'Airport Transfer',
      duration: '24/7 Available',
      price: 0,
      badge: 'On-Time Guaranteed',
      image: '/images/package-airport.jpg',
      description: 'Hassle-free, punctual airport transfers to & from Mumbai International Airport (T1 & T2), Thane, Navi Mumbai, Kalyan, Pune, & all over Maharashtra.',
      highlights: ['Zero Waiting Delay', 'T1 & T2 Terminal Transfers', 'Sedan / SUV / Innova Fleet', 'Flight Status Monitoring', 'Best Rate Guarantee']
    },
    {
      title: 'Special Alibag Beach Package (Flat 15% Off)',
      category: 'Beach',
      duration: '2 Days / 1 Night',
      price: 0,
      badge: 'Flat 15% Off',
      image: '/images/package-alibag.jpg',
      description: 'Escape to the serene shores of Alibag. Relax by Alibag Beach, Kolaba Fort, Kihim Beach, Versoli Beach, Nagaon Beach & historic forts.',
      highlights: ['Alibag & Kihim Beach', 'Kolaba Fort & Nagaon Beach', 'Versoli & Kanakeshwar Temple', 'Doorstep Pickup from Mumbai', '15% Off Special Offer']
    },
    {
      title: 'Kokan Darshan Special Package (Flat 15% Off)',
      category: 'Coastal Tour',
      duration: '4 Days / 3 Nights',
      price: 0,
      badge: 'Flat 15% Off',
      image: '/images/package-kokan.jpg',
      description: 'Explore coastal beauty of Ratnagiri, Malvan, Ganpati Phule, Sindhudurg Fort, & Tarkarli Beach where mountains meet the sea.',
      highlights: ['Ratnagiri & Malvan Forts', 'Ganpati Phule Temple Darshan', 'Sindhudurg Fort & Tarkarli Beach', 'Devbagh Beach & Backwaters', '15% Off Coastal Package']
    }
  ]);

  // 4. Seed Routes
  await Route.deleteMany({});
  await Route.insertMany([
    { from_city: 'Mumbai', to_city: 'Shirdi', distance_km: 240, est_time: '4.5 hrs', start_price: 3800 },
    { from_city: 'Mumbai', to_city: 'Pune', distance_km: 150, est_time: '3.0 hrs', start_price: 2400 },
    { from_city: 'Mumbai', to_city: 'Lonavala', distance_km: 85, est_time: '2.0 hrs', start_price: 2000 },
    { from_city: 'Mumbai', to_city: 'Khandala', distance_km: 80, est_time: '1.8 hrs', start_price: 1900 },
    { from_city: 'Mumbai', to_city: 'Mahabaleshwar', distance_km: 260, est_time: '5.5 hrs', start_price: 4200 },
    { from_city: 'Mumbai', to_city: 'Nashik', distance_km: 170, est_time: '3.5 hrs', start_price: 2800 },
    { from_city: 'Mumbai', to_city: 'Goa', distance_km: 590, est_time: '10.5 hrs', start_price: 9500 },
    { from_city: 'Mumbai', to_city: 'Trimbakeshwar', distance_km: 180, est_time: '3.8 hrs', start_price: 3000 },
    { from_city: 'Mumbai', to_city: 'Shani Shingnapur', distance_km: 290, est_time: '5.5 hrs', start_price: 4500 },
    { from_city: 'Mumbai', to_city: 'Aurangabad', distance_km: 340, est_time: '6.0 hrs', start_price: 5200 }
  ]);

  console.log('🎉 MongoDB Atlas seeded successfully with poster packages!');
  await mongoose.disconnect();
}

seedMongo().catch(err => {
  console.error('Error seeding MongoDB:', err);
  process.exit(1);
});

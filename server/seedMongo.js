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
  console.log(`Connecting to MongoDB: ${MONGODB_URI}`);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB successfully!');

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
  console.log('Users seeded');

  // 2. Seed Fleet Cars
  await Car.deleteMany({});
  await Car.insertMany([
    {
      name: 'Swift Dzire',
      type: 'Sedan',
      capacity: '4+1 Seater AC',
      price_per_km: 12,
      base_price: 2500,
      image: '/images/fleet-sedan.jpg',
      specs: ['4 Passengers', '2 Bags', 'Air Conditioned', 'Clean & Sanitized', 'Bluetooth Music'],
      is_available: true
    },
    {
      name: 'Maruti Ertiga',
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
  console.log('Cars seeded');

  // 3. Seed Tour Packages
  await Package.deleteMany({});
  await Package.insertMany([
    {
      title: 'Shirdi Spiritual Darshan',
      category: 'Spiritual',
      duration: '2 Days / 1 Night',
      price: 5499,
      badge: 'Best Seller',
      image: '/images/package-1.jpg',
      description: 'Complete pilgrimage tour to Shirdi Sai Baba Temple & Shani Shingnapur with private door-to-door luxury transport.',
      highlights: ['VIP Sai Baba Darshan Assistance', 'Visit Shani Shingnapur', 'AC Luxury Vehicle', 'Toll & Driver Allowance Included']
    },
    {
      title: 'Goa Sunshine Beach Escape',
      category: 'Beach',
      duration: '4 Days / 3 Nights',
      price: 14999,
      badge: 'Popular Choice',
      image: '/images/package-2.jpg',
      description: 'Experience North & South Goa beaches, Dudhsagar waterfall safari, and cruise tours with premium comfort.',
      highlights: ['Baga & Calangute Beach', 'Dudhsagar Waterfall Trip', 'Mandovi River Cruise', 'Hotel Pickup & Drop']
    },
    {
      title: 'Lonavala & Khandala Breeze',
      category: 'Hill Station',
      duration: '1 Day Weekend Getaway',
      price: 3499,
      badge: 'Weekend Special',
      image: '/images/package-3.jpg',
      description: 'Refreshing hill station trip covering Tiger Point, Bhushi Dam, Karla Caves, and Wax Museum.',
      highlights: ['Tiger Point Scenic View', 'Bhushi Dam & Waterfalls', 'Karla & Bhaja Caves', 'Same Day Return']
    },
    {
      title: 'Mahabaleshwar & Panchgani Retreat',
      category: 'Hill Station',
      duration: '3 Days / 2 Nights',
      price: 9999,
      badge: 'Family Favorite',
      image: '/images/package-4.jpg',
      description: 'Explore Mapro Garden, Arthur Seat, Venna Lake boating, and Table Land in Panchgani.',
      highlights: ['Mapro Garden Tour', 'Venna Lake Boating', 'Strawberry Farm Visit', 'Luxury Transport']
    },
    {
      title: 'Trimbakeshwar & Nashik Grape County',
      category: 'Spiritual',
      duration: '2 Days / 1 Night',
      price: 6499,
      badge: 'Exclusive',
      image: '/images/package-5.jpg',
      description: 'Visit Jyotirlinga Trimbakeshwar Temple, Panchavati, Kalaram Temple, and Sula Vineyards.',
      highlights: ['Trimbakeshwar Temple Darshan', 'Panchavati & Ram Kund', 'Sula Vineyard Tour', 'Doorstep Pickup']
    },
    {
      title: 'Ashtavinayak Yatra Tour',
      category: 'Spiritual',
      duration: '3 Days / 2 Nights',
      price: 11999,
      badge: 'Divine Package',
      image: '/images/package-6.jpg',
      description: 'Sacred 8 Ganesha temples pilgrimage circuit across Maharashtra in total peace and luxury.',
      highlights: ['All 8 Ganesha Temples Covered', 'Experienced Devotional Driver', 'Comfortable AC Vehicle', 'Custom Itinerary']
    }
  ]);
  console.log('Packages seeded');

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
  console.log('Routes seeded');

  // 5. Seed Bookings
  await Booking.deleteMany({});
  await Booking.insertMany([
    {
      booking_code: 'BT-9012',
      user_id: demoUser._id,
      customer_name: 'Rahul Sharma',
      phone: '+91 9876543210',
      email: 'rahul@example.com',
      service_type: 'Outstation',
      pickup_location: 'Bandra West, Mumbai',
      drop_location: 'Shirdi Temple',
      pickup_date: '2026-09-20',
      pickup_time: '06:00 AM',
      vehicle_name: 'Toyota Innova Crysta',
      total_amount: 4500,
      status: 'Confirmed',
      notes: 'Needs child seat'
    },
    {
      booking_code: 'BT-9013',
      customer_name: 'Priya Patel',
      phone: '+91 9820011223',
      email: 'priya@example.com',
      service_type: 'Package',
      pickup_location: 'Dadar, Mumbai',
      drop_location: 'Goa Sunshine Beach Escape',
      pickup_date: '2026-10-05',
      pickup_time: '07:00 AM',
      vehicle_name: 'Tempo Traveller',
      total_amount: 14999,
      status: 'Pending',
      notes: 'Family of 8'
    }
  ]);
  console.log('Bookings seeded');

  // 6. Seed Contact Inquiries
  await ContactInquiry.deleteMany({});
  await ContactInquiry.insertMany([
    {
      name: 'Suresh Mehta',
      phone: '+91 9811223344',
      email: 'suresh@mehta.com',
      service: 'Corporate Car Rental',
      message: 'Inquiring about monthly rental rates for executive Sedan fleet.',
      status: 'New'
    }
  ]);
  console.log('Contact Inquiries seeded');

  console.log('✅ MongoDB database seeded successfully!');
  await mongoose.disconnect();
}

seedMongo().catch(err => {
  console.error('Error seeding MongoDB:', err);
  process.exit(1);
});

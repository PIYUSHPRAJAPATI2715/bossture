import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, MapPin, Calendar, Clock, Star, ShieldCheck, Award, Headset, ArrowRight, CheckCircle2, ChevronRight, PhoneCall } from 'lucide-react';
import axios from 'axios';
import { trackPhoneCall } from '../config/googleAds';
import { getImageUrl, handleImageError } from '../utils/imageUrl';

export default function HomePage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [cars, setCars] = useState([]);
  const [routes, setRoutes] = useState([]);
  
  // Quick Search state
  const [pickup, setPickup] = useState('Mumbai');
  const [drop, setDrop] = useState('Shirdi');
  const [date, setDate] = useState('');
  const [carType, setCarType] = useState('Swift Dzire');

  useEffect(() => {
    // Fetch initial data
    axios.get('/api/packages').then(res => setPackages(res.data.slice(0, 3))).catch(() => {});
    axios.get('/api/cars').then(res => setCars(res.data.slice(0, 4))).catch(() => {});
    axios.get('/api/routes').then(res => setRoutes(res.data.slice(0, 12))).catch(() => {});
  }, []);

  const handleQuickBookingSubmit = (e) => {
    e.preventDefault();
    navigate(`/booking?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}&date=${encodeURIComponent(date)}&car=${encodeURIComponent(carType)}`);
  };

  return (
    <div className="pt-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/images/office-bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-dark-bg/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 text-gold px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <Star className="w-3.5 h-3.5 fill-gold" />
            Premium Luxury Travel & Outstation Cabs
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6"
          >
            Your Journey, <br className="hidden sm:inline" />
            <span className="gold-gradient-text">Our Passion</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 font-light mb-10 leading-relaxed"
          >
            Experience unmatched luxury travel across India. Specialized Shirdi spiritual packages, Goa beach holidays, and sanitized outstation cabs from Mumbai.
          </motion.p>

          {/* Quick Fare Search Bar */}
          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onSubmit={handleQuickBookingSubmit}
            className="glass-card max-w-4xl mx-auto p-4 sm:p-6 rounded-2xl border border-gold/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left shadow-2xl"
          >
            <div>
              <label className="block text-xs font-semibold uppercase text-gold mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Pickup
              </label>
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="e.g. Mumbai"
                required
                className="w-full bg-dark-card/90 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gold mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Drop Location
              </label>
              <input
                type="text"
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
                placeholder="e.g. Shirdi"
                required
                className="w-full bg-dark-card/90 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gold mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Travel Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-dark-card/90 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full gold-btn py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                Search Fare <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* 2. SERVICES HIGHLIGHT */}
      <section className="py-20 bg-dark-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Premium <span className="text-gold">Services</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -8 }}
              className="glass-card p-8 rounded-2xl border border-gold/20 relative group"
            >
              <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-black transition-colors">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Spiritual Tours</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Specialized pilgrimage packages to Shirdi Sai Baba, Shani Shingnapur, Trimbakeshwar, and Ashtavinayak Ganesha temples.
              </p>
              <Link to="/services" className="text-xs font-semibold text-gold flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn More <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="glass-card p-8 rounded-2xl border border-gold/20 relative group"
            >
              <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-black transition-colors">
                <Car className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Outstation Cabs</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Safe, sanitized door-to-door cab services from Mumbai to Pune, Lonavala, Goa, Nashik, Mahabaleshwar, and Gujarat.
              </p>
              <Link to="/routes" className="text-xs font-semibold text-gold flex items-center gap-1 group-hover:gap-2 transition-all">
                View All Routes <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="glass-card p-8 rounded-2xl border border-gold/20 relative group"
            >
              <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-black transition-colors">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Corporate & Luxury</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Executive chauffeur-driven luxury cars for business meetings, airport VIP transfers, and wedding events.
              </p>
              <Link to="/fleet" className="text-xs font-semibold text-gold flex items-center gap-1 group-hover:gap-2 transition-all">
                Explore Fleet <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PACKAGES */}
      <section className="py-20 bg-dark-surface relative border-t border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Exclusive <span className="text-gold">Tour Packages</span>
              </h2>
              <p className="text-sm text-gray-400 mt-2">Handcrafted travel itineraries for families, couples, and spiritual seekers.</p>
            </div>
            <Link to="/packages" className="mt-4 sm:mt-0 text-sm font-semibold text-gold border border-gold/30 px-5 py-2 rounded-full hover:bg-gold hover:text-black transition">
              View All Packages
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl overflow-hidden border border-gold/20 flex flex-col justify-between"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={getImageUrl(pkg.image)} onError={handleImageError} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                  <span className="absolute top-4 left-4 bg-gold text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {pkg.badge || pkg.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white mb-2">{pkg.title}</h3>
                    <p className="text-xs text-gray-400 mb-4">{pkg.duration}</p>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2">{pkg.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div>
                      <span className="text-xs text-gray-400">Starting from</span>
                      <p className="text-xl font-bold text-gold">₹{pkg.price.toLocaleString('en-IN')}</p>
                    </div>
                    <Link
                      to={`/booking?package=${encodeURIComponent(pkg.title)}`}
                      className="gold-btn px-4 py-2 rounded-lg text-xs font-bold uppercase"
                    >
                      Book Package
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LUXURY FLEET SHOWCASE */}
      <section className="py-20 bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Our <span className="text-gold">Luxury Fleet</span>
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto mb-12">
            Meticulously maintained, GPS-enabled, air-conditioned vehicles for absolute comfort and peace of mind.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.map((car) => (
              <motion.div
                key={car.id}
                whileHover={{ scale: 1.02 }}
                className="glass-card rounded-2xl overflow-hidden border border-gold/20 text-left"
              >
                <div className="h-44 overflow-hidden relative">
                  <img src={getImageUrl(car.image)} onError={handleImageError} alt={car.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 right-3 bg-black/80 text-gold text-xs font-bold px-2.5 py-1 rounded-md border border-gold/30">
                    {car.capacity}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-white mb-1">{car.name}</h3>
                  <p className="text-xs text-gold font-semibold mb-3">{car.type}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-800">
                    <span>Rate: <strong className="text-white">₹{car.price_per_km}/km</strong></span>
                    <Link to={`/booking?car=${encodeURIComponent(car.name)}`} className="text-gold font-bold hover:underline">
                      Book Now &rarr;
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. POPULAR ROUTES LIST */}
      <section className="py-16 bg-dark-surface border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Popular <span className="text-gold">Outstation Routes</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Direct cab bookings from Mumbai with fixed transparent fares.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {routes.map((r) => (
              <Link
                key={r.id}
                to={`/booking?pickup=${r.from_city}&drop=${r.to_city}`}
                className="bg-dark-card hover:bg-gold/10 border border-gray-800 hover:border-gold/40 p-3 rounded-xl text-center text-xs transition"
              >
                <span className="font-medium text-white block">{r.from_city} to {r.to_city}</span>
                <span className="text-gold text-[11px]">from ₹{r.start_price}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="py-20 bg-dark-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-widest">Why Choose Boss Tours</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2 mb-6">
                Redefining Luxury & Comfort in Every Mile
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">100% Verified Chauffeurs</h4>
                    <p className="text-sm text-gray-400 mt-1">Background checked, uniform-clad, highly experienced drivers who prioritize your safety.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/30">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Punctual & 24/7 Available</h4>
                    <p className="text-sm text-gray-400 mt-1">On-time doorstep pickup guarantee with round-the-clock live dispatch assistance.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/30">
                    <Headset className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Zero Hidden Charges</h4>
                    <p className="text-sm text-gray-400 mt-1">Transparent pricing structure with upfront billing for tolls, state taxes, and driver fees.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="glass-card p-8 rounded-3xl border border-gold/30 relative z-10 text-center space-y-6">
                <h3 className="font-serif text-2xl font-bold text-gold">Need Instant Assistance?</h3>
                <p className="text-sm text-gray-300">Speak directly with our travel expert for custom itineraries, wedding fleet bookings, or emergency cabs.</p>
                <a
                  href="tel:+919272174699"
                  onClick={trackPhoneCall}
                  className="gold-btn inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-bold shadow-xl"
                >
                  <PhoneCall className="w-5 h-5" /> Call +91 9272174699
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, MapPin, Calendar, Clock, Star, ShieldCheck, Award, Headset, 
  ArrowRight, CheckCircle2, ChevronRight, PhoneCall, Sparkles, Navigation, 
  Check, Plane, HelpCircle, ChevronDown, UserCheck, Zap
} from 'lucide-react';
import axios from 'axios';
import { trackPhoneCall } from '../config/googleAds';
import { getImageUrl, handleImageError } from '../utils/imageUrl';

export default function HomePage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [cars, setCars] = useState([]);
  const [routes, setRoutes] = useState([]);
  
  // Active Booking Tab: 'oneway' | 'roundtrip' | 'local' | 'airport'
  const [bookingTab, setBookingTab] = useState('oneway');

  // Form States
  const [pickup, setPickup] = useState('Mumbai');
  const [drop, setDrop] = useState('Shirdi');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('08:00');
  const [localPackage, setLocalPackage] = useState('8 Hours / 80 KM');
  const [airportOption, setAirportOption] = useState('Mumbai Airport (T2) Drop');
  const [selectedCar, setSelectedCar] = useState('Swift Dzire / Etios');

  // Fleet category filter state
  const [fleetFilter, setFleetFilter] = useState('All');

  // FAQ Accordion open index
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    axios.get('/api/packages').then(res => setPackages(res.data.slice(0, 3))).catch(() => {});
    axios.get('/api/cars').then(res => setCars(res.data)).catch(() => {});
    axios.get('/api/routes').then(res => setRoutes(res.data.slice(0, 12))).catch(() => {});
  }, []);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    let query = `/booking?type=${bookingTab}&pickup=${encodeURIComponent(pickup)}&car=${encodeURIComponent(selectedCar)}`;
    if (bookingTab === 'oneway') {
      query += `&drop=${encodeURIComponent(drop)}&date=${encodeURIComponent(startDate)}`;
    } else if (bookingTab === 'roundtrip') {
      query += `&drop=${encodeURIComponent(drop)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    } else if (bookingTab === 'local') {
      query += `&localPackage=${encodeURIComponent(localPackage)}&date=${encodeURIComponent(startDate)}`;
    } else if (bookingTab === 'airport') {
      query += `&airport=${encodeURIComponent(airportOption)}&date=${encodeURIComponent(startDate)}`;
    }
    navigate(query);
  };

  const categories = ['All', 'Sedan', 'SUV', 'Luxury', 'Traveller'];

  const filteredCars = fleetFilter === 'All'
    ? cars.slice(0, 8)
    : cars.filter(c => c.type.toLowerCase().includes(fleetFilter.toLowerCase()));

  const faqs = [
    {
      q: 'How can I book an outstation taxi with Boss Tours?',
      a: 'Booking a cab is fast and simple! Enter your pickup city, destination, and travel date in the booking search bar above, select your preferred vehicle (Dzire, Ertiga, Innova Crysta, or Tempo Traveller), and confirm your trip instantly.'
    },
    {
      q: 'Are toll taxes, state taxes, and driver allowances included in the fare?',
      a: 'We offer 100% transparent pricing. Our representative provides clear breakdown including base fare, toll charges, driver allowance, and state entry taxes before trip confirmation with zero hidden fees.'
    },
    {
      q: 'Are Boss Tours chauffeurs background-verified and highway experienced?',
      a: 'Yes! All our drivers undergo comprehensive background verification, commercial license checks, medical clearance, and specialized training for highway safety and customer courtesy.'
    },
    {
      q: 'Can I book a one-way outstation cab without paying for return km?',
      a: 'Absolutely! We offer dedicated one-way cab services from Mumbai to major cities like Pune, Shirdi, Nashik, Surat, and Lonavala where you only pay for the distance travelled one way.'
    },
    {
      q: 'What safety and sanitation measures are taken for the cabs?',
      a: 'Every car in our fleet undergoes complete sanitization, AC deep cleaning, and strict quality checks before every single dispatch.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="pt-16 sm:pt-20">
      
      {/* 1. HERO SECTION WITH MANSI-STYLE TABBED BOOKING ENGINE */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden py-12 px-4 sm:px-6">
        {/* Animated Background Overlay */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/office-bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/85 to-black/70" />

        <div className="relative max-w-7xl mx-auto text-center z-10 w-full pt-6">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 text-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
          >
            <Sparkles className="w-3.5 h-3.5 fill-gold animate-pulse" />
            India's Most Trusted Outstation & Local Taxi Service
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-4 sm:mb-6"
          >
            Safe, Reliable & <br />
            <span className="gold-gradient-text drop-shadow-[0_4px_25px_rgba(212,175,55,0.3)]">Affordable Luxury Cabs</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 font-light mb-8 sm:mb-10 leading-relaxed px-2"
          >
            Book One-Way Drops, Round Trips, Airport Transfers, & Pilgrimage Tour Packages with 100% verified chauffeurs.
          </motion.p>

          {/* MANSI-STYLE TABBED BOOKING SEARCH WIDGET */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="glass-card max-w-4xl mx-auto p-4 sm:p-6 rounded-3xl border border-gold/30 shadow-2xl shadow-black/90 backdrop-blur-2xl text-left"
          >
            {/* Booking Category Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-gray-800/80 pb-4">
              {[
                { id: 'oneway', label: 'One Way Cab', icon: Navigation },
                { id: 'roundtrip', label: 'Round Trip', icon: Car },
                { id: 'local', label: 'Local Rental', icon: Clock },
                { id: 'airport', label: 'Airport Drop', icon: Plane }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = bookingTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setBookingTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? 'gold-btn shadow-lg scale-105'
                        : 'bg-dark-card/90 text-gray-400 border border-gray-800 hover:border-gold/40 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Form Inputs */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={bookingTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
                >
                  {/* Pickup City */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gold mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> From Pickup
                    </label>
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder="e.g. Mumbai"
                      required
                      className="w-full bg-dark-card/90 border border-gray-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  {/* Destination Drop / Option depending on Tab */}
                  {bookingTab === 'oneway' || bookingTab === 'roundtrip' ? (
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gold mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> To Destination
                      </label>
                      <input
                        type="text"
                        value={drop}
                        onChange={(e) => setDrop(e.target.value)}
                        placeholder="e.g. Shirdi / Pune / Goa"
                        required
                        className="w-full bg-dark-card/90 border border-gray-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                      />
                    </div>
                  ) : bookingTab === 'local' ? (
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gold mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Rental Package
                      </label>
                      <select
                        value={localPackage}
                        onChange={(e) => setLocalPackage(e.target.value)}
                        className="w-full bg-dark-card/90 border border-gray-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                      >
                        <option>8 Hours / 80 KM</option>
                        <option>12 Hours / 120 KM</option>
                        <option>Full Day Outstation</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gold mb-1 flex items-center gap-1.5">
                        <Plane className="w-3.5 h-3.5" /> Airport Transfer
                      </label>
                      <select
                        value={airportOption}
                        onChange={(e) => setAirportOption(e.target.value)}
                        className="w-full bg-dark-card/90 border border-gray-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                      >
                        <option>Mumbai Airport (T2) Drop</option>
                        <option>Mumbai Domestic (T1) Drop</option>
                        <option>Pune Airport Transfer</option>
                      </select>
                    </div>
                  )}

                  {/* Date Input */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gold mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Travel Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full bg-dark-card/90 border border-gray-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  {/* Vehicle Selector */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gold mb-1 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5" /> Car Choice
                    </label>
                    <select
                      value={selectedCar}
                      onChange={(e) => setSelectedCar(e.target.value)}
                      className="w-full bg-dark-card/90 border border-gray-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                    >
                      <option>Swift Dzire / Etios (Sedan)</option>
                      <option>Ertiga / XL6 (SUV 6+1)</option>
                      <option>Innova Crysta (Luxury SUV)</option>
                      <option>Tempo Traveller (13/17 Seater)</option>
                    </select>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-4 border-t border-gray-800/80">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Instant Booking • Zero Cancellation Fee • Verified Chauffeurs</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="gold-btn px-8 py-3 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-gold/20"
                >
                  Find Available Cabs <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </form>
          </motion.div>

        </div>
      </section>

      {/* 2. MANSI-STYLE POPULAR OUTSTATION ROUTES CARDS */}
      <section className="py-16 sm:py-24 bg-dark-bg relative border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="text-xs font-bold text-gold uppercase tracking-widest block mb-2">Direct Flat Pricing</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-3">
              Popular <span className="text-gold">Outstation Cab Routes</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
              Transparent fixed fares for one-way drops and round-trip journeys across Maharashtra, Goa, and Gujarat.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {routes.slice(0, 6).map((route) => (
              <motion.div
                key={route.id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="glass-card p-6 rounded-2xl border border-gold/20 flex flex-col justify-between hover:border-gold/50 transition-all duration-300 shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
                      One-Way / Round Trip
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold" /> {route.est_time}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white mb-2 flex items-center gap-2 group-hover:text-gold transition">
                    <span>{route.from_city}</span>
                    <ArrowRight className="w-4 h-4 text-gold shrink-0" />
                    <span>{route.to_city}</span>
                  </h3>

                  <p className="text-xs text-gray-400 mb-6">
                    Approx Distance: <strong className="text-gray-200">{route.distance_km} km</strong>
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-400 block uppercase">Starting Fare</span>
                    <span className="font-serif text-2xl font-bold text-gold">₹{route.start_price.toLocaleString('en-IN')}</span>
                  </div>
                  <Link
                    to={`/booking?pickup=${encodeURIComponent(route.from_city)}&drop=${encodeURIComponent(route.to_city)}`}
                    className="gold-btn px-4 py-2 rounded-xl text-xs font-bold uppercase shadow-md"
                  >
                    Book Cab
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. MANSI-STYLE INTERACTIVE FLEET SHOWCASE WITH FILTER TABS */}
      <section className="py-16 sm:py-24 bg-dark-surface border-t border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-bold text-gold uppercase tracking-widest block mb-2">Sanitized & Comfort Fleet</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-3">
              Explore Our <span className="text-gold">Luxury Fleet</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
              Select from comfortable AC Sedans, spacious 6+1 SUVs, executive Innova Crystas, and large group Tempo Travellers.
            </p>
          </motion.div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFleetFilter(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  fleetFilter === cat
                    ? 'gold-btn shadow-lg scale-105'
                    : 'bg-dark-card text-gray-400 border border-gray-800 hover:border-gold/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cars Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredCars.map((car) => (
              <motion.div
                key={car.id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="glass-card rounded-3xl overflow-hidden border border-gold/20 text-left flex flex-col justify-between hover:border-gold/50 transition-all duration-300 shadow-xl group"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={getImageUrl(car.image)} 
                      onError={handleImageError} 
                      alt={car.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <span className="absolute top-3 left-3 bg-gold text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      {car.type}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-black/85 text-gold text-xs font-semibold px-3 py-1 rounded-xl border border-gold/30">
                      {car.capacity}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-xl font-bold text-white mb-2">{car.name}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                      Sanitized AC commercial vehicle driven by verified highway chauffeur.
                    </p>

                    {/* Specs Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="text-[10px] text-gray-300 bg-dark-bg px-2.5 py-1 rounded-lg border border-gray-800 flex items-center gap-1">
                        <Check className="w-3 h-3 text-gold" /> AC Fitted
                      </span>
                      <span className="text-[10px] text-gray-300 bg-dark-bg px-2.5 py-1 rounded-lg border border-gray-800 flex items-center gap-1">
                        <Check className="w-3 h-3 text-gold" /> Clean Interior
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Rate per KM</span>
                    <span className="font-serif text-xl font-bold text-gold">₹{car.price_per_km}</span>
                  </div>

                  <Link 
                    to={`/booking?car=${encodeURIComponent(car.name)}`} 
                    className="gold-btn px-4 py-2 rounded-xl text-xs font-bold uppercase shadow-md"
                  >
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US & TRUST STATS */}
      <section className="py-16 sm:py-24 bg-dark-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-widest">Pinnacle of Safety</span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-2 mb-6">
                Why Thousands Choose Boss Tours Every Month
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/30">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">100% Background Verified Drivers</h4>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Our highway chauffeurs pass stringent background checks, license verification, and hospitality etiquette training.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/30">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Zero Cancellation Delay</h4>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Instant driver & vehicle assignment with live GPS speed and route tracking.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/30">
                    <Headset className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">24/7 Dedicated Support Desk</h4>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Our Mumbai customer care line (+91 9272174699) is available round-the-clock for flight delays or custom trip updates.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mansi-Style Hotline Banner */}
            <div className="relative">
              <div className="glass-card p-8 sm:p-10 rounded-3xl border border-gold/30 text-center space-y-6 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-gold/15 text-gold flex items-center justify-center mx-auto border border-gold/40 shadow-inner">
                  <Star className="w-8 h-8 fill-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-3xl font-extrabold text-gold">4.9 ★ Rating</h3>
                  <p className="text-xs text-gray-400 mt-1">Based on 15,000+ Verified Customer Rides</p>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  "Prompt pickup at Mumbai Airport, super clean Innova Crysta, and very courteous driver. Best outstation cab experience!"
                </p>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="tel:+919272174699"
                  onClick={trackPhoneCall}
                  className="gold-btn inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-extrabold uppercase shadow-xl"
                >
                  <PhoneCall className="w-5 h-5" /> Call Hotline: +91 9272174699
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE FAQ ACCORDION SECTION */}
      <section className="py-16 sm:py-24 bg-dark-surface border-t border-gold/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-gold uppercase tracking-widest block mb-2">Got Questions?</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-3">
              Frequently Asked <span className="text-gold">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="glass-card rounded-2xl border border-gold/20 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-serif text-base sm:text-lg font-bold text-white flex items-center justify-between gap-4 hover:text-gold transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gold shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-gray-800/60 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}

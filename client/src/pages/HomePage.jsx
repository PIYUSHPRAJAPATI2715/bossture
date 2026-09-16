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
      a: 'We offer 100% transparent pricing. Our representative provides a clear breakdown including base fare, toll charges, driver allowance, and state entry taxes before trip confirmation with zero hidden fees.'
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
    <div className="pt-16 sm:pt-20 bg-slate-50">
      
      {/* 1. HERO SECTION WITH MANSI-STYLE WHITE THEME WIDGET */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-12 px-4 sm:px-6 bg-gradient-to-b from-amber-50/50 via-slate-50 to-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center z-10 w-full pt-6">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-800 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 fill-amber-600 text-amber-600 animate-pulse" />
            India's Premier Outstation & Local Taxi Service
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-3xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 sm:mb-6"
          >
            Safe, Reliable & <br />
            <span className="text-amber-600 underline decoration-amber-300 decoration-wavy decoration-2">Affordable Luxury Cabs</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-normal mb-8 sm:mb-10 leading-relaxed px-2"
          >
            Book One-Way Drops, Round Trips, Airport Transfers, & Pilgrimage Tour Packages with 100% verified chauffeurs.
          </motion.p>

          {/* MANSI-STYLE WHITE THEME TABBED BOOKING SEARCH WIDGET */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white max-w-4xl mx-auto p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-2xl text-left"
          >
            {/* Booking Category Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-100 pb-4">
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? 'bg-slate-900 text-amber-400 shadow-md scale-105'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
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
                    <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" /> From Pickup
                    </label>
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder="e.g. Mumbai"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                    />
                  </div>

                  {/* Destination Drop / Option depending on Tab */}
                  {bookingTab === 'oneway' || bookingTab === 'roundtrip' ? (
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" /> To Destination
                      </label>
                      <input
                        type="text"
                        value={drop}
                        onChange={(e) => setDrop(e.target.value)}
                        placeholder="e.g. Shirdi / Pune / Goa"
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                      />
                    </div>
                  ) : bookingTab === 'local' ? (
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Rental Package
                      </label>
                      <select
                        value={localPackage}
                        onChange={(e) => setLocalPackage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                      >
                        <option>8 Hours / 80 KM</option>
                        <option>12 Hours / 120 KM</option>
                        <option>Full Day Outstation</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                        <Plane className="w-3.5 h-3.5 text-amber-600" /> Airport Transfer
                      </label>
                      <select
                        value={airportOption}
                        onChange={(e) => setAirportOption(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                      >
                        <option>Mumbai Airport (T2) Drop</option>
                        <option>Mumbai Domestic (T1) Drop</option>
                        <option>Pune Airport Transfer</option>
                      </select>
                    </div>
                  )}

                  {/* Date Input */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" /> Travel Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                    />
                  </div>

                  {/* Vehicle Selector */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-amber-600" /> Car Choice
                    </label>
                    <select
                      value={selectedCar}
                      onChange={(e) => setSelectedCar(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
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
              <div className="pt-3 flex items-center justify-between flex-wrap gap-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant Confirmation • Zero Cancellation Fees • Verified Drivers</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="gold-btn px-8 py-3 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  Find Available Cabs <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </form>
          </motion.div>

        </div>
      </section>

      {/* 2. MANSI-STYLE POPULAR OUTSTATION ROUTES CARDS */}
      <section className="py-16 sm:py-24 bg-white relative border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">Direct Flat Fares</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900 mb-3">
              Popular <span className="text-amber-600">Outstation Cab Routes</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
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
                className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      One-Way / Round Trip
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> {route.est_time}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-slate-900 mb-2 flex items-center gap-2 group-hover:text-amber-600 transition">
                    <span>{route.from_city}</span>
                    <ArrowRight className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{route.to_city}</span>
                  </h3>

                  <p className="text-xs text-slate-500 mb-6">
                    Approx Distance: <strong className="text-slate-800 font-semibold">{route.distance_km} km</strong>
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">Starting Fare</span>
                    <span className="font-serif text-2xl font-extrabold text-amber-600">₹{route.start_price.toLocaleString('en-IN')}</span>
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
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">Sanitized & Comfort Fleet</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900 mb-3">
              Explore Our <span className="text-amber-600">Luxury Fleet</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Select from comfortable AC Sedans, spacious 6+1 SUVs, executive Innova Crystas, and large group Tempo Travellers.
            </p>
          </motion.div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFleetFilter(cat)}
                className={`px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  fleetFilter === cat
                    ? 'bg-slate-900 text-amber-400 shadow-md scale-105'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-amber-400 hover:text-slate-900'
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
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 text-left flex flex-col justify-between hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl group"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={getImageUrl(car.image)} 
                      onError={handleImageError} 
                      alt={car.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      {car.type}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-slate-900/90 text-amber-400 text-xs font-bold px-3 py-1 rounded-xl shadow">
                      {car.capacity}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">{car.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      Sanitized AC commercial vehicle driven by verified highway chauffeur.
                    </p>

                    {/* Specs Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="text-[10px] text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> AC Fitted
                      </span>
                      <span className="text-[10px] text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> Clean Interior
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Rate per KM</span>
                    <span className="font-serif text-xl font-extrabold text-amber-600">₹{car.price_per_km}</span>
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
      <section className="py-16 sm:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Pinnacle of Safety</span>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-6">
                Why Thousands Choose Boss Tours Every Month
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200 shadow-sm">
                    <UserCheck className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">100% Background Verified Drivers</h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">Our highway chauffeurs pass stringent background checks, license verification, and hospitality etiquette training.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200 shadow-sm">
                    <Zap className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Zero Cancellation Delay</h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">Instant driver & vehicle assignment with live GPS speed and route tracking.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200 shadow-sm">
                    <Headset className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">24/7 Dedicated Support Desk</h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">Our Mumbai customer care line (+91 9272174699) is available round-the-clock for flight delays or custom trip updates.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mansi-Style Hotline Banner */}
            <div className="relative">
              <div className="bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-800 text-center space-y-6 shadow-2xl text-white">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40 shadow-inner">
                  <Star className="w-8 h-8 fill-amber-400" />
                </div>
                <div>
                  <h3 className="font-serif text-3xl font-extrabold text-amber-400">4.9 ★ Rating</h3>
                  <p className="text-xs text-slate-400 mt-1">Based on 15,000+ Verified Customer Rides</p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">Got Questions?</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900 mb-3">
              Frequently Asked <span className="text-amber-600">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-serif text-base sm:text-lg font-bold text-slate-900 flex items-center justify-between gap-4 hover:text-amber-600 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-amber-600 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
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

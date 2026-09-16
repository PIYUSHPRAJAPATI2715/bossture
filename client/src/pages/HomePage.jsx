import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, MapPin, Calendar, Clock, Star, ShieldCheck, Award, Headset, 
  ArrowRight, CheckCircle2, ChevronRight, PhoneCall, Sparkles, Navigation, 
  Check, Plane, HelpCircle, ChevronDown, UserCheck, Zap, Maximize2, Send,
  ArrowLeftRight, Search, X
} from 'lucide-react';
import axios from 'axios';
import { trackPhoneCall } from '../config/googleAds';
import { getImageUrl, handleImageError } from '../utils/imageUrl';
import { maharashtraRoutes } from '../data/maharashtraRoutes';

export default function HomePage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [cars, setCars] = useState([]);
  const [routes, setRoutes] = useState(maharashtraRoutes);
  
  // Active Booking Tab: 'oneway' | 'roundtrip' | 'local' | 'airport'
  const [bookingTab, setBookingTab] = useState('oneway');

  // Form Date Helpers
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // Form States
  const [pickup, setPickup] = useState('Mumbai');
  const [drop, setDrop] = useState('Shirdi');
  const [startDate, setStartDate] = useState(getTodayDate());
  const [endDate, setEndDate] = useState(getTomorrowDate());
  const [localPackage, setLocalPackage] = useState('8 Hours / 80 KM');
  const [airportOption, setAirportOption] = useState('Mumbai Airport (T2) Drop');
  const [selectedCar, setSelectedCar] = useState('Swift Dzire / Etios');

  // Autocomplete UI states
  const [showPickupList, setShowPickupList] = useState(false);
  const [showDropList, setShowDropList] = useState(false);

  // Live Search Results Modal State
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Fleet category filter state
  const [fleetFilter, setFleetFilter] = useState('All');

  // FAQ Accordion open index
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    axios.get('/api/packages').then(res => setPackages(res.data.slice(0, 3))).catch(() => {});
    axios.get('/api/cars').then(res => setCars(res.data)).catch(() => {});
    axios.get('/api/routes').then(res => {
      if (res.data && res.data.length > 0) setRoutes(res.data);
    }).catch(() => {});
  }, []);

  const popularPickups = [
    'Mumbai', 'Pune', 'Thane', 'Navi Mumbai', 'Kalyan', 'Nashik', 
    'Dadar', 'Borivali', 'Chhatrapati Shivaji Airport (BOM)'
  ];

  const popularDrops = [
    'Shirdi', 'Pune', 'Lonavala', 'Khandala', 'Mahabaleshwar', 
    'Trimbakeshwar', 'Pandharpur', 'Tuljapur', 'Goa', 'Alibaug', 'Surat'
  ];

  const handleSwapCities = () => {
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);

    const matchedRoute = routes.find(
      r => (r.from_city.toLowerCase() === pickup.toLowerCase() && r.to_city.toLowerCase() === drop.toLowerCase()) ||
           (r.from_city.toLowerCase() === drop.toLowerCase() && r.to_city.toLowerCase() === pickup.toLowerCase())
    ) || routes.find(
      r => r.to_city.toLowerCase() === drop.toLowerCase()
    );

    const distance = matchedRoute ? matchedRoute.distance_km : 240;
    const estTime = matchedRoute ? matchedRoute.est_time : '4.5 hrs';

    setTimeout(() => {
      setIsSearching(false);
      setSearchResults({
        pickup,
        drop,
        bookingTab,
        startDate,
        endDate,
        localPackage,
        airportOption,
        distance,
        estTime,
        selectedCar
      });
    }, 350);
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

          {/* MANSI-STYLE DYNAMIC WHITE THEME SEARCH WIDGET */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white max-w-5xl mx-auto p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-2xl text-left relative z-20"
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
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end relative"
                >
                  {/* Pickup City */}
                  <div className="lg:col-span-3 relative">
                    <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" /> From Pickup
                    </label>
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      onFocus={() => setShowPickupList(true)}
                      onBlur={() => setTimeout(() => setShowPickupList(false), 200)}
                      placeholder="e.g. Mumbai"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-semibold"
                    />

                    {/* Pickup City Suggestions Dropdown */}
                    <AnimatePresence>
                      {showPickupList && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden text-xs max-h-52 overflow-y-auto"
                        >
                          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase bg-slate-50">Popular Pickups</div>
                          {popularPickups.map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => {
                                setPickup(city);
                                setShowPickupList(false);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-amber-50 hover:text-amber-700 transition flex items-center gap-2 font-medium border-b border-slate-100 last:border-0"
                            >
                              <MapPin className="w-3 h-3 text-amber-600" /> {city}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Swap Button for Pickup & Drop */}
                  {(bookingTab === 'oneway' || bookingTab === 'roundtrip') && (
                    <div className="hidden lg:flex items-center justify-center pb-1">
                      <button
                        type="button"
                        onClick={handleSwapCities}
                        title="Swap Cities"
                        className="w-8 h-8 rounded-full bg-amber-50 border border-amber-300 text-amber-700 hover:bg-amber-500 hover:text-slate-950 transition flex items-center justify-center shadow-sm"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Destination Drop / Option depending on Tab */}
                  {bookingTab === 'oneway' || bookingTab === 'roundtrip' ? (
                    <div className="lg:col-span-3 relative">
                      <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" /> To Destination
                      </label>
                      <input
                        type="text"
                        value={drop}
                        onChange={(e) => setDrop(e.target.value)}
                        onFocus={() => setShowDropList(true)}
                        onBlur={() => setTimeout(() => setShowDropList(false), 200)}
                        placeholder="e.g. Shirdi"
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-semibold"
                      />

                      {/* Drop Suggestions Dropdown */}
                      <AnimatePresence>
                        {showDropList && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden text-xs max-h-52 overflow-y-auto"
                          >
                            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase bg-slate-50">Popular Destinations</div>
                            {popularDrops.map((city) => (
                              <button
                                key={city}
                                type="button"
                                onClick={() => {
                                  setDrop(city);
                                  setShowDropList(false);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-amber-50 hover:text-amber-700 transition flex items-center gap-2 font-medium border-b border-slate-100 last:border-0"
                              >
                                <MapPin className="w-3 h-3 text-amber-600" /> {city}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : bookingTab === 'local' ? (
                    <div className="lg:col-span-3">
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
                    <div className="lg:col-span-3">
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
                  <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-extrabold uppercase text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" /> Travel Date
                      </label>
                      <div className="flex items-center gap-1 text-[10px]">
                        <button 
                          type="button" 
                          onClick={() => setStartDate(getTodayDate())}
                          className="text-amber-700 bg-amber-50 hover:bg-amber-200 px-1.5 py-0.5 rounded font-bold"
                        >
                          Today
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setStartDate(getTomorrowDate())}
                          className="text-slate-600 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded font-bold"
                        >
                          Tomorrow
                        </button>
                      </div>
                    </div>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-semibold"
                    />
                  </div>

                  {/* Vehicle Selector */}
                  <div className="lg:col-span-2">
                    <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-amber-600" /> Car Choice
                    </label>
                    <select
                      value={selectedCar}
                      onChange={(e) => setSelectedCar(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
                    >
                      <option value="Swift Dzire / Etios">Swift Dzire (₹13/km)</option>
                      <option value="Maruti Ertiga / XL6">Ertiga / XL6 (₹16/km)</option>
                      <option value="Toyota Innova Crysta">Innova Crysta (₹20/km)</option>
                      <option value="Tempo Traveller">Tempo Traveller (₹28/km)</option>
                      <option value="Luxury Bus / Coach">Luxury Bus (Starts ₹45/km)</option>
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
                  disabled={isSearching}
                  className="gold-btn px-8 py-3 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isSearching ? (
                    <span>Searching Cabs...</span>
                  ) : (
                    <>
                      <span>Find Available Cabs</span> <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

        </div>
      </section>

      {/* DYNAMIC SEARCH RESULTS MODAL */}
      <AnimatePresence>
        {searchResults && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">Available Cabs Search</span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2 mt-1">
                    <span>{searchResults.pickup}</span>
                    <ArrowRight className="w-5 h-5 text-amber-600" />
                    <span>{searchResults.drop}</span>
                  </h2>
                </div>
                <button
                  onClick={() => setSearchResults(null)}
                  className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Trip Stats Pill */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>Date: <strong className="text-slate-900">{searchResults.startDate}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-600" />
                  <span>Est. Distance: <strong className="text-slate-900">~{searchResults.distance} KM</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Est. Time: <strong className="text-slate-900">~{searchResults.estTime}</strong></span>
                </div>
              </div>

              {/* Live Fleet Results Grid */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-slate-900">Available Vehicles for Your Trip</h3>
                
                {[
                  {
                    name: 'Swift Dzire / Etios',
                    type: 'Sedan (4+1 AC)',
                    rate: 13,
                    capacity: '4 Passengers',
                    image: '/images/fleet-sedan.jpg',
                    minKm: 250
                  },
                  {
                    name: 'Maruti Ertiga / XL6',
                    type: 'SUV (6+1 AC)',
                    rate: 16,
                    capacity: '6 Passengers',
                    image: '/images/fleet-ertiga.jpg',
                    minKm: 250
                  },
                  {
                    name: 'Toyota Innova Crysta',
                    type: 'Premium SUV (7 Seater)',
                    rate: 20,
                    capacity: '7 Passengers',
                    image: '/images/fleet-innova.jpg',
                    minKm: 250
                  },
                  {
                    name: 'Tempo Traveller',
                    type: 'Mini Bus (13/17 Seater)',
                    rate: 28,
                    capacity: '13-17 Passengers',
                    image: '/images/fleet-traveller.jpg',
                    minKm: 250
                  },
                  {
                    name: 'Luxury Bus / Coach',
                    type: 'Luxury Bus (32/45 Seater)',
                    rate: 45,
                    capacity: '32-50 Passengers',
                    image: '/images/fleet-luxury.jpg',
                    minKm: 300
                  }
                ].map((v) => {
                  const calculatedKm = Math.max(searchResults.distance, v.minKm);
                  const totalEstFare = calculatedKm * v.rate;

                  return (
                    <div 
                      key={v.name}
                      className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-amber-400 transition shadow-sm"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img 
                          src={getImageUrl(v.image)} 
                          onError={handleImageError} 
                          alt={v.name} 
                          className="w-20 h-16 object-cover rounded-xl shrink-0 bg-slate-100" 
                        />
                        <div>
                          <h4 className="font-serif text-base font-bold text-slate-900">{v.name}</h4>
                          <p className="text-xs text-slate-500">{v.type} • {v.capacity}</p>
                          <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            ₹{v.rate}/km Rate
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Estimated Fare</span>
                          <span className="font-serif text-2xl font-extrabold text-amber-600">₹{totalEstFare.toLocaleString('en-IN')}</span>
                        </div>

                        <Link
                          to={`/booking?type=${searchResults.bookingTab}&pickup=${encodeURIComponent(searchResults.pickup)}&drop=${encodeURIComponent(searchResults.drop)}&date=${searchResults.startDate}&car=${encodeURIComponent(v.name)}`}
                          onClick={() => setSearchResults(null)}
                          className="gold-btn px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Instant WhatsApp Help */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-600">
                <span>Need custom package or group booking?</span>
                <a
                  href={`https://wa.me/919272174699?text=Hi,%20I%20want%20a%20quote%20for%20a%20cab%20from%20${encodeURIComponent(searchResults.pickup)}%20to%20${encodeURIComponent(searchResults.drop)}%20on%20${searchResults.startDate}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-amber-600" /> WhatsApp Quick Quote
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. FEATURED TOUR PACKAGES (WITH FULL POSTERS & NO PRICES) */}
      <section className="py-16 sm:py-24 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">Unforgettable Journeys</span>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900">
                Exclusive <span className="text-amber-600">Tour Packages</span>
              </h2>
            </div>
            <Link to="/packages" className="text-xs sm:text-sm font-bold text-slate-900 border border-slate-300 hover:border-amber-500 px-5 py-2.5 rounded-full hover:bg-amber-500 transition shadow-sm">
              View All Special Packages &rarr;
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 flex flex-col justify-between hover:border-amber-400 transition-all duration-300 shadow-md hover:shadow-2xl"
              >
                <div>
                  <div className="relative w-full bg-slate-900 p-2 overflow-hidden flex items-center justify-center">
                    <img 
                      src={getImageUrl(pkg.image)} 
                      onError={handleImageError} 
                      alt={pkg.title} 
                      className="w-full h-auto object-contain max-h-[480px] rounded-2xl" 
                    />
                    {pkg.badge && (
                      <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                        {pkg.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-slate-900 mb-2 leading-snug">{pkg.title}</h3>
                    <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">{pkg.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2">
                  <Link
                    to={`/booking?package=${encodeURIComponent(pkg.title)}`}
                    className="gold-btn w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                  >
                    Contact For Package Quote <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. POPULAR MAHARASHTRA OUTSTATION ROUTES CARDS (NO RATES) */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">Maharashtra Outstation Directory</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900 mb-3">
              Popular <span className="text-amber-600">Outstation Cab Routes</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Sanitized AC cabs for one-way drops & round-trip journeys across 25+ top famous destinations in Maharashtra.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {routes.slice(0, 12).map((route) => (
              <motion.div
                key={route.id || route.to_city}
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
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60">
                    Sanitized AC Cab
                  </span>
                  <Link
                    to={`/booking?pickup=${encodeURIComponent(route.from_city)}&drop=${encodeURIComponent(route.to_city)}`}
                    className="gold-btn px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md"
                  >
                    Book Cab
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Explore All Routes CTA */}
          <div className="text-center mt-12">
            <Link 
              to="/routes" 
              className="inline-flex items-center gap-2 bg-slate-900 text-amber-400 hover:bg-amber-500 hover:text-slate-950 px-8 py-3.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider transition shadow-lg"
            >
              <span>Explore All 25+ Maharashtra Routes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. MANSI-STYLE INTERACTIVE FLEET SHOWCASE WITH FILTER TABS */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
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
                    : 'bg-slate-100 text-slate-700 border border-slate-300 hover:border-amber-400 hover:text-slate-900'
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

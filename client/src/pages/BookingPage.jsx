import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Car, User, Phone, Mail, FileText, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { trackBookingSubmit } from '../config/googleAds';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    service_type: 'Outstation',
    pickup_location: searchParams.get('pickup') || 'Mumbai',
    drop_location: searchParams.get('drop') || searchParams.get('package') || 'Shirdi',
    pickup_date: searchParams.get('date') || new Date().toISOString().split('T')[0],
    pickup_time: '06:00 AM',
    vehicle_name: searchParams.get('car') || 'Toyota Innova Crysta',
    notes: ''
  });

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    axios.get('/api/cars').then(res => setCars(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateEstimate = () => {
    const selectedCar = cars.find(c => c.name === formData.vehicle_name);
    if (selectedCar) return selectedCar.base_price;
    return 3500;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const estimatedAmount = calculateEstimate();
      const payload = {
        ...formData,
        user_id: user?.id || null,
        total_amount: estimatedAmount
      };

      const response = await axios.post('/api/bookings', payload);
      const booking = response.data.booking;
      
      setSuccessBooking(booking);
      trackBookingSubmit(estimatedAmount);

    } catch (err) {
      console.error('Booking error:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to submit booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-dark-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10"
        >
          <span className="text-xs font-bold text-gold uppercase tracking-widest block mb-1">Instant Reservation</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Book Your <span className="text-gold">Journey</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Fill out the details below for guaranteed vehicle allocation and instant booking reference code.
          </p>
        </motion.div>

        {/* Success Modal View */}
        <AnimatePresence>
          {successBooking ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-6 sm:p-12 rounded-3xl border border-gold/40 text-center space-y-6 shadow-2xl shadow-gold/10"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto border border-gold/50 shadow-lg">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">Booking Confirmed!</h2>
              <p className="text-xs sm:text-sm text-gray-300">
                Thank you, <strong className="text-gold">{successBooking.customer_name}</strong>. Your trip reservation has been recorded.
              </p>

              <div className="bg-dark-card p-5 sm:p-6 rounded-2xl border border-gray-800 text-left space-y-3 max-w-md mx-auto text-xs sm:text-sm shadow-inner">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Booking Reference:</span>
                  <span className="font-mono font-bold text-gold">{successBooking.booking_code}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Route:</span>
                  <span className="text-white font-medium">{successBooking.pickup_location} &rarr; {successBooking.drop_location}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Travel Date:</span>
                  <span className="text-white font-medium">{successBooking.pickup_date} at {successBooking.pickup_time}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Vehicle Assigned:</span>
                  <span className="text-white font-medium">{successBooking.vehicle_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Est. Total Fare:</span>
                  <span className="text-gold font-bold">₹{successBooking.total_amount?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                Our dispatch team will contact you on <strong className="text-white">{successBooking.phone}</strong> shortly.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href={`https://wa.me/919272174699?text=Hi,%20I%20just%20booked%20ref%20${successBooking.booking_code}`}
                  target="_blank"
                  rel="noreferrer"
                  className="gold-btn px-6 py-3 rounded-xl text-xs font-bold uppercase shadow-lg"
                >
                  Send Reference via WhatsApp
                </a>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 rounded-xl text-xs font-bold uppercase bg-dark-card border border-gray-700 text-gray-300 hover:text-white"
                >
                  Return to Home
                </button>
              </div>
            </motion.div>
          ) : (
            /* Booking Form */
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="glass-card p-5 sm:p-10 rounded-3xl border border-gold/30 space-y-6 shadow-2xl"
            >
              {errorMsg && (
                <div className="bg-red-950/80 border border-red-500/50 text-red-200 text-xs sm:text-sm p-4 rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* Service & Route Info */}
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-gold mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gold" /> 1. Trip & Location Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Pickup Location</label>
                    <input
                      type="text"
                      name="pickup_location"
                      value={formData.pickup_location}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Bandra West, Mumbai"
                      className="w-full bg-dark-card border border-gray-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Destination / Drop Location</label>
                    <input
                      type="text"
                      name="drop_location"
                      value={formData.drop_location}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Shirdi Sai Baba Temple"
                      className="w-full bg-dark-card border border-gray-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Vehicle Choice */}
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-gold mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
                  <Car className="w-4 h-4 sm:w-5 sm:h-5 text-gold" /> 2. Schedule & Vehicle Selection
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Pickup Date</label>
                    <input
                      type="date"
                      name="pickup_date"
                      value={formData.pickup_date}
                      onChange={handleChange}
                      required
                      className="w-full bg-dark-card border border-gray-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Pickup Time</label>
                    <select
                      name="pickup_time"
                      value={formData.pickup_time}
                      onChange={handleChange}
                      className="w-full bg-dark-card border border-gray-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                    >
                      <option>05:00 AM</option>
                      <option>06:00 AM</option>
                      <option>07:00 AM</option>
                      <option>08:00 AM</option>
                      <option>09:00 AM</option>
                      <option>10:00 AM</option>
                      <option>02:00 PM</option>
                      <option>06:00 PM</option>
                      <option>10:00 PM (Night)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Select Vehicle</label>
                    <select
                      name="vehicle_name"
                      value={formData.vehicle_name}
                      onChange={handleChange}
                      className="w-full bg-dark-card border border-gray-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                    >
                      {cars.map(c => (
                        <option key={c.id} value={c.name}>{c.name} ({c.capacity})</option>
                      ))}
                      {cars.length === 0 && (
                        <>
                          <option value="Swift Dzire / Etios">Swift Dzire / Etios (₹13/km)</option>
                          <option value="Maruti Ertiga / XL6">Maruti Ertiga / XL6 (₹16/km)</option>
                          <option value="Toyota Innova Crysta">Toyota Innova Crysta (₹20/km)</option>
                          <option value="Tempo Traveller">Tempo Traveller (₹28/km)</option>
                          <option value="Luxury Bus / Coach">Luxury Bus / Coach (Starts ₹45/km)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-gold mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gold" /> 3. Customer Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      required
                      placeholder="Your Name"
                      className="w-full bg-dark-card border border-gray-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number (WhatsApp)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 9876543210"
                      className="w-full bg-dark-card border border-gray-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full bg-dark-card border border-gray-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Special Notes / Requests</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g. Need child seat, extra luggage space, or specific pickup spot..."
                    className="w-full bg-dark-card border border-gray-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Total Fare & Submit Button */}
              <div className="pt-6 border-t border-gray-800 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-[10px] sm:text-xs text-gray-400 block uppercase">Estimated Fare</span>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-gold">₹{calculateEstimate().toLocaleString('en-IN')}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="gold-btn px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xl flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Confirm & Reserve Cab'} <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

            </motion.form>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

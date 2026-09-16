import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Calendar, Clock, MapPin, Car, LogOut, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    axios.get('/api/bookings')
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user bookings:', err);
        setLoading(false);
      });
  }, [user, navigate]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this pending booking?')) return;
    try {
      await axios.put(`/api/bookings/${id}`, { status: 'Cancelled' });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs px-3 py-1 rounded-full font-extrabold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Confirmed</span>;
      case 'Completed':
        return <span className="bg-blue-50 text-blue-700 border border-blue-300 text-xs px-3 py-1 rounded-full font-extrabold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Completed</span>;
      case 'Cancelled':
        return <span className="bg-red-50 text-red-700 border border-red-300 text-xs px-3 py-1 rounded-full font-extrabold flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-red-600" /> Cancelled</span>;
      default:
        return <span className="bg-amber-50 text-amber-800 border border-amber-300 text-xs px-3 py-1 rounded-full font-extrabold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Pending Confirmation</span>;
    }
  };

  if (!user) return null;

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-serif text-2xl font-extrabold flex items-center justify-center shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-xs text-slate-500 font-medium">{user.email} &bull; {user.phone || 'No phone provided'}</p>
              <span className="inline-block mt-2 text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                {user.role === 'admin' ? 'Super Administrator' : 'VIP Member'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/booking" className="gold-btn px-5 py-2.5 rounded-xl text-xs font-bold uppercase shadow">
              + New Booking
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900 border-l-4 border-amber-500 pl-3">
            Your Travel Bookings ({bookings.length})
          </h2>

          {loading ? (
            <div className="text-center py-12 text-amber-600 font-serif text-lg">Loading your trips...</div>
          ) : bookings.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-md">
              <Car className="w-12 h-12 text-amber-600 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-slate-900">No active bookings found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Ready for your next journey? Explore our outstation routes or tour packages now.
              </p>
              <Link to="/booking" className="gold-btn inline-block px-6 py-2.5 rounded-xl text-xs font-bold uppercase shadow">
                Reserve Your First Trip
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((b) => (
                <motion.div
                  key={b.id}
                  whileHover={{ y: -2 }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-amber-400 transition"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                        {b.booking_code}
                      </span>
                      {getStatusBadge(b.status)}
                    </div>

                    <h3 className="font-serif text-lg font-bold text-slate-900">
                      {b.pickup_location} &rarr; {b.drop_location}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" /> {b.pickup_date} ({b.pickup_time || 'Morning'})
                      </span>
                      <span className="flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-amber-600" /> {b.vehicle_name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Est. Amount</span>
                      <span className="font-serif text-xl font-extrabold text-amber-600">
                        ₹{b.total_amount ? b.total_amount.toLocaleString('en-IN') : 'N/A'}
                      </span>
                    </div>

                    {b.status === 'Pending' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="text-xs text-red-600 hover:text-white font-bold bg-red-50 hover:bg-red-600 border border-red-200 px-3.5 py-1.5 rounded-xl transition"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Clock, ArrowRight, Compass } from 'lucide-react';
import axios from 'axios';
import { maharashtraRoutes } from '../data/maharashtraRoutes';

export default function RoutesPage() {
  const [routes, setRoutes] = useState(maharashtraRoutes);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/routes')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setRoutes(res.data);
        }
      })
      .catch(err => {
        console.error('Error fetching routes:', err);
      });
  }, []);

  const filteredRoutes = routes.filter(r => 
    r.to_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.from_city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Maharashtra Outstation Directory</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 mt-2 mb-4">
            Famous <span className="text-amber-600">Maharashtra Routes</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Safe, reliable, and comfortable outstation cab trips to top 25+ famous destinations across Maharashtra.
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto mb-12 relative"
        >
          <Search className="w-5 h-5 text-amber-600 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search destination city (e.g. Shirdi, Mahabaleshwar, Pune, Lonavala...)"
            className="w-full bg-white border border-slate-300 rounded-full pl-12 pr-6 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500 shadow-md font-medium"
          />
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-amber-600 text-lg font-serif">Loading travel routes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route, idx) => (
              <motion.div
                key={route.id || route.to_city}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      Outstation Cab
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
                    className="gold-btn px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase shadow-md"
                  >
                    Book Cab
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

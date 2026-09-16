import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Clock, ArrowRight, Compass } from 'lucide-react';
import axios from 'axios';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/routes')
      .then(res => {
        setRoutes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching routes:', err);
        setLoading(false);
      });
  }, []);

  const filteredRoutes = routes.filter(r => 
    r.to_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.from_city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-28 pb-20 bg-dark-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Outstation Cab Directory</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Popular <span className="text-gold">Routes from Mumbai</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Safe, reliable, and affordable outstation cab trips with transparent flat pricing.
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto mb-12 relative"
        >
          <Search className="w-5 h-5 text-gold absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search destination city (e.g. Shirdi, Goa, Pune, Lonavala...)"
            className="w-full bg-dark-card border border-gold/30 rounded-full pl-12 pr-6 py-3.5 text-sm text-white focus:outline-none focus:border-gold shadow-lg"
          />
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-gold text-lg font-serif">Loading travel routes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route, idx) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 rounded-2xl border border-gold/20 flex flex-col justify-between hover:border-gold/50 transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
                      Outstation Cab
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {route.est_time}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span>{route.from_city}</span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                    <span>{route.to_city}</span>
                  </h3>

                  <p className="text-xs text-gray-400 mb-6">
                    Approx Distance: <strong className="text-gray-200">{route.distance_km} km</strong>
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Starting Fare</span>
                    <span className="font-serif text-xl font-bold text-gold">₹{route.start_price.toLocaleString('en-IN')}</span>
                  </div>
                  <Link
                    to={`/booking?pickup=${encodeURIComponent(route.from_city)}&drop=${encodeURIComponent(route.to_city)}`}
                    className="gold-btn px-4 py-2 rounded-lg text-xs font-bold uppercase"
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Clock, ArrowRight, Compass } from 'lucide-react';
import axios from 'axios';
import { maharashtraRoutes } from '../data/maharashtraRoutes';

export default function RoutesPage() {
  const [routes, setRoutes] = useState(maharashtraRoutes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/routes')
      .then(res => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const map = new Map();
          maharashtraRoutes.forEach(r => map.set(`${r.from_city.toLowerCase()}-${r.to_city.toLowerCase()}`, r));
          res.data.forEach(r => {
            const key = `${r.from_city.toLowerCase()}-${r.to_city.toLowerCase()}`;
            const existing = map.get(key);
            if (existing) {
              map.set(key, { ...existing, ...r });
            } else {
              const generatedSlug = `${r.from_city.toLowerCase().replace(/\s+/g, '-')}-to-${r.to_city.toLowerCase().replace(/\s+/g, '-')}-cab`;
              map.set(key, { ...r, slug: generatedSlug });
            }
          });
          setRoutes(Array.from(map.values()));
        }
      })
      .catch(err => {
        console.error('Error fetching routes:', err);
      });
  }, []);

  const categories = ['All', 'Spiritual', 'Hill Station', 'Coastal Tour', 'Intercity'];

  const filteredRoutes = routes.filter(r => {
    const matchesSearch = 
      r.to_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.from_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.title && r.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      (r.category && r.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Maharashtra Outstation Cab Directory</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 mt-2 mb-4">
            Famous <span className="text-amber-600">Maharashtra Routes</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Safe, reliable, and comfortable outstation cab trips to top 30+ destinations across Maharashtra, Gujarat & Goa. Click any route for complete travel guide, sightseeing and fare details.
          </p>
        </motion.div>

        {/* Search & Category Filter Controls */}
        <div className="max-w-3xl mx-auto mb-12 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-amber-600 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search destination (e.g. Shirdi, Pune, Grishneshwar, Mahabaleshwar, Goa, Saputara...)"
              className="w-full bg-white border border-slate-300 rounded-full pl-12 pr-6 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500 shadow-md font-medium"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-amber-400 shadow-md scale-105'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-amber-400 hover:text-slate-950'
                }`}
              >
                {cat === 'All' ? 'All 30+ Routes' : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-amber-600 text-lg font-serif">Loading travel routes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route, idx) => {
              const routeSlug = route.slug || `${route.from_city.toLowerCase().replace(/\s+/g, '-')}-to-${route.to_city.toLowerCase().replace(/\s+/g, '-')}-cab`;

              return (
                <motion.div
                  key={route.id || route.to_city}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.03 }}
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-between hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-extrabold uppercase text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        {route.category || 'Outstation Cab'}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> {route.est_time}
                      </span>
                    </div>

                    <Link to={`/routes/${routeSlug}`} className="block group-hover:text-amber-600 transition">
                      <h3 className="font-serif text-xl font-bold text-slate-900 mb-2 flex items-center gap-2 flex-wrap">
                        <span>{route.from_city}</span>
                        <ArrowRight className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{route.to_city}</span>
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 mb-3 font-medium">
                      Approx Distance: <strong className="text-slate-800 font-bold">~{route.distance_km} km</strong>
                    </p>

                    {route.overview && (
                      <p className="text-xs text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                        {route.overview}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/routes/${routeSlug}`}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 underline decoration-amber-300 underline-offset-4"
                    >
                      Route Guide &rarr;
                    </Link>

                    <Link
                      to={`/booking?pickup=${encodeURIComponent(route.from_city)}&drop=${encodeURIComponent(route.to_city)}`}
                      className="gold-btn px-4 py-2 rounded-xl text-xs font-extrabold uppercase shadow-sm"
                    >
                      Book Cab
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

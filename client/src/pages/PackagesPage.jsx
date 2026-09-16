import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Star, Sparkles, Filter } from 'lucide-react';
import axios from 'axios';
import { getImageUrl, handleImageError } from '../utils/imageUrl';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/packages')
      .then(res => {
        setPackages(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching packages:', err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Spiritual', 'Beach', 'Hill Station', 'Family'];

  const filteredPackages = activeCategory === 'All'
    ? packages
    : packages.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()));

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
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Handcrafted Experiences</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Exclusive <span className="text-gold">Tour Packages</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Explore carefully curated travel packages designed for supreme luxury, comfort, and memorable family adventures.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? 'gold-btn shadow-lg scale-105'
                  : 'bg-dark-card text-gray-400 border border-gray-800 hover:border-gold/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 text-gold text-lg font-serif">Loading luxury packages...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPackages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl overflow-hidden border border-gold/20 flex flex-col justify-between hover:border-gold/50 transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={getImageUrl(pkg.image)} 
                      onError={handleImageError} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover bg-dark-card" 
                    />
                    {pkg.badge && (
                      <span className="absolute top-4 left-4 bg-gold text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                        {pkg.badge}
                      </span>
                    )}
                    <span className="absolute bottom-4 right-4 bg-black/80 text-gold text-xs font-semibold px-3 py-1 rounded-lg border border-gold/30 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {pkg.duration}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-white mb-2">{pkg.title}</h3>
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">{pkg.description}</p>
                    
                    {/* Highlights */}
                    <div className="space-y-2 mb-6">
                      <p className="text-xs font-semibold text-gold uppercase tracking-wider">Highlights:</p>
                      {pkg.highlights && Array.isArray(pkg.highlights) && pkg.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-800/50 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-xs text-gray-400">Fixed Package Fare</span>
                    <p className="font-serif text-2xl font-bold text-gold">₹{pkg.price.toLocaleString('en-IN')}</p>
                  </div>
                  <Link
                    to={`/booking?package=${encodeURIComponent(pkg.title)}`}
                    className="gold-btn px-5 py-2.5 rounded-lg text-xs font-bold uppercase shadow-md"
                  >
                    Book Package
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

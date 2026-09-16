import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, PhoneCall, Maximize2, X, Send } from 'lucide-react';
import axios from 'axios';
import { getImageUrl, handleImageError } from '../utils/imageUrl';
import { trackPhoneCall } from '../config/googleAds';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

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

  const categories = ['All', 'Spiritual', 'Beach', 'Hill Station', 'Airport Transfer'];

  const filteredPackages = activeCategory === 'All'
    ? packages
    : packages.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()));

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
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Handcrafted Experiences</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 mt-2 mb-4">
            Exclusive <span className="text-amber-600">Tour Packages</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Explore carefully curated travel packages designed for supreme luxury, comfort, and memorable family adventures. Contact us for custom quotes!
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
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold tracking-wider uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-slate-900 text-amber-400 shadow-md scale-105'
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-amber-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 text-amber-600 text-lg font-serif">Loading tour packages...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {filteredPackages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 flex flex-col justify-between hover:border-amber-400 transition-all duration-300 shadow-md hover:shadow-2xl"
              >
                <div>
                  {/* FULL POSTER PICTURE CONTAINER */}
                  <div 
                    onClick={() => setPreviewImage(getImageUrl(pkg.image))}
                    className="relative w-full bg-slate-900 p-2 overflow-hidden cursor-pointer group flex items-center justify-center"
                  >
                    <img 
                      src={getImageUrl(pkg.image)} 
                      onError={handleImageError} 
                      alt={pkg.title} 
                      className="w-full h-auto object-contain max-h-[520px] rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]" 
                    />
                    
                    {pkg.badge && (
                      <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                        {pkg.badge}
                      </span>
                    )}

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(getImageUrl(pkg.image));
                      }}
                      className="absolute bottom-4 right-4 bg-slate-900/90 text-amber-400 hover:text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1 border border-amber-500/40 shadow-lg backdrop-blur-md"
                    >
                      <Maximize2 className="w-3.5 h-3.5" /> Full View
                    </button>
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-slate-900 mb-2 leading-snug">{pkg.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">{pkg.description}</p>
                    
                    {/* Highlights */}
                    <div className="space-y-2 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <p className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider mb-2">Package Highlights:</p>
                      {pkg.highlights && Array.isArray(pkg.highlights) && pkg.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* NO PRICE - ACTION BUTTONS ONLY */}
                <div className="p-6 pt-0 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="tel:+919272174699"
                      onClick={trackPhoneCall}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-amber-600" /> Call Quote
                    </a>

                    <Link
                      to={`/booking?package=${encodeURIComponent(pkg.title)}`}
                      className="gold-btn py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" /> Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* FULL SCREEN IMAGE PREVIEW MODAL */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 sm:-top-10 sm:-right-10 text-white bg-slate-900/80 p-2.5 rounded-full hover:bg-amber-500 hover:text-black transition shadow-xl"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={previewImage}
                alt="Full Package Poster"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-amber-500/30"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

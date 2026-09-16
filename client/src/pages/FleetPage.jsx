import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Shield, Check, Car } from 'lucide-react';
import axios from 'axios';
import { getImageUrl, handleImageError } from '../utils/imageUrl';

export default function FleetPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/cars')
      .then(res => {
        setCars(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching cars:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Pinnacle of Comfort</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-slate-900 mt-2 mb-4">
            Our <span className="text-amber-600">Luxury Fleet</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Every vehicle in our fleet undergoes strict quality checks, sanitized deep cleaning, and is equipped with modern amenities for your safety and luxury.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-amber-600 text-lg font-serif">Loading luxury fleet...</div>
        ) : (
          <div className="space-y-8">
            {cars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 items-center shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="lg:col-span-5 h-64 sm:h-72 rounded-2xl overflow-hidden relative">
                  <img 
                    src={getImageUrl(car.image)} 
                    onError={handleImageError} 
                    alt={car.name} 
                    className="w-full h-full object-cover bg-slate-100" 
                  />
                  <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {car.type}
                  </span>
                </div>

                {/* Content */}
                <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">{car.name}</h2>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        <Users className="w-3.5 h-3.5" /> {car.capacity}
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                      Premium air-conditioned commercial vehicle driven by background-verified highway chauffeurs.
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                      {car.specs && Array.isArray(car.specs) && car.specs.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-medium">Outstation Rate</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-3xl font-extrabold text-amber-600">₹{car.price_per_km}</span>
                        <span className="text-xs text-slate-500">/ km (Min 250km/day)</span>
                      </div>
                    </div>

                    <Link
                      to={`/booking?car=${encodeURIComponent(car.name)}`}
                      className="gold-btn px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                    >
                      Book This Vehicle
                    </Link>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

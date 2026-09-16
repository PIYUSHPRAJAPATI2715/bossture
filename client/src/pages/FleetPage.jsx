import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Shield, Check, Car } from 'lucide-react';
import axios from 'axios';

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
    <div className="pt-28 pb-20 bg-dark-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Pinnacle of Comfort</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Our <span className="text-gold">Luxury Fleet</span>
          </h1>
          <p className="text-gray-400 text-base">
            Every vehicle in our fleet undergoes strict quality checks, sanitized deep cleaning, and is equipped with modern amenities for your safety and luxury.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gold text-lg">Loading fleet...</div>
        ) : (
          <div className="space-y-8">
            {cars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-3xl overflow-hidden border border-gold/20 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 items-center"
              >
                {/* Image */}
                <div className="lg:col-span-5 h-64 sm:h-72 rounded-2xl overflow-hidden relative">
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 bg-gold text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {car.type}
                  </span>
                </div>

                {/* Content */}
                <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">{car.name}</h2>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
                        <Users className="w-3.5 h-3.5" /> {car.capacity}
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-6">
                      Premium air-conditioned commercial vehicle driven by background-verified chauffeurs.
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                      {car.specs.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-300 bg-dark-card p-2.5 rounded-lg border border-gray-800">
                          <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-6 border-t border-gray-800 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <span className="text-xs text-gray-400">Outstation Rate</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-3xl font-bold text-gold">₹{car.price_per_km}</span>
                        <span className="text-xs text-gray-400">/ km (Min 250km/day)</span>
                      </div>
                    </div>

                    <Link
                      to={`/booking?car=${encodeURIComponent(car.name)}`}
                      className="gold-btn px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg"
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

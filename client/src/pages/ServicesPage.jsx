import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Shield, Plane, Building2, Heart, Award, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: MapPin,
      title: 'Outstation Cabs & Taxi Services',
      description: 'Reliable, comfortable one-way and round-trip outstation taxi services from Mumbai to major cities across Maharashtra, Goa, and Gujarat.',
      features: ['Doorstep pickup & drop', 'Experienced highway drivers', 'Fully sanitized vehicles', 'Clean AC cars']
    },
    {
      icon: Award,
      title: 'Pilgrimage & Spiritual Tours',
      description: 'Specialized spiritual travel to sacred destinations such as Shirdi Sai Temple, Shani Shingnapur, Trimbakeshwar Jyotirlinga, and Ashtavinayak.',
      features: ['Custom darshan assistance', 'Peaceful travel experience', 'Family seating capacity', 'Punctual driver service']
    },
    {
      icon: Heart,
      title: 'Beach & Hill Station Holiday Packages',
      description: 'Complete tour itineraries for Goa beach vacations, Lonavala hill station weekends, and Mahabaleshwar strawberry valleys.',
      features: ['Hotel pickup & return', 'Flexible sightseeing hours', 'Family & group packages', '24/7 travel concierge']
    },
    {
      icon: Plane,
      title: 'Mumbai Airport Pick & Drop (T1 & T2)',
      description: 'Punctual airport transfer services to and from Chhatrapati Shivaji Maharaj International Airport (BOM) with flight tracking.',
      features: ['Zero waiting delays', 'Flight status monitoring', 'Luggage assist chauffeur', 'Fixed transparent rate']
    },
    {
      icon: Building2,
      title: 'Corporate Car Rentals & Fleet Management',
      description: 'Monthly and daily executive car rental solutions for corporate organizations, delegation visits, and business conferences.',
      features: ['Uniformed executive drivers', 'Monthly corporate billing', 'Premium Sedan & SUV fleet', 'Dedicated account manager']
    },
    {
      icon: Shield,
      title: 'Wedding & Luxury Event Cars',
      description: 'Make your special day memorable with our decorated luxury cars, VIP sedans, and high-capacity Tempo Travellers for wedding guests.',
      features: ['Decorated bride/groom cars', 'Tempo Travellers for baraat', 'VIP guest reception', 'Flawless execution']
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">World Class Travel</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 mt-2 mb-4">
            Our Premium <span className="text-amber-600">Services</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From seamless outstation cab rides to bespoke spiritual yatras and luxury corporate travel, Boss Tours & Travels provides top-notch transport solutions.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 flex flex-col justify-between hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-slate-900 mb-3">{svc.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">{svc.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {svc.features.map((feat, fidx) => (
                      <li key={fidx} className="text-xs text-slate-700 flex items-center gap-2 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/booking"
                  className="gold-btn w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                >
                  Book Service <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

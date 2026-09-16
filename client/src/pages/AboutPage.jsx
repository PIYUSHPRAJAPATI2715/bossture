import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Users, Car, Heart, Star, PhoneCall } from 'lucide-react';
import { trackPhoneCall } from '../config/googleAds';

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 bg-dark-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Our Legacy</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            About <span className="text-gold">Boss Tours & Travels</span>
          </h1>
          <p className="text-gray-400 text-base">
            Turning miles into smiles since 2010. Mumbai's most trusted luxury travel & outstation car rental agency.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="font-serif text-3xl font-bold text-white mb-6">
              Delivering Royal Comfort & Uncompromising Safety
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Founded over a decade ago, Boss Tours & Travels was established with a singular mission: to provide discerning travelers with reliable, pristine, and luxurious outstation cab experiences across India.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Whether you are planning a sacred pilgrimage to Shirdi, a relaxing beach vacation in Goa, a scenic retreat to Lonavala, or require an executive chauffeur for high-level corporate delegations, Boss Tours delivers absolute excellence in every journey.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-gold" />
                <div>
                  <h4 className="text-white font-bold text-sm">GPS Monitored</h4>
                  <p className="text-xs text-gray-400">Live speed & route tracking</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-gold" />
                <div>
                  <h4 className="text-white font-bold text-sm">Top Rated</h4>
                  <p className="text-xs text-gray-400">4.9 Star Google rating</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="relative">
            <div className="glass-card rounded-3xl p-8 border border-gold/30 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto border border-gold/40">
                <Star className="w-8 h-8 fill-gold" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gold">15+ Years of Excellence</h3>
              <p className="text-sm text-gray-300">
                "We treat every passenger like royalty. Our drivers are trained in hospitality, road safety, and route mastery."
              </p>
              <a
                href="tel:+919272174699"
                onClick={trackPhoneCall}
                className="gold-btn inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase"
              >
                <PhoneCall className="w-4 h-4" /> Call Founder Hotline
              </a>
            </div>
          </motion.div>
        </div>

        {/* Counter Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-gold/20 text-center">
            <h3 className="font-serif text-4xl font-bold text-gold mb-1">50,000+</h3>
            <p className="text-xs text-gray-400 uppercase font-semibold">Happy Passengers</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-gold/20 text-center">
            <h3 className="font-serif text-4xl font-bold text-gold mb-1">50+</h3>
            <p className="text-xs text-gray-400 uppercase font-semibold">Luxury Fleet Vehicles</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-gold/20 text-center">
            <h3 className="font-serif text-4xl font-bold text-gold mb-1">100%</h3>
            <p className="text-xs text-gray-400 uppercase font-semibold">On-Time Guarantee</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-gold/20 text-center">
            <h3 className="font-serif text-4xl font-bold text-gold mb-1">24/7</h3>
            <p className="text-xs text-gray-400 uppercase font-semibold">Customer Dispatch</p>
          </div>
        </div>

      </div>
    </div>
  );
}

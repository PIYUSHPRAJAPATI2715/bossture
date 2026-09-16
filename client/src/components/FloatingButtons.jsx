import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { trackPhoneCall, trackWhatsAppClick } from '../config/googleAds';

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Floating Button */}
      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        href="https://wa.me/919272174699?text=Hello%20Boss%20Tours,%20I%20want%20to%20inquire%20about%20a%20booking"
        target="_blank"
        rel="noreferrer"
        onClick={trackWhatsAppClick}
        title="Chat on WhatsApp"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-400/40 relative group"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        <span className="hidden sm:inline-block absolute right-16 top-1/2 -translate-y-1/2 bg-emerald-950 text-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          Chat on WhatsApp
        </span>
      </motion.a>

      {/* Phone Call Floating Button */}
      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3, delay: 0.5, ease: 'easeInOut' }}
        href="tel:+919272174699"
        onClick={trackPhoneCall}
        title="Call Now"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-black flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.6)] border border-gold-light/50 relative group"
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6 fill-black" />
        <span className="hidden sm:inline-block absolute right-16 top-1/2 -translate-y-1/2 bg-black text-gold text-xs font-semibold px-3 py-1.5 rounded-xl border border-gold/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          Call +91 9272174699
        </span>
      </motion.a>
    </div>
  );
}

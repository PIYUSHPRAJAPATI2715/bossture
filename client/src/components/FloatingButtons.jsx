import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { trackPhoneCall, trackWhatsAppClick } from '../config/googleAds';

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919272174699?text=Hello%20Boss%20Tours,%20I%20want%20to%20inquire%20about%20a%20booking"
        target="_blank"
        rel="noreferrer"
        onClick={trackWhatsAppClick}
        title="Chat on WhatsApp"
        className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 relative group"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-emerald-950 text-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          Chat on WhatsApp
        </span>
      </a>

      {/* Phone Call Floating Button */}
      <a
        href="tel:+919272174699"
        onClick={trackPhoneCall}
        title="Call Now"
        className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 relative group"
      >
        <Phone className="w-6 h-6 fill-black" />
        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-black text-gold text-xs font-semibold px-3 py-1.5 rounded-lg border border-gold/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          Call +91 9272174699
        </span>
      </a>
    </div>
  );
}

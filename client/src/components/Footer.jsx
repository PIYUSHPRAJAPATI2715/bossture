import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Instagram, MessageCircle, ShieldCheck, Star } from 'lucide-react';
import { trackPhoneCall, trackWhatsAppClick } from '../config/googleAds';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-gold/20 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border-2 border-gold overflow-hidden bg-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
                <img src="/images/logo.png" alt="Boss Tours Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                BOSS <span className="text-gold">TOURS</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Turning miles into smiles since 2010. Premier luxury travel, outstation cabs, and custom tour packages across India.
            </p>
            <div className="flex items-center gap-1 text-gold text-sm font-semibold">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <Star className="w-4 h-4 fill-gold text-gold" />
              <Star className="w-4 h-4 fill-gold text-gold" />
              <Star className="w-4 h-4 fill-gold text-gold" />
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span className="text-gray-300 ml-2">4.9 / 5 Rating (1,250+ Reviews)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4 border-l-2 border-gold pl-3">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-gold transition">Home</Link></li>
              <li><Link to="/services" className="hover:text-gold transition">Our Services</Link></li>
              <li><Link to="/packages" className="hover:text-gold transition">Tour Packages</Link></li>
              <li><Link to="/fleet" className="hover:text-gold transition">Luxury Fleet</Link></li>
              <li><Link to="/routes" className="hover:text-gold transition">Popular Routes</Link></li>
              <li><Link to="/booking" className="hover:text-gold transition">Book Online</Link></li>
            </ul>
          </div>

          {/* Top Outstation Routes SEO */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4 border-l-2 border-gold pl-3">
              Popular Destinations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/booking?route=Mumbai-to-Shirdi" className="hover:text-gold transition">Mumbai to Shirdi Cab</Link></li>
              <li><Link to="/booking?route=Mumbai-to-Goa" className="hover:text-gold transition">Mumbai to Goa Tour</Link></li>
              <li><Link to="/booking?route=Mumbai-to-Lonavala" className="hover:text-gold transition">Mumbai to Lonavala Trip</Link></li>
              <li><Link to="/booking?route=Mumbai-to-Mahabaleshwar" className="hover:text-gold transition">Mumbai to Mahabaleshwar</Link></li>
              <li><Link to="/booking?route=Mumbai-to-Pune" className="hover:text-gold transition">Mumbai to Pune Taxi</Link></li>
              <li><Link to="/booking?route=Mumbai-to-Nashik" className="hover:text-gold transition">Mumbai to Trimbakeshwar</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4 border-l-2 border-gold pl-3">
              Connect With Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span>Main Highway Hub, Santacruz East, Mumbai, MH 400098</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <a href="tel:+919272174699" onClick={trackPhoneCall} className="hover:text-gold text-white font-medium">
                  +91 9272174699
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <a href="mailto:info@bosstoursandtravels.com" className="hover:text-gold">
                  info@bosstoursandtravels.com
                </a>
              </li>
            </ul>

            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://wa.me/919272174699"
                target="_blank"
                rel="noreferrer"
                onClick={trackWhatsAppClick}
                className="w-9 h-9 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/boss_tours_and_travels"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center hover:bg-pink-600 hover:text-white transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Boss Tours & Travels. All Rights Reserved. Fully Certified & Insured Commercial Fleet.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gold cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gold cursor-pointer">Terms of Service</span>
            <span className="hover:text-gold cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

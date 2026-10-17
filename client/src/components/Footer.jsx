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
              Popular Routes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/routes/mumbai-to-pune-cab" className="hover:text-gold transition">Mumbai to Pune Cab</Link></li>
              <li><Link to="/routes/mumbai-to-shirdi-shani-shingnapur-cab" className="hover:text-gold transition">Mumbai to Shirdi Shani Shingnapur</Link></li>
              <li><Link to="/routes/mumbai-darshan-cab" className="hover:text-gold transition">Mumbai Darshan Sightseeing Cab</Link></li>
              <li><Link to="/routes/mumbai-to-lonavala-cab" className="hover:text-gold transition">Mumbai to Lonavala Cab</Link></li>
              <li><Link to="/routes/mumbai-to-mahabaleshwar-cab" className="hover:text-gold transition">Mumbai to Mahabaleshwar Cab</Link></li>
              <li><Link to="/routes/mumbai-to-goa-cab" className="hover:text-gold transition">Mumbai to Goa Cab</Link></li>
              <li><Link to="/routes" className="text-gold font-medium hover:underline inline-flex items-center gap-1">View All 31+ Routes &rarr;</Link></li>
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
                <span>Shop No. 5, Diva Manpada Road, B.R. Nagar, Diva East, Thane, Maharashtra - 400612</span>
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

        {/* SEO Route Directory Mesh */}
        <div className="border-t border-gray-900/80 pt-8 pb-8 my-8 text-xs">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h5 className="font-serif text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold inline-block"></span>
              Popular Maharashtra Cab Services & Pilgrimage Routes
            </h5>
            <Link to="/routes" className="text-gold hover:underline font-medium">Browse All 31+ Maharashtra Routes &rarr;</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-400">
            <div>
              <p className="text-gray-300 font-semibold mb-2 uppercase tracking-wider text-[11px]">Jyotirlinga & Pilgrimage</p>
              <ul className="space-y-1.5">
                <li><Link to="/routes/mumbai-to-3-jyotirlinga-cab" className="hover:text-gold transition">Mumbai to 3 Jyotirlinga Cab</Link></li>
                <li><Link to="/routes/mumbai-to-bhimashankar-cab" className="hover:text-gold transition">Mumbai to Bhimashankar Cab</Link></li>
                <li><Link to="/routes/mumbai-to-trimbakeshwar-cab" className="hover:text-gold transition">Mumbai to Trimbakeshwar Cab</Link></li>
                <li><Link to="/routes/mumbai-to-grishneshwar-cab" className="hover:text-gold transition">Mumbai to Grishneshwar Cab</Link></li>
                <li><Link to="/routes/mumbai-to-pandharpur-cab" className="hover:text-gold transition">Mumbai to Pandharpur Cab</Link></li>
                <li><Link to="/routes/mumbai-to-akkalkot-cab" className="hover:text-gold transition">Mumbai to Akkalkot Cab</Link></li>
                <li><Link to="/routes/mumbai-to-gangapur-cab" className="hover:text-gold transition">Mumbai to Gangapur Cab</Link></li>
                <li><Link to="/routes/mumbai-to-vani-saptashrungi-cab" className="hover:text-gold transition">Mumbai to Vani Saptashrungi</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-gray-300 font-semibold mb-2 uppercase tracking-wider text-[11px]">Hill Stations & Weekend</p>
              <ul className="space-y-1.5">
                <li><Link to="/routes/mumbai-to-mahabaleshwar-cab" className="hover:text-gold transition">Mumbai to Mahabaleshwar Cab</Link></li>
                <li><Link to="/routes/mumbai-to-lonavala-cab" className="hover:text-gold transition">Mumbai to Lonavala Cab</Link></li>
                <li><Link to="/routes/mumbai-to-igatpuri-cab" className="hover:text-gold transition">Mumbai to Igatpuri Cab</Link></li>
                <li><Link to="/routes/mumbai-to-saputara-cab" className="hover:text-gold transition">Mumbai to Saputara Cab</Link></li>
                <li><Link to="/routes/mumbai-to-matheran-cab" className="hover:text-gold transition">Mumbai to Matheran Cab</Link></li>
                <li><Link to="/routes/mumbai-to-lavasa-cab" className="hover:text-gold transition">Mumbai to Lavasa Cab</Link></li>
                <li><Link to="/routes/mumbai-to-karla-caves-khandala-cab" className="hover:text-gold transition">Mumbai to Karla & Khandala</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-gray-300 font-semibold mb-2 uppercase tracking-wider text-[11px]">Coastal & Konkan Tours</p>
              <ul className="space-y-1.5">
                <li><Link to="/routes/mumbai-to-goa-cab" className="hover:text-gold transition">Mumbai to Goa Cab</Link></li>
                <li><Link to="/routes/mumbai-to-kokan-cab" className="hover:text-gold transition">Mumbai to Kokan Cab Tour</Link></li>
                <li><Link to="/routes/mumbai-to-alibag-cab" className="hover:text-gold transition">Mumbai to Alibag Cab</Link></li>
                <li><Link to="/routes/mumbai-to-ganpatipule-cab" className="hover:text-gold transition">Mumbai to Ganpatipule Cab</Link></li>
                <li><Link to="/routes/mumbai-to-ratnagiri-cab" className="hover:text-gold transition">Mumbai to Ratnagiri Cab</Link></li>
                <li><Link to="/routes/mumbai-to-malvan-tarkarli-cab" className="hover:text-gold transition">Mumbai to Malvan & Tarkarli</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-gray-300 font-semibold mb-2 uppercase tracking-wider text-[11px]">Intercity & Sightseeing</p>
              <ul className="space-y-1.5">
                <li><Link to="/routes/mumbai-to-pune-cab" className="hover:text-gold transition">Mumbai to Pune Cab</Link></li>
                <li><Link to="/routes/mumbai-darshan-cab" className="hover:text-gold transition">Mumbai Darshan Sightseeing</Link></li>
                <li><Link to="/routes/mumbai-to-nashik-cab" className="hover:text-gold transition">Mumbai to Nashik Cab</Link></li>
                <li><Link to="/routes/mumbai-to-aurangabad-cab" className="hover:text-gold transition">Mumbai to Aurangabad Cab</Link></li>
                <li><Link to="/routes/mumbai-to-solapur-cab" className="hover:text-gold transition">Mumbai to Solapur Cab</Link></li>
                <li><Link to="/routes/mumbai-to-anywhere-cab" className="hover:text-gold transition">Mumbai to Anywhere Cabs</Link></li>
                <li><Link to="/routes/pune-to-shirdi-cab" className="hover:text-gold transition">Pune to Shirdi Cab</Link></li>
                <li><Link to="/routes/pune-to-mahabaleshwar-cab" className="hover:text-gold transition">Pune to Mahabaleshwar Cab</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Boss Tours & Travels. All Rights Reserved. Fully Certified & Insured Commercial Fleet.</p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-gold cursor-pointer">Support</Link>
            <Link to="/services" className="hover:text-gold cursor-pointer">Services</Link>
            <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-gold cursor-pointer">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

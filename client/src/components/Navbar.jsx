import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Car, User, LogOut, Shield, PhoneCall, Sparkles } from 'lucide-react';
import { trackPhoneCall } from '../config/googleAds';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleCallClick = () => {
    trackPhoneCall();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Packages', path: '/packages' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'Routes', path: '/routes' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-md py-3' 
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-200/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-amber-500 shadow-md shadow-amber-500/20 overflow-hidden bg-slate-950 flex items-center justify-center shrink-0"
            >
              <img src="/images/logo.png" alt="Boss Tours & Travels Logo" className="w-full h-full object-cover" />
            </motion.div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-extrabold tracking-wider text-slate-900 flex items-center gap-1">
                BOSS <span className="text-amber-600">TOURS</span>
              </span>
              <p className="text-[9px] sm:text-[10px] text-slate-500 tracking-widest uppercase -mt-1 font-semibold">
                Luxury Outstation Cabs
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold tracking-wide transition-all relative py-1.5 ${
                  isActive(link.path)
                    ? 'text-amber-600 font-bold'
                    : 'text-slate-700 hover:text-amber-600'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-[0_0_8px_rgba(217,119,6,0.6)]"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Mansi-style Call Support Pill */}
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href="tel:+919272174699"
              onClick={handleCallClick}
              className="flex items-center gap-2.5 bg-amber-50 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-full border border-amber-300 hover:border-amber-500 transition-all duration-300 shadow-sm group"
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <PhoneCall className="w-4 h-4 text-amber-600 group-hover:text-slate-950 relative z-10" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider block font-bold text-amber-700 group-hover:text-slate-900 leading-none">24/7 Hotline</span>
                <span className="text-xs font-extrabold tracking-wide font-mono text-slate-900">+91 9272174699</span>
              </div>
            </motion.a>

            {user ? (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 text-xs bg-slate-900 text-amber-400 px-3.5 py-2 rounded-xl border border-slate-800 hover:bg-amber-500 hover:text-slate-950 font-bold transition"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm text-slate-800 hover:text-amber-600 transition font-bold"
                >
                  <User className="w-4 h-4 text-amber-600" />
                  {user.name.split(' ')[0]}
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="text-slate-400 hover:text-red-500 p-1.5 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-700 hover:text-amber-600 transition px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="gold-btn text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href="tel:+919272174699"
              onClick={handleCallClick}
              className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-300 text-xs font-bold flex items-center gap-1"
            >
              <PhoneCall className="w-4 h-4 text-amber-600" />
            </a>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="text-slate-900 p-2.5 rounded-xl bg-slate-100 border border-slate-300 shadow-sm"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Animated Mobile Nav Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Slide Down Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -20, scaleY: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-[70px] left-4 right-4 z-50 bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl lg:hidden overflow-hidden max-h-[85vh] overflow-y-auto space-y-4"
            >
              <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-3 px-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-between ${
                      isActive(link.path)
                        ? 'bg-amber-50 text-amber-700 border border-amber-300 shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive(link.path) && <Sparkles className="w-3.5 h-3.5 text-amber-600" />}
                  </Link>
                ))}
              </div>

              {/* Action Buttons in Mobile Drawer */}
              <div className="space-y-3 pt-1">
                <a
                  href="tel:+919272174699"
                  onClick={() => {
                    handleCallClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-extrabold text-slate-950 gold-btn shadow-md uppercase tracking-wider"
                >
                  <PhoneCall className="w-4 h-4" /> Call: +91 9272174699
                </a>

                {user ? (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shadow-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight">{user.name}</p>
                          <p className="text-[11px] text-slate-500">{user.email}</p>
                        </div>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-xs font-bold bg-slate-900 text-amber-400 px-3 py-1 rounded-lg shadow"
                        >
                          Admin
                        </Link>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-200">
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center py-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-300 rounded-xl"
                      >
                        My Profile & Bookings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-center py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-3 text-sm font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded-2xl"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-3 text-sm font-extrabold text-slate-950 gold-btn rounded-2xl shadow-md uppercase"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

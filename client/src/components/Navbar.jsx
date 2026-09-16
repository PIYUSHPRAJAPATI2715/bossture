import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Car, User, LogOut, Shield, Compass, PhoneCall } from 'lucide-react';
import { trackPhoneCall } from '../config/googleAds';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    <nav className="fixed top-0 left-0 w-full z-50 bg-dark-bg/90 backdrop-blur-md border-b border-gold/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark flex items-center justify-center text-black font-extrabold text-xl shadow-lg group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                BOSS <span className="text-gold">TOURS</span>
              </span>
              <p className="text-[10px] text-gray-400 tracking-widest uppercase -mt-1">
                Luxury Experience
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
                  isActive(link.path)
                    ? 'text-gold font-semibold'
                    : 'text-gray-300 hover:text-gold'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Action & User Controls */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+919272174699"
              onClick={handleCallClick}
              className="flex items-center gap-2 text-xs font-semibold uppercase text-gold bg-gold/10 px-4 py-2 rounded-full border border-gold/30 hover:bg-gold hover:text-black transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              +91 9272174699
            </a>

            {user ? (
              <div className="flex items-center gap-3 border-l border-gray-800 pl-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 text-xs bg-gold/20 text-gold px-3 py-1.5 rounded-md border border-gold/40 hover:bg-gold hover:text-black font-semibold transition"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm text-gray-200 hover:text-gold transition font-medium"
                >
                  <User className="w-4 h-4 text-gold" />
                  {user.name.split(' ')[0]}
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="text-gray-400 hover:text-red-400 p-1 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-gold transition px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="gold-btn text-xs uppercase px-4 py-2 rounded-full shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gold p-2 rounded-lg bg-dark-card border border-gold/20"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-dark-card border-b border-gold/20 px-4 pt-4 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-base font-medium ${
                isActive(link.path) ? 'text-gold font-bold' : 'text-gray-300'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
            <a
              href="tel:+919272174699"
              onClick={handleCallClick}
              className="flex items-center justify-center gap-2 text-sm font-bold text-gold bg-gold/10 py-2.5 rounded-lg border border-gold/30"
            >
              <PhoneCall className="w-4 h-4" /> Call: +91 9272174699
            </a>

            {user ? (
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium text-white">{user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs bg-gold/20 text-gold px-3 py-1 rounded"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-red-400 px-2 py-1"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm py-2 text-gray-300 border border-gray-700 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm py-2 gold-btn rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

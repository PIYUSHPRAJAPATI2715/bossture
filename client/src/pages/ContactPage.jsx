import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { trackPhoneCall, trackWhatsAppClick, trackContactSubmit } from '../config/googleAds';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await axios.post('/api/contact', formData);
      setSubmitted(true);
      trackContactSubmit();
    } catch (err) {
      console.error('Contact submit error:', err);
      setErrorMsg('Failed to send message. Please try calling us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-dark-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">We Are Here To Help</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Contact <span className="text-gold">Boss Tours</span>
          </h1>
          <p className="text-gray-400 text-base">
            Have questions about tour routes, custom pricing, or group bookings? Our 24/7 travel desk is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-8 rounded-3xl border border-gold/30 space-y-6">
              <h3 className="font-serif text-2xl font-bold text-white">Get in Touch</h3>
              <p className="text-sm text-gray-300">
                Call or message us directly for instant price quotes and booking confirmation.
              </p>

              <div className="space-y-4 pt-2">
                <a
                  href="tel:+919272174699"
                  onClick={trackPhoneCall}
                  className="flex items-center gap-4 bg-dark-card p-4 rounded-2xl border border-gray-800 hover:border-gold/40 transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/30 group-hover:bg-gold group-hover:text-black">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Phone Hotline</span>
                    <span className="text-white font-bold text-base group-hover:text-gold">+91 9272174699</span>
                  </div>
                </a>

                <a
                  href="https://wa.me/919272174699"
                  target="_blank"
                  rel="noreferrer"
                  onClick={trackWhatsAppClick}
                  className="flex items-center gap-4 bg-dark-card p-4 rounded-2xl border border-gray-800 hover:border-emerald-500/40 transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">WhatsApp Chat</span>
                    <span className="text-white font-bold text-base group-hover:text-emerald-400">+91 9272174699</span>
                  </div>
                </a>

                <div className="flex items-center gap-4 bg-dark-card p-4 rounded-2xl border border-gray-800">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Email Support</span>
                    <span className="text-white font-medium text-sm">info@bosstoursandtravels.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-dark-card p-4 rounded-2xl border border-gray-800">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Head Office</span>
                    <span className="text-white font-medium text-xs">Main Highway Hub, Santacruz East, Mumbai, MH 400098</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 rounded-3xl border border-gold/30">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-gold mx-auto" />
                  <h3 className="font-serif text-2xl font-bold text-white">Message Sent!</h3>
                  <p className="text-sm text-gray-300">
                    Thank you for reaching out. Our dispatch executive will contact you at <strong className="text-gold">{formData.phone}</strong> within 15 minutes.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold uppercase mt-4"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">Send an Inquiry</h3>

                  {errorMsg && (
                    <div className="bg-red-950/80 border border-red-500/50 text-red-200 text-xs p-3 rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full bg-dark-card border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 9876543210"
                        className="w-full bg-dark-card border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Email (Optional)</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-dark-card border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Service Interested In</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full bg-dark-card border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
                      >
                        <option>Outstation Taxi</option>
                        <option>Spiritual Tour Package</option>
                        <option>Goa Beach Package</option>
                        <option>Corporate Car Rental</option>
                        <option>Wedding Luxury Fleet</option>
                        <option>General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Message / Details</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Tell us about your travel plans, number of passengers, dates..."
                      className="w-full bg-dark-card border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="gold-btn w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending Message...' : 'Submit Inquiry'} <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

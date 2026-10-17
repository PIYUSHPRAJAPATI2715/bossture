import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, ShieldCheck, Award, Heart, MessageSquare, Car, 
  MapPin, CheckCircle2, PhoneCall, MessageCircle, ArrowRight, 
  Sparkles, Calendar, UserCheck, ChevronDown, ChevronUp, PlusCircle, X, Send
} from 'lucide-react';
import { successStories, storyStats, storyFaqs } from '../data/successStories';
import { trackPhoneCall, trackWhatsAppClick } from '../config/googleAds';

export default function SuccessStoriesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedStory, setExpandedStory] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State for User Story Submission
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    route: '',
    vehicle: 'Toyota Innova Crysta',
    rating: 5,
    chauffeur: '',
    story: ''
  });

  const categories = [
    'All',
    'Pilgrimage Yatras',
    'Family Vacations',
    'Corporate & Airport Transfers',
    'Wedding & Group Charters'
  ];

  // Set document title, meta tags, and Schema.org JSON-LD
  useEffect(() => {
    document.title = "Customer Success Stories & Reviews | Boss Tours & Travels Mumbai";
    
    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', "Read real customer success stories, family vacation experiences, pilgrimage yatras, and corporate travel testimonials with Boss Tours & Travels. 4.9/5 rated luxury outstation cabs.");
    }

    // Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', "Boss Tours reviews, customer success stories, outstation cab reviews Mumbai, luxury taxi testimonials, 3 jyotirlinga cab review, shirdi cab reviews");
    }

    // Inject Schema.org Review & AggregateRating JSON-LD
    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.id = 'success-stories-schema';
    jsonLdScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Boss Tours & Travels",
      "image": "https://bosstoursandtravels.com/images/logo.png",
      "url": "https://bosstoursandtravels.com/success-stories",
      "telephone": "+919272174699",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Shop No. 5, Diva Manpada Road, B.R. Nagar, Diva East",
        "addressLocality": "Thane",
        "addressRegion": "Maharashtra",
        "postalCode": "400612",
        "addressCountry": "IN"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": successStories.slice(0, 5).map(s => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": s.customerName
        },
        "datePublished": "2026-09-01",
        "reviewBody": s.story,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": String(s.rating),
          "bestRating": "5",
          "worstRating": "1"
        }
      }))
    });

    const oldScript = document.getElementById('success-stories-schema');
    if (oldScript) oldScript.remove();
    document.head.appendChild(jsonLdScript);

    window.scrollTo(0, 0);

    return () => {
      const s = document.getElementById('success-stories-schema');
      if (s) s.remove();
    };
  }, []);

  const filteredStories = activeCategory === 'All' 
    ? successStories 
    : successStories.filter(s => s.category === activeCategory);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setTimeout(() => {
      setIsSubmitModalOpen(false);
      setSubmitSuccess(false);
      setFormData({
        name: '',
        location: '',
        route: '',
        vehicle: 'Toyota Innova Crysta',
        rating: 5,
        chauffeur: '',
        story: ''
      });
    }, 2500);
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-amber-600 transition">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Success Stories & Reviews</span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            100% Verified Customer Journeys
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            Real Travelers. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700">
              Unforgettable Stories.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Over <strong className="text-slate-900 font-bold">50,000+ passengers</strong>, 
            <strong className="text-slate-900 font-bold"> 1,250+ five-star Google reviews</strong>, 
            and 15+ years of delivering royal comfort across Maharashtra and India. Read how we turn miles into smiles.
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8 flex-wrap">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="gold-btn inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase shadow-lg shadow-amber-500/20"
            >
              <PlusCircle className="w-4 h-4" /> Share Your Story
            </button>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase bg-white text-slate-800 border border-slate-300 hover:border-amber-500 hover:text-amber-600 shadow-sm transition"
            >
              <Car className="w-4 h-4 text-amber-600" /> Book Your Next Journey
            </Link>
          </div>
        </div>

        {/* Vital Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {storyStats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-sm hover:border-amber-400/60 transition group"
            >
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-600 mb-1 group-hover:scale-105 transition-transform">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {stat.subtitle}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Spotlight Story */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl aspect-[4/3]">
                <img 
                  src={successStories[0].image} 
                  alt={successStories[0].title} 
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-400 border border-amber-500/30">
                  Featured Story of the Month
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-amber-300 ml-2">5.0 / 5.0 Rating</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                "{successStories[0].title}"
              </h2>

              <p className="text-slate-300 text-sm italic border-l-2 border-amber-500 pl-4 py-1 leading-relaxed">
                "{successStories[0].quote}"
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Customer</span>
                  <span className="text-white font-bold">{successStories[0].customerName}</span>
                </div>
                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Route</span>
                  <span className="text-amber-400 font-bold truncate block">3 Jyotirlinga + Shirdi</span>
                </div>
                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Vehicle</span>
                  <span className="text-white font-bold">Innova Crysta</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4 flex-wrap">
                <Link
                  to="/routes/mumbai-to-3-jyotirlinga-cab"
                  className="gold-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase shadow-md"
                >
                  View Route Guide <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+919272174699"
                  onClick={trackPhoneCall}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-amber-400 transition"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" /> Book Same Chauffeur
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Browse Customer Journeys
              </h3>
              <p className="text-xs text-slate-500">Filter by your planned trip type</p>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Showing {filteredStories.length} Verified Stories
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                  activeCategory === cat
                    ? 'bg-amber-600 text-white shadow-amber-500/20 shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 hover:text-amber-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <AnimatePresence>
            {filteredStories.map((story) => {
              const isExpanded = expandedStory === story.id;
              return (
                <motion.div
                  key={story.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Media Header */}
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img 
                        src={story.image} 
                        alt={story.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-sm flex items-center gap-1.5 border border-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                        Verified Passenger
                      </div>

                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        {story.date}
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                        <div>
                          <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">{story.category}</p>
                          <h4 className="text-sm font-bold text-white truncate max-w-xs">{story.route}</h4>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(story.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-6">
                      {/* Customer Info Bar */}
                      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                          {story.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-bold text-slate-900 truncate">
                            {story.customerName}
                          </h5>
                          <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                            {story.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold border border-slate-200">
                            {story.vehicle}
                          </span>
                        </div>
                      </div>

                      {/* Headline */}
                      <h3 className="font-serif text-lg font-bold text-slate-900 leading-snug mb-3">
                        "{story.title}"
                      </h3>

                      {/* Highlight Tag */}
                      <div className="inline-block bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full px-3 py-1 text-[11px] font-semibold mb-3">
                        ★ Highlight: {story.highlightTag}
                      </div>

                      {/* Quote */}
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 italic">
                        "{story.quote}"
                      </p>

                      {/* Detailed Story (Expandable) */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 bg-slate-50/70 p-4 rounded-xl border mb-4 whitespace-pre-line"
                        >
                          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wide">
                            <UserCheck className="w-4 h-4" /> Chauffeur Assigned: {story.chauffeur}
                          </div>
                          <p>{story.story}</p>
                        </motion.div>
                      )}

                      <button
                        onClick={() => setExpandedStory(isExpanded ? null : story.id)}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition"
                      >
                        {isExpanded ? (
                          <>Show Less <ChevronUp className="w-3.5 h-3.5" /></>
                        ) : (
                          <>Read Full Journey Story <ChevronDown className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Chauffeur: <strong className="text-slate-700">{story.chauffeur}</strong>
                    </span>
                    <Link
                      to="/booking"
                      className="gold-btn px-4 py-2 rounded-full text-[11px] font-bold uppercase inline-flex items-center gap-1.5 shadow-sm"
                    >
                      Book Cab <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Why Travelers Love Boss Tours (Trust Grid) */}
        <div className="mb-20 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Our Promise</span>
            <h2 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
              Why 50,000+ Customers Trust Boss Tours
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every trip is backed by commercial transport excellence and courteous hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2 hover:border-amber-300 transition">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Deeply Sanitized Fleet</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cleaned, vacuumed, and perfumed before every passenger pickup.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2 hover:border-amber-300 transition">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <UserCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Police-Verified Drivers</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Trained in western ghat roads, patient, polite, and punctual.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2 hover:border-amber-300 transition">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Transparent Meter / Km</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Zero surprise driver demands, no hidden surcharges at trip end.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2 hover:border-amber-300 transition">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">24/7 Trip Support</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dedicated WhatsApp dispatch and emergency assistance round the clock.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Traveler Queries</span>
            <h3 className="font-serif text-3xl font-bold text-slate-900 mt-1">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {storyFaqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                >
                  <span className="font-semibold text-sm text-slate-900">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-amber-600 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* High Converting Call-to-Action */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 rounded-3xl p-8 sm:p-12 text-black shadow-xl text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-950">
            Ready to Write Your Own Travel Success Story?
          </h2>
          <p className="text-sm sm:text-base text-slate-900 max-w-2xl mx-auto font-medium">
            Join thousands of happy families, pilgrimage yatris, and corporate travelers. Book your sanitized luxury cab across Maharashtra with instant doorstep pickup.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
            <a
              href="tel:+919272174699"
              onClick={trackPhoneCall}
              className="bg-slate-950 text-white hover:bg-black px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg transition"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" /> Call +91 9272174699
            </a>
            <a
              href="https://wa.me/919272174699?text=Hello%20Boss%20Tours,%20I%20would%20like%20to%20book%20a%20cab%20for%20my%20upcoming%20journey"
              target="_blank"
              rel="noreferrer"
              onClick={trackWhatsAppClick}
              className="bg-emerald-600 text-white hover:bg-emerald-700 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg transition"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Booking
            </a>
            <Link
              to="/booking"
              className="bg-white text-slate-900 hover:bg-slate-100 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition"
            >
              <Car className="w-4 h-4 text-amber-600" /> Book Outstation Cab
            </Link>
          </div>
        </div>

      </div>

      {/* Share Your Story Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              {submitSuccess ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Thank You for Sharing!
                  </h3>
                  <p className="text-sm text-slate-600">
                    Your travel story has been received. Our review team will publish it shortly after verification.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Customer Experience</span>
                    <h3 className="font-serif text-2xl font-bold text-slate-900">
                      Share Your Travel Story
                    </h3>
                    <p className="text-xs text-slate-500">How was your journey with Boss Tours & Travels?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">City / Location *</label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="e.g. Thane / Mumbai"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Route Traveled *</label>
                      <input
                        type="text"
                        required
                        value={formData.route}
                        onChange={(e) => setFormData({...formData, route: e.target.value})}
                        placeholder="e.g. Mumbai to Shirdi"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Used</label>
                      <select
                        value={formData.vehicle}
                        onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 outline-none bg-white"
                      >
                        <option>Swift Dzire / Etios</option>
                        <option>Maruti Ertiga</option>
                        <option>Toyota Innova Crysta</option>
                        <option>Tempo Traveller</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Chauffeur Name (Optional)</label>
                      <input
                        type="text"
                        value={formData.chauffeur}
                        onChange={(e) => setFormData({...formData, chauffeur: e.target.value})}
                        placeholder="e.g. Santosh"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
                      <div className="flex items-center gap-1.5 py-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setFormData({...formData, rating: star})}
                            className="p-0.5 text-amber-500 hover:scale-110 transition"
                          >
                            <Star className={`w-5 h-5 ${star <= formData.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Journey Review & Story *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.story}
                      onChange={(e) => setFormData({...formData, story: e.target.value})}
                      placeholder="Tell us about the vehicle cleanliness, driver punctuality, route comfort, and memorable highlights..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-amber-500 outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="gold-btn w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md inline-flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Submit Travel Story
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

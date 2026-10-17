import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Navigation, ShieldCheck, Star, PhoneCall, 
  ArrowRight, CheckCircle2, ChevronDown, Send, Car, Sparkles, 
  HelpCircle, Calendar, ArrowLeft, Award, ThumbsUp, Compass
} from 'lucide-react';
import { maharashtraRoutes } from '../data/maharashtraRoutes';
import { trackPhoneCall, trackWhatsAppClick } from '../config/googleAds';

export default function RouteDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  // Find matching route by slug or default to first
  const route = maharashtraRoutes.find(r => r.slug === slug) || maharashtraRoutes[0];

  // Booking Quick Form state
  const [bookingType, setBookingType] = useState('oneway');
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedVehicle, setSelectedVehicle] = useState('Swift Dzire / Etios');
  const [pickupSpot, setPickupSpot] = useState(route.from_city);

  // Set document title and SEO meta dynamically
  useEffect(() => {
    if (route) {
      document.title = route.metaTitle || `${route.title} Booking | Boss Tours & Travels`;
      
      // Update meta description
      let metaDescTag = document.querySelector('meta[name="description"]');
      if (metaDescTag) {
        metaDescTag.setAttribute('content', route.metaDesc || route.overview);
      }

      // Update meta keywords
      let metaKeywordsTag = document.querySelector('meta[name="keywords"]');
      if (metaKeywordsTag) {
        metaKeywordsTag.setAttribute('content', route.keywords || `${route.title}, cab booking, taxi service`);
      }

      window.scrollTo(0, 0);
    }
  }, [route]);

  if (!route) {
    return (
      <div className="pt-32 pb-20 text-center min-h-[60vh] bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Route Not Found</h2>
        <Link to="/routes" className="gold-btn px-6 py-2.5 rounded-full text-xs font-bold uppercase">
          Back to All Routes
        </Link>
      </div>
    );
  }

  const handleQuickBook = (e) => {
    e.preventDefault();
    navigate(
      `/booking?type=${bookingType}&pickup=${encodeURIComponent(pickupSpot)}&drop=${encodeURIComponent(route.to_city)}&date=${travelDate}&car=${encodeURIComponent(selectedVehicle)}`
    );
  };

  // Structured Schema.org JSON-LD for this route
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": route.title + " Service",
    "description": route.metaDesc,
    "brand": {
      "@type": "Brand",
      "name": "Boss Tours & Travels"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1450"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "13",
      "price": "13",
      "offerCount": "5"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (route.faqs || []).map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const otherRoutes = maharashtraRoutes.filter(r => r.slug !== route.slug).slice(0, 6);

  const fleetRates = [
    { name: 'Swift Dzire / Etios', type: 'Sedan AC', seats: '4+1 Seater', rate: 13, luggage: '2 Bags' },
    { name: 'Maruti Ertiga / XL6', type: 'SUV AC', seats: '6+1 Seater', rate: 16, luggage: '4 Bags' },
    { name: 'Toyota Innova Crysta', type: 'Premium SUV', seats: '7 Seater', rate: 20, luggage: '5 Bags' },
    { name: 'Tempo Traveller', type: 'Mini Coach AC', seats: '13-17 Seater', rate: 28, luggage: 'Ample Bags' },
    { name: 'Luxury Bus / Coach', type: 'Luxury Coach', seats: '32-45 Seater', rate: 45, luggage: 'Large Luggage Boot' }
  ];

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-slate-50 min-h-screen">
      {/* Schema.org Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-500 flex items-center gap-2 flex-wrap font-medium">
          <Link to="/" className="hover:text-amber-600 transition">Home</Link>
          <span>/</span>
          <Link to="/routes" className="hover:text-amber-600 transition">Maharashtra Routes</Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">{route.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl -z-0 opacity-60 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-800 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                <span>{route.badge || 'Verified Highway Chauffeur'}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {route.title} <span className="text-amber-600">Service</span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                {route.overview}
              </p>

              {/* Vital Route Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Distance</span>
                  <span className="text-base font-extrabold text-slate-900 flex items-center justify-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-amber-600" /> ~{route.distance_km} KM
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Travel Time</span>
                  <span className="text-base font-extrabold text-slate-900 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> {route.est_time}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Cab Fare Rate</span>
                  <span className="text-base font-extrabold text-emerald-700">From ₹13/km</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Customer Rating</span>
                  <span className="text-base font-extrabold text-amber-600 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> 4.9 / 5
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  href="tel:+919272174699"
                  onClick={trackPhoneCall}
                  className="gold-btn px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <PhoneCall className="w-4 h-4" /> Call Hotline: +91 9272174699
                </a>

                <a
                  href={`https://wa.me/919272174699?text=Hi%20Boss%20Tours,%20I%20want%20to%20inquire%20about%20booking%20a%20cab%20for%20${encodeURIComponent(route.title)}.`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={trackWhatsAppClick}
                  className="bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-600 hover:text-white px-5 py-3 rounded-xl text-xs font-bold uppercase transition flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> WhatsApp Instant Quote
                </a>
              </div>
            </div>

            {/* Right Quick Booking Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-300 shadow-md">
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
                  <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Car className="w-5 h-5 text-amber-600" /> Quick Cab Reservation
                  </h2>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Instant Allotment
                  </span>
                </div>

                <form onSubmit={handleQuickBook} className="space-y-3.5">
                  {/* Trip Type Tabs */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-200 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setBookingType('oneway')}
                      className={`py-2 rounded-lg transition ${bookingType === 'oneway' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'}`}
                    >
                      One-Way Drop
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType('roundtrip')}
                      className={`py-2 rounded-lg transition ${bookingType === 'roundtrip' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'}`}
                    >
                      Round Trip
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1">
                      From Pickup Location
                    </label>
                    <input
                      type="text"
                      value={pickupSpot}
                      onChange={(e) => setPickupSpot(e.target.value)}
                      required
                      placeholder="e.g. Dadar, Andheri, Airport BOM..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1">
                      To Destination
                    </label>
                    <input
                      type="text"
                      value={route.to_city}
                      readOnly
                      className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1">
                      Travel Date
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-slate-700 mb-1">
                      Select Car Category
                    </label>
                    <select
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Swift Dzire / Etios">Swift Dzire / Sedan (₹13/km)</option>
                      <option value="Maruti Ertiga / XL6">Maruti Ertiga / XL6 (₹16/km)</option>
                      <option value="Toyota Innova Crysta">Toyota Innova Crysta (₹20/km)</option>
                      <option value="Tempo Traveller">Tempo Traveller (₹28/km)</option>
                      <option value="Luxury Bus / Coach">Luxury Bus (Starts ₹45/km)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="gold-btn w-full py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md mt-2"
                  >
                    <span>Proceed to Confirm Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-slate-500 text-center font-medium">
                    Verified Chauffeur • Transparent Rates • Zero Hidden Charges
                  </p>
                </form>
              </div>
            </div>

          </div>
        </div>

        {/* Section: Transparent Fleet Rates Table */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md mb-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 block mb-1">
              Transparent Pricing
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
              Vehicle Rates for <span className="text-amber-600">{route.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Choose from our wide range of clean, fully sanitized commercial vehicles driven by experienced highway chauffeurs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {fleetRates.map((f) => (
              <div 
                key={f.name}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-amber-400 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      {f.type}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{f.seats}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-slate-900 mb-1">{f.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{f.luggage} luggage space</p>
                  
                  <div className="border-t border-slate-200 pt-3 mb-4">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Standard Rate</span>
                    <span className="text-2xl font-extrabold text-amber-600 font-serif">₹{f.rate}</span>
                    <span className="text-xs text-slate-500 font-semibold"> / km</span>
                  </div>
                </div>

                <Link
                  to={`/booking?pickup=${encodeURIComponent(route.from_city)}&drop=${encodeURIComponent(route.to_city)}&car=${encodeURIComponent(f.name)}`}
                  className="gold-btn w-full py-2.5 rounded-xl text-xs font-bold uppercase text-center block shadow"
                >
                  Book This Car
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Route Highlights & Top Sightseeing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Highlights Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" /> Route Journey Highlights
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Why our passengers rate Boss Tours & Travels 4.9/5 stars for {route.title}:
            </p>

            <ul className="space-y-3 pt-2">
              {(route.highlights || []).map((hl, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sightseeing Spots Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600" /> Top Sightseeing & Stops on this Route
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Popular tourist attractions, sacred temples, and scenic spots along the journey:
            </p>

            <ul className="space-y-3 pt-2">
              {(route.sightseeing || []).map((sight, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{sight}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Section: Doorstep Pickup Coverage */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
                Zero Extra Waiting Charge
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                Doorstep Pickup Locations Covered Across Mumbai Region
              </h2>
            </div>
            <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full">
              24/7 Service Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(route.pickup_points || [
              'South Mumbai (Colaba, Marine Drive, Dadar)',
              'Western Suburbs (Bandra, Andheri, Borivali)',
              'Central Suburbs (Ghatkopar, Mulund, Thane)',
              'Navi Mumbai (Vashi, Nerul, Belapur, Panvel)',
              'Kalyan, Dombivli, Ulhasnagar & Bhiwandi',
              'Mumbai International Airport (CSMT T1 & T2)'
            ]).map((point, idx) => (
              <div key={idx} className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Frequently Asked Questions (FAQ) */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md mb-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 block mb-1">
              Have Questions?
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions for <span className="text-amber-600">{route.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Clear answers to help you plan your journey seamlessly.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {(route.faqs || []).map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 bg-slate-50"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 font-serif text-sm sm:text-base font-bold text-slate-900 flex items-center justify-between gap-4"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-amber-600 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 font-normal"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Other Popular Maharashtra Routes (Internal Linking for SEO) */}
        <section className="bg-slate-50 border-t border-slate-200 pt-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
                More Destinations
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                Explore Other Popular Outstation Routes
              </h2>
            </div>
            <Link to="/routes" className="text-xs font-bold text-amber-700 hover:text-amber-600 flex items-center gap-1">
              View All 30+ Routes &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherRoutes.map((r) => (
              <div 
                key={r.slug}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 transition shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {r.category || 'Outstation Cab'}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{r.est_time}</span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-slate-900 mb-1">
                    {r.from_city} &rarr; {r.to_city}
                  </h3>

                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                    {r.overview}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <Link
                    to={`/routes/${r.slug}`}
                    className="text-xs font-extrabold text-amber-700 hover:text-amber-800"
                  >
                    View Route Details &rarr;
                  </Link>

                  <Link
                    to={`/booking?pickup=${encodeURIComponent(r.from_city)}&drop=${encodeURIComponent(r.to_city)}`}
                    className="gold-btn px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase shadow-sm"
                  >
                    Book Cab
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

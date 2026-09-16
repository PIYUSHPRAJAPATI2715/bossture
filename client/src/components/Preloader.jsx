import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide preloader after initial website load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white select-none overflow-hidden"
        >
          {/* Subtle Background Radial Light */}
          <div className="absolute w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Round Logo Container */}
          <div className="relative mb-6">
            {/* Spinning Outer Golden Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="absolute -inset-3 rounded-full border-2 border-t-amber-400 border-r-amber-500/80 border-b-amber-600/50 border-l-transparent shadow-lg shadow-amber-500/20 pointer-events-none"
            />

            {/* Counter-rotating Inner Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="absolute -inset-1.5 rounded-full border border-t-transparent border-r-amber-300 border-b-transparent border-l-amber-500 pointer-events-none"
            />

            {/* Round Logo Image Frame */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.95, 1.05, 0.95], opacity: 1 }}
              transition={{ 
                scale: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
                opacity: { duration: 0.4 }
              }}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-amber-500 p-1 bg-slate-900 shadow-[0_0_40px_rgba(245,158,11,0.4)] overflow-hidden flex items-center justify-center relative z-10"
            >
              <img
                src="/images/logo.png"
                alt="Boss Tours & Travels Official Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </motion.div>
          </div>

          {/* Brand Name & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center space-y-1 z-10"
          >
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
              BOSS <span className="text-amber-400">TOURS & TRAVELS</span>
            </h1>
            <p className="text-xs sm:text-sm text-amber-500 font-serif italic tracking-widest font-semibold">
              Your Journey, Our Passion
            </p>
          </motion.div>

          {/* Animated Loading Bar */}
          <div className="w-44 sm:w-56 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden relative z-10 border border-slate-700">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              className="w-full h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

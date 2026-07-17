import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { WarmTeaScene } from './WarmTeaScene';

interface Page3ComfortCornerProps {
  isActive: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.6,
      delayChildren: 1.5 
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 1.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

export const Page3ComfortCorner: React.FC<Page3ComfortCornerProps> = ({ isActive }) => {
  const [isHugging, setIsHugging] = useState(false);
  const [activeScene, setActiveScene] = useState<'menu' | 'tea' | 'night'>('menu');

  const handleHug = () => {
    if (isHugging) return;
    setIsHugging(true);

    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 2000]);
    }

    window.dispatchEvent(new Event('hug-start'));

    setTimeout(() => {
      setIsHugging(false);
      window.dispatchEvent(new Event('hug-end'));
    }, 4500);
  };

  if (!isActive) return null;

  const isMenuVisible = activeScene === 'menu' && !isHugging;

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center px-6 relative ${activeScene === 'night' ? 'pointer-events-none' : 'pointer-events-auto'}`}>
      
      {/* The Hug Overlay (Warm Light & Text) */}
      <AnimatePresence>
        {isHugging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center"
            style={{ 
              boxShadow: 'inset 80px 0 120px rgba(255, 180, 130, 0.15), inset -80px 0 120px rgba(255, 180, 130, 0.15)',
              backgroundColor: 'rgba(50, 30, 20, 0.05)',
            }}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.1, 1], opacity: 1 }}
              transition={{ 
                opacity: { duration: 2 },
                scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
              }}
              className="text-4xl filter drop-shadow-md"
              style={{ transform: 'translateY(-180px)' }} 
            >
              ❤️
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="text-[#5A504B] font-serif text-lg md:text-xl text-center px-8 tracking-wide drop-shadow-sm"
              style={{ textShadow: '0 0 10px rgba(255,255,255,0.8)', transform: 'translateY(-160px)' }}
            >
              Pretend this is me hugging you for as long as you need.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Menu Cards */}
      <AnimatePresence>
        {isMenuVisible && (
          <motion.div 
            className="flex flex-col gap-6 w-full max-w-sm"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 1 } }}
          >
            <motion.button 
              variants={cardVariants}
              onClick={handleHug}
              className="w-full group relative overflow-hidden rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-8 text-center transition-transform duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h2 className="text-xl md:text-2xl font-serif text-[#6B615C] tracking-wide pointer-events-none">🫂 Hold Me</h2>
            </motion.button>

            <motion.button 
              variants={cardVariants}
              onClick={() => setActiveScene('tea')}
              className="w-full group relative overflow-hidden rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-8 text-center transition-transform duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h2 className="text-xl md:text-2xl font-serif text-[#6B615C] tracking-wide pointer-events-none">🍵 Warm Tea</h2>
            </motion.button>

            <motion.button 
              variants={cardVariants}
              onClick={() => {
                setActiveScene('night');
                window.dispatchEvent(new Event('nightfall-start'));
              }}
              className="w-full group relative overflow-hidden rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-8 text-center transition-transform duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h2 className="text-xl md:text-2xl font-serif text-[#6B615C] tracking-wide pointer-events-none">🌙 Rest With Me</h2>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub-scenes */}
      <AnimatePresence>
        {activeScene === 'tea' && (
          <WarmTeaScene isActive={true} onBack={() => setActiveScene('menu')} />
        )}
      </AnimatePresence>

    </div>
  );
};

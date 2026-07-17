import React from 'react';
import { motion } from 'framer-motion';

export const GlowingHeart: React.FC = () => {
  return (
    <motion.div
      className="absolute z-20 cursor-pointer heart-pulse"
      style={{
        left: 'calc(50% + 45px)',
        bottom: '32vh',
        width: '14px',
        height: '14px'
      }}
      whileTap={{ 
        scale: 1.8, 
        filter: "drop-shadow(0 0 15px rgba(255,255,255,1))",
        transition: { duration: 0.2 }
      }}
    >
      <svg viewBox="0 0 32 32" fill="#FFB7C5" className="w-full h-full drop-shadow-[0_0_6px_rgba(255,183,197,0.8)]">
        <path d="M16 28.72l-1.92-1.748c-6.814-6.177-11.31-10.25-11.31-15.305 0-4.135 3.255-7.39 7.39-7.39 2.33 0 4.566 1.096 5.84 2.808 1.274-1.712 3.51-2.808 5.84-2.808 4.135 0 7.39 3.255 7.39 7.39 0 5.055-4.496 9.128-11.31 15.32l-1.92 1.733z" />
      </svg>
    </motion.div>
  );
};

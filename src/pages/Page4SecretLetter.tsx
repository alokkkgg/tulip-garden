import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Page4SecretLetterProps {
  isActive: boolean;
}

export const Page4SecretLetter: React.FC<Page4SecretLetterProps> = ({ isActive }) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  if (!isActive) return null;

  const containerVariants: any = {
    hidden: { 
      opacity: 0,
      rotateX: -10,
      scaleY: 0.95,
      y: 20
    },
    show: {
      opacity: 1,
      rotateX: 0,
      scaleY: 1,
      y: 0,
      transition: {
        duration: 2,
        ease: "easeOut",
        staggerChildren: 1.5,
        delayChildren: 1.5
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  return (
    <div 
      className="absolute inset-0 w-full h-full bg-black z-50 overflow-y-auto overflow-x-hidden flex flex-col items-center py-12 md:py-24"
    >
      
      {/* The Paper Container */}
      <motion.div 
        initial={{ opacity: 0, rotate: 0.5 }}
        animate={{ opacity: 1, rotate: 0.5 }}
        transition={{ duration: 3 }}
        className="relative w-11/12 max-w-2xl bg-[#FDFBF7] rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden shrink-0"
        style={{ perspective: '1000px', transformOrigin: 'center center' }}
      >
        {/* Subtle Paper Texture (SVG Noise) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-multiply" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
        </div>

        {/* Letter Body */}
        <div className="w-full flex flex-col items-center py-16 px-10 md:px-16 md:py-20 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onAnimationComplete={() => setAnimationComplete(true)}
            className="w-full flex flex-col font-handwriting text-[#3D3632] text-xl md:text-2xl leading-[2.2] tracking-wide origin-top"
          >
            
            {/* Title */}
            <motion.h1 variants={itemVariants} className="text-center font-signature text-4xl md:text-5xl mb-14 text-[#2E2825]">
              For You. 🩷
            </motion.h1>

            {/* Salutation */}
            <motion.p variants={itemVariants} className="mb-8 text-left">
              Hey Jaeennuu,
            </motion.p>

            {/* Body */}
            <motion.p variants={itemVariants} className="mb-8 text-left">
              I know this can't replace a real hug, a warm cup of tea, or me sitting beside you while you rest. And since I can't... I made this tiny place for you instead.
            </motion.p>

            <motion.p variants={itemVariants} className="mb-8 text-left">
              There's something I've wanted to tell you...<br/>
              Sometimes, when you're not feeling well, I become too much protective. I start telling you what to do, what not to do, asking if you've eaten, if you've rested, if you've taken care of yourself... and I know it can probably get a little annoying sometimes.
            </motion.p>

            <motion.p variants={itemVariants} className="mb-8 text-left">
              I'm sorry if it ever feels like too much. But I don't do it because I think you can't take care of yourself. I do it because since i can't be present there to make your things and work easier, my words end up trying to do what my presence can't.
            </motion.p>

            <motion.p variants={itemVariants} className="mb-8 text-left">
              So if I ever sound a little overprotective, just know it's never because I want to control you.<br/>
              It's simply because I care about you... probably a little too much. 🤍
            </motion.p>

            <motion.p variants={itemVariants} className="mb-14 text-left">
              If this little place made you smile, even for a few seconds, then every minute I spent creating it was worth it.<br/><br/>
              Always.
            </motion.p>

            {/* Sign-off */}
            <motion.p variants={itemVariants} className="text-right font-signature text-3xl md:text-4xl mt-4">
              — Yours. 🌷🩷
            </motion.p>
            
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom padding for scrolling comfort */}
      <div className="h-48 w-full shrink-0" />
        
    </div>
  );
};

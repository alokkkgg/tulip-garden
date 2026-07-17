import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroTulip } from '../components/HeroTulip';
import { GlowingHeart } from '../components/GlowingHeart';

interface Page1IntroProps {
  onTransitionStart: (e: React.MouseEvent) => void;
  isFadingOut: boolean;
}

const DustParticles = () => {
  const particles = Array.from({ length: 30 }).map((_, i) => {
    // Determine random movement direction for CSS
    const xDir = -10 + Math.random() * 20;
    const yDir = 20 + Math.random() * 30; // Move up by default
    return (
      <div
        key={i}
        className="absolute bg-white rounded-full opacity-30 ambient-dust"
        style={{
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          '--x-dir': xDir,
          '--y-dir': yDir,
          '--duration': `${15 + Math.random() * 15}s`,
          '--delay': `${Math.random() * 10}s`
        } as React.CSSProperties}
      />
    );
  });
  return <div className="absolute inset-0 pointer-events-none z-10">{particles}</div>;
};

const AmbientPetals = () => {
  // Just 4 petals, pure CSS float
  const petals = Array.from({ length: 4 }).map((_, i) => (
    <div
      key={`amb-petal-${i}`}
      className="absolute pointer-events-none z-20 ambient-petal"
      style={{
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 80}%`,
        width: `${15 + Math.random() * 15}px`,
        height: `${15 + Math.random() * 15}px`,
        borderRadius: '50% 0 50% 50%',
        backgroundColor: '#FFD1DC',
        opacity: 0.6,
        filter: 'drop-shadow(0 4px 6px rgba(255,183,197,0.3))',
        '--duration': `${25 + Math.random() * 20}s`,
        '--delay': `${Math.random() * 15}s`
      } as React.CSSProperties}
    />
  ));
  return <div className="absolute inset-0 pointer-events-none overflow-hidden">{petals}</div>;
};

export const Page1Intro: React.FC<Page1IntroProps> = ({ onTransitionStart, isFadingOut }) => {
  const [step, setStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === 0) setTimeout(() => setStep(1), 1500); 
    else if (step === 1) setTimeout(() => setStep(2), 3500); 
    else if (step === 2) setTimeout(() => setStep(3), 4000); 
    else if (step === 3) setTimeout(() => setStep(4), 4500); 
  }, [step]);

  const textVariants: any = {
    hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
    visible: { 
      opacity: 1, 
      clipPath: 'inset(0 0% 0 0)', 
      transition: { duration: 2.5, ease: "linear" } 
    },
    exit: { opacity: 0, filter: 'blur(10px)', transition: { duration: 2 } }
  };

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      transition={{ duration: 4, ease: "easeInOut" }}
      className="absolute inset-0 z-50 flex flex-col bg-[#FCFAF5] overflow-hidden"
    >
      {/* 1. Deepest Layer: Premium Handmade Paper Texture */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`
        }}
      />

      {/* 2. Soft Animated Light (CSS Only) */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] pointer-events-none z-[1] light-breathe"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255,248,220,0.6) 0%, transparent 60%)',
          mixBlendMode: 'overlay'
        }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[100%] pointer-events-none z-[1] light-breathe-alt"
        style={{
          background: 'radial-gradient(circle at 70% 70%, rgba(255,230,235,0.4) 0%, transparent 70%)',
          mixBlendMode: 'screen'
        }}
      />

      {/* 3. Ambient Elements */}
      <DustParticles />
      <AmbientPetals />

      {/* 4. Hero Illustration & Heart */}
      <HeroTulip />
      <GlowingHeart />

      {/* 5. Typography Layer */}
      <div className="relative z-30 flex flex-col items-center pt-[15vh] px-8 max-w-2xl mx-auto space-y-6 text-center">
        <AnimatePresence>
          {step >= 1 && (
            <motion.p 
              variants={textVariants} initial="hidden" animate={isFadingOut ? "exit" : "visible"}
              className="text-2xl md:text-3xl font-serif text-[#6B615C] tracking-wide"
            >
              Hey babbbeee...
            </motion.p>
          )}
          {step >= 2 && (
            <motion.p 
              variants={textVariants} initial="hidden" animate={isFadingOut ? "exit" : "visible"}
              className="text-xl md:text-2xl font-serif text-[#877D76]"
            >
              I know today has been a little hard.
            </motion.p>
          )}
          {step >= 3 && (
            <motion.p 
              variants={textVariants} initial="hidden" animate={isFadingOut ? "exit" : "visible"}
              className="text-xl md:text-2xl font-serif text-[#877D76] leading-relaxed"
            >
              So I made you a tiny place<br/>where you can rest for a while.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* 6. The Button Area */}
      <AnimatePresence>
        {step === 4 && !isFadingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 flex items-center justify-center w-full z-40"
          >
            {/* Soft glowing area inviting her (CSS Only) */}
            <div className="absolute w-[200px] h-[80px] bg-white/40 blur-xl rounded-full ambient-glow" />
            
            <motion.button
              initial={{ y: 15 }}
              animate={{ y: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onTransitionStart}
              className="relative px-8 py-3 rounded-full bg-white/70 backdrop-blur-md border border-[#F5E6E8] text-[#6B615C] font-medium tracking-wide text-lg cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center gap-3"
            >
              <span>Come with me</span>
              <span className="text-xl">🌷</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

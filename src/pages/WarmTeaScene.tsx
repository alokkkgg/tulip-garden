import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useTeaAudio } from '../hooks/useTeaAudio';

interface WarmTeaSceneProps {
  isActive: boolean;
  onBack: () => void;
}

export const WarmTeaScene: React.FC<WarmTeaSceneProps> = ({ isActive, onBack }) => {
  const liquidRef = useRef<HTMLDivElement>(null);
  const cupContainerRef = useRef<HTMLDivElement>(null);
  const steamContainerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  const [sequenceState, setSequenceState] = useState<'hidden' | 'rising' | 'steaming' | 'settled' | 'message'>('hidden');
  
  const { playTap } = useTeaAudio(isActive && sequenceState !== 'hidden');

  // Entrance Sequence
  useEffect(() => {
    if (!isActive) {
      setSequenceState('hidden');
      return;
    }

    setSequenceState('rising');
    
    setTimeout(() => {
      setSequenceState('steaming');
      setTimeout(() => {
        setSequenceState('settled');
        setTimeout(() => {
          setSequenceState('message');
        }, 2000);
      }, 1500);
    }, 2000);
    
  }, [isActive]);

  // Steam Particles Logic
  useEffect(() => {
    if (sequenceState === 'hidden' || sequenceState === 'rising' || !steamContainerRef.current) return;

    let isActiveSteam = true;

    const createSteamWisp = () => {
      if (!isActiveSteam || !steamContainerRef.current) return;

      const wisp = document.createElement('div');
      wisp.className = 'absolute bottom-[10%] left-[50%] w-20 h-20 rounded-full bg-[#E5DFD8] blur-[24px] pointer-events-none mix-blend-normal';
      
      const startX = -40 + Math.random() * 80;
      const startScale = 0.8 + Math.random() * 0.4;
      
      gsap.set(wisp, {
        x: startX,
        y: 0,
        scale: startScale,
        opacity: 0,
      });

      steamContainerRef.current.appendChild(wisp);

      gsap.to(wisp, {
        y: -180 - Math.random() * 120,
        x: startX + (-80 + Math.random() * 160),
        scale: startScale * (2.5 + Math.random() * 2),
        opacity: 0.15 + Math.random() * 0.15, // 15-30% opacity
        duration: 5 + Math.random() * 3,
        ease: "sine.inOut",
        onComplete: () => {
          gsap.to(wisp, {
            opacity: 0,
            duration: 2,
            onComplete: () => {
              if (wisp.parentNode) wisp.parentNode.removeChild(wisp);
            }
          });
        }
      });

      if (isActiveSteam) {
        setTimeout(createSteamWisp, 1000 + Math.random() * 1000);
      }
    };

    createSteamWisp();
    setTimeout(createSteamWisp, 600);

    return () => {
      isActiveSteam = false;
      if (steamContainerRef.current) {
        steamContainerRef.current.innerHTML = '';
      }
    };
  }, [sequenceState]);

  // Fluid Swirl Physics
  useEffect(() => {
    if (!liquidRef.current) return;

    let currentRotation = 0;
    let velocity = 0;
    let lastX = 0;
    let lastY = 0;
    let isDragging = false;
    let animationFrame: number;

    const liquid = liquidRef.current;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      playTap();
      
      gsap.to(glowRef.current, {
        opacity: 0.6,
        scale: 1.1,
        duration: 1
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      
      const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const direction = (deltaX > 0 || deltaY > 0) ? 1 : -1;
      
      velocity += movement * 0.1 * direction;
      
      if (velocity > 15) velocity = 15;
      if (velocity < -15) velocity = -15;

      lastX = e.clientX;
      lastY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
      
      gsap.to(glowRef.current, {
        opacity: 0.3,
        scale: 1.0,
        duration: 3
      });
    };

    const updatePhysics = () => {
      if (!isDragging) {
        velocity *= 0.96; 
      }
      
      if (Math.abs(velocity) > 0.01) {
        currentRotation += velocity;
        gsap.set(liquid, { rotation: currentRotation });
      }

      animationFrame = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    liquid.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      cancelAnimationFrame(animationFrame);
      liquid.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [playTap]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto bg-[radial-gradient(circle_at_center,_#FFF9F0_0%,_#F2E3CE_100%)] transition-opacity duration-1000 overflow-hidden">
      
      {/* Background Vignette / Warmth */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(180,120,60,0.15)] pointer-events-none" />

      {/* The Cup Assembly */}
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative flex items-center justify-center w-[300px] h-[300px]"
        ref={cupContainerRef}
      >
        {/* Soft Ambient Amber Glow Behind Cup */}
        <div 
          ref={glowRef}
          className="absolute inset-0 bg-[#E5AB4A] blur-[80px] rounded-full opacity-30 pointer-events-none scale-100"
        />

        {/* Drop Shadow on the table */}
        <div className="absolute top-[15px] left-[15px] w-[220px] h-[220px] rounded-full bg-[#8A7561] blur-[15px] opacity-20 pointer-events-none" />

        {/* Steam Container (above shadow, behind some rim highlights if we wanted, but generally over the liquid) */}
        <div ref={steamContainerRef} className="absolute bottom-1/2 left-0 w-full h-[300px] pointer-events-none overflow-visible z-30" />

        {/* The Mug Structure */}
        <div className="relative w-[220px] h-[220px]">
          
          {/* Mug Handle */}
          <div className="absolute top-[50%] -right-[36px] w-[80px] h-[100px] rounded-[40px] border-[14px] border-[#FFFDF8] shadow-[inset_0_4px_10px_rgba(0,0,0,0.02),_8px_12px_20px_rgba(138,117,97,0.15)] transform -translate-y-1/2 pointer-events-none z-0" />
          
          {/* Ceramic Outer Rim */}
          <div className="absolute inset-0 rounded-full bg-[#FFFDF8] shadow-[inset_0_8px_16px_rgba(255,255,255,1),_0_10px_30px_rgba(138,117,97,0.15)] pointer-events-none border border-[#F5EDE1] z-10" />
          
          {/* Inner Ceramic Wall Depth */}
          <div className="absolute inset-[10px] rounded-full bg-[#E8DECE] shadow-[inset_0_12px_24px_rgba(110,80,50,0.25)] pointer-events-none z-10" />
          
          {/* Tea Liquid */}
          <div className="absolute inset-[14px] rounded-full overflow-hidden shadow-[inset_0_12px_24px_rgba(60,30,0,0.6)] z-20">
            <div 
              ref={liquidRef}
              className="absolute inset-[-30%] bg-[radial-gradient(circle_at_35%_35%,_#ECAE49_0%,_#C98824_45%,_#734407_100%)] cursor-grab active:cursor-grabbing flex items-center justify-center"
              style={{ touchAction: 'none' }}
            >
              {/* Noise texture to make swirling visible */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxmaWx0ZXIgaWQ9Im4iPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjAyIiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIwLjI1IiBtaXgtYmxlbmQtbW9kZT0ib3ZlcmxheSIvPjwvc3ZnPg==')] mix-blend-overlay opacity-30" />
              
              {/* Soft fluid gradients to show motion */}
              <div className="absolute w-[150%] h-[150%] bg-[conic-gradient(from_0deg,_transparent_0deg,_rgba(255,255,255,0.05)_90deg,_transparent_180deg,_rgba(100,50,0,0.1)_270deg,_transparent_360deg)] rounded-full pointer-events-none" />
            </div>
          </div>

          {/* Liquid Surface Reflection (Static relative to light) */}
          <div className="absolute top-[20%] left-[18%] w-[40%] h-[15%] rounded-full bg-white/20 blur-[6px] pointer-events-none rotate-[-25deg] z-20" />
          
          {/* Ceramic Rim Highlight */}
          <div className="absolute top-[4px] left-[15%] w-[70%] h-[8%] rounded-full bg-white/60 blur-[3px] pointer-events-none rotate-[-10deg] z-20" />
        </div>
      </motion.div>

      {/* Message */}
      <AnimatePresence>
        {sequenceState === 'message' && (
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute bottom-[20%] text-[#8C7662] font-serif text-lg md:text-xl text-center px-8 tracking-wide drop-shadow-sm"
          >
            Drink something warm for me, thik h? 🌷
          </motion.p>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 2 }}
        onClick={onBack}
        className="absolute top-8 left-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-[#D1BFAe]/30 text-[#8C7662] shadow-sm hover:bg-white/40 transition-all duration-300 z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </motion.button>
    </div>
  );
};

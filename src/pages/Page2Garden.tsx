import React, { useEffect, useRef, useState } from 'react';
import { Garden } from '../components/Garden';
import { MorningSky } from '../components/MorningSky';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { useNatureAudio } from '../hooks/useNatureAudio';

interface Page2GardenProps {
  isActive: boolean;
  isTransitionComplete: boolean;
  isBlurred: boolean;
  isNightMode?: boolean;
  onNavigateToPage3: () => void;
  onNavigateToPage4?: () => void;
}

export const Page2Garden: React.FC<Page2GardenProps> = ({ isActive, isTransitionComplete, isBlurred, isNightMode = false, onNavigateToPage3, onNavigateToPage4 }) => {
  const cameraRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const nightOverlayRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  
  const [showWelcome, setShowWelcome] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showNightMessage, setShowNightMessage] = useState(false);
  const [showPage4Button, setShowPage4Button] = useState(false);
  const [isTransitioningToPage4, setIsTransitioningToPage4] = useState(false);
  
  const { playRustle, playFlutter } = useNatureAudio(isActive && !isBlurred && !isTransitioning, isNightMode, isTransitioningToPage4);

  // Sunset Animation
  useEffect(() => {
    if (isNightMode && skyRef.current && nightOverlayRef.current && starsRef.current && moonRef.current) {
      const tl = gsap.timeline();
      
      // Warm cream -> Soft amber -> Rose -> Lavender -> Deep blue
      tl.to(skyRef.current, { backgroundColor: '#E6B381', duration: 1.5, ease: "sine.inOut" })
        .to(skyRef.current, { backgroundColor: '#D37F8E', duration: 1.5, ease: "sine.inOut" })
        .to(skyRef.current, { backgroundColor: '#8B6899', duration: 1.5, ease: "sine.inOut" })
        .to(skyRef.current, { backgroundColor: '#1B264A', duration: 1.5, ease: "sine.inOut" });

      // Bring in the night tint (multiply) over the whole scene to cool down the greens
      gsap.to(nightOverlayRef.current, { opacity: 0.8, duration: 6, ease: "sine.inOut" });
      
      // Fade in stars
      gsap.to(starsRef.current, { opacity: 1, duration: 3, delay: 4, ease: "sine.inOut" });
      
      // Moon rise
      gsap.to(moonRef.current, { y: 0, opacity: 0.8, duration: 6, ease: "sine.out" });

      // Trigger night message after transition + 2.5s silence (total 8.5s)
      setTimeout(() => {
        setShowNightMessage(true);
      }, 8500);

      // Trigger Page 4 button after message has been read for a bit
      setTimeout(() => {
        setShowPage4Button(true);
      }, 16000);
    }
  }, [isNightMode]);

  // Camera breathing
  useEffect(() => {
    if (!isActive || isBlurred) {
       if (isBlurred) gsap.killTweensOf(cameraRef.current);
       return;
    }
    
    if (cameraRef.current) {
      gsap.to(cameraRef.current, {
        scale: 1.02,
        x: "-0.5%",
        y: "-0.5%",
        duration: 8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    }
  }, [isActive, isBlurred]);

  // Timers for Welcome text and Transition button
  useEffect(() => {
    if (isTransitionComplete) {
      setTimeout(() => {
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 8000); 
        
        // Show the transition button a few seconds after the welcome text fades
        setTimeout(() => setShowButton(true), 10000);
      }, 500); 
    }
  }, [isTransitionComplete]);

  // Handle gentle blur transition to Page 3
  const handleTransitionClick = () => {
    if (isTransitioning || !buttonRef.current) return;
    setIsTransitioning(true);

    const tl = gsap.timeline();
    
    tl.to(buttonRef.current, {
      scale: 0.9,
      opacity: 0.8,
      duration: 0.4,
      ease: "sine.inOut"
    });

    tl.to({}, { duration: 0.4 });

    tl.call(() => {
      onNavigateToPage3();
    });
  };

  // Handle fade to black for Page 4
  const handleTransitionToPage4 = () => {
    if (isTransitioningToPage4) return; // Prevent double clicks
    setIsTransitioningToPage4(true);
    setShowPage4Button(false);
    setShowNightMessage(false);

    if (onNavigateToPage4) {
      onNavigateToPage4();
    }

    if (skyRef.current && cameraRef.current && starsRef.current && moonRef.current) {
      const tl = gsap.timeline();
      // Fade sky to pure black
      tl.to(skyRef.current, { backgroundColor: '#000000', duration: 4, ease: "sine.inOut" }, 0);
      // Fade out the camera/garden layer with a slight delay so fireflies drift
      tl.to(cameraRef.current, { opacity: 0, duration: 3, ease: "sine.inOut" }, 1);
      // Dim stars and moon
      tl.to(starsRef.current, { opacity: 0, duration: 3, ease: "sine.inOut" }, 1);
      tl.to(moonRef.current, { opacity: 0, duration: 3, ease: "sine.inOut" }, 1);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#FDFBF7]">
        
        {/* Dynamic Sky Background (Sunset/Night Color Layer) */}
        <div ref={skyRef} className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: '#F6FBFF' }} />

        {/* Morning Sky Background */}
        <MorningSky isActive={isActive} isNightMode={isNightMode} />

        {/* Stars */}
        <div 
          ref={starsRef}
          className="absolute inset-0 z-0 pointer-events-none opacity-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjMwIiByPSIxIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjgiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSI4MCIgcj0iMC41IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjE1MCIgcj0iMS41IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjciLz48Y2lyY2xlIGN4PSIxODAiIGN5PSIxODAiIHI9IjEiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNiIvPjwvc3ZnPg==')] opacity-0 mix-blend-screen" 
        />

        {/* The Moon */}
        <div 
          ref={moonRef}
          className="absolute top-[15%] right-[20%] w-[100px] h-[100px] rounded-full bg-[#FFFBF0] opacity-0 pointer-events-none mix-blend-screen z-[1]"
          style={{ 
            boxShadow: '0 0 40px 10px rgba(255,251,240,0.3), 0 0 100px 30px rgba(255,251,240,0.1)',
            transform: 'translateY(100px)'
          }}
        />

        {/* Atmospheric Lighting */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_rgba(255,248,220,0.7)_0%,_rgba(253,251,247,0.2)_50%,_transparent_100%)] mix-blend-overlay transition-opacity duration-1000" style={{ opacity: isNightMode ? 0 : 1 }} />
          <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[linear-gradient(140deg,_rgba(255,250,230,0.12)_0%,_transparent_20%,_rgba(255,250,230,0.06)_40%,_transparent_60%)] blur-[50px] mix-blend-screen transition-opacity duration-1000" style={{ opacity: isNightMode ? 0 : 1 }} />
          
          {isActive && !isNightMode && (
            <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-70 transition-opacity duration-3000">
              <div className="absolute top-0 left-[-10%] w-[40%] h-[150%] bg-[linear-gradient(105deg,_transparent_30%,_rgba(255,250,230,0.15)_45%,_rgba(255,250,230,0.3)_50%,_rgba(255,250,230,0.15)_55%,_transparent_70%)] sunlight-ray blur-[10px]" style={{'--duration': '12s', '--delay': '0s'} as React.CSSProperties} />
              <div className="absolute top-0 left-[10%] w-[30%] h-[150%] bg-[linear-gradient(105deg,_transparent_30%,_rgba(255,250,230,0.1)_45%,_rgba(255,250,230,0.2)_50%,_rgba(255,250,230,0.1)_55%,_transparent_70%)] sunlight-ray blur-[15px]" style={{'--duration': '15s', '--delay': '2s'} as React.CSSProperties} />
              <div className="absolute top-0 left-[30%] w-[20%] h-[150%] bg-[linear-gradient(105deg,_transparent_30%,_rgba(255,250,230,0.05)_45%,_rgba(255,250,230,0.1)_50%,_rgba(255,250,230,0.05)_55%,_transparent_70%)] sunlight-ray blur-[20px]" style={{'--duration': '18s', '--delay': '4s'} as React.CSSProperties} />
            </div>
          )}
          <div className="absolute bottom-[30%] w-full h-[40%] bg-gradient-to-t from-white/40 to-transparent opacity-50 z-[5] blur-xl" style={{ opacity: isNightMode ? 0.1 : 0.5 }} />
        </div>

        {/* The Garden (Camera Layer) */}
        <div 
          ref={cameraRef} 
          className="absolute inset-[-5%] w-[110%] h-[110%] transform-gpu origin-center"
          // Disable interaction when blurred to avoid accidental clicks behind Page 3
          style={{ pointerEvents: isBlurred ? 'none' : 'auto' }}
        >
          <Garden isActive={isActive && !isBlurred} isNightMode={isNightMode} playRustle={playRustle} playFlutter={playFlutter} />
        </div>

        {/* Night Tint Overlay (Cools the whole scene down) */}
        <div 
          ref={nightOverlayRef}
          className="absolute inset-0 z-20 pointer-events-none bg-[#09112B] mix-blend-multiply opacity-0"
        />

        {/* Warm Blur Overlay for Page 3 Transition */}
        <AnimatePresence>
          {isBlurred && (
            <motion.div 
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="absolute inset-0 z-30 bg-orange-50/15 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Night Message */}
        <AnimatePresence>
          {showNightMessage && (
            <motion.div 
              className="absolute bottom-[15%] w-full flex flex-col items-center justify-center z-40 pointer-events-none space-y-4 px-6 text-center"
            >
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="text-xl md:text-2xl font-serif text-[#E8E2D5] drop-shadow-md tracking-wider"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              >
                Sleep well, babbbeee. 🤍
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, delay: 3, ease: "easeInOut" }}
                className="text-sm md:text-base font-serif text-[#C4BCAF] drop-shadow-sm tracking-wide max-w-md"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
              >
                Tomorrow is another chance to smile, and I'll be here waiting for you. 🌷
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome Message */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div 
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none space-y-6 px-6"
            >
              <p className="text-3xl md:text-4xl font-serif text-[#5A504C] drop-shadow-md tracking-widest text-center" style={{ textShadow: '0 2px 10px rgba(255,255,255,0.7)' }}>
                Welcome, babbbeee. 🌷
              </p>
              <div className="text-[#6B615C] font-serif text-sm md:text-base text-center leading-relaxed tracking-wide drop-shadow-sm max-w-lg" style={{ textShadow: '0 2px 8px rgba(255,255,255,0.7)' }}>
                <p>Stay here for as long as you'd like, there's no rush. 🤍</p>
                <p className="mt-3">Wander around, enjoy the calm... and don't forget to tap the tulips. They each have a little message waiting for you. 🌷✨</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page 3 Transition Button */}
        <AnimatePresence>
          {showButton && !isBlurred && !isNightMode && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute bottom-[10%] left-0 w-full z-40 flex justify-center items-center pointer-events-none"
            >
              <button
                ref={buttonRef}
                onClick={handleTransitionClick}
                className="pointer-events-auto px-8 py-3 rounded-full font-serif text-sm md:text-base tracking-widest text-[#6B615C] bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:bg-white/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500"
              >
                Come, let's rest together 🤍
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page 4 Transition Button (Night Mode) */}
        <AnimatePresence>
          {showPage4Button && isNightMode && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute bottom-[10%] left-0 w-full z-40 flex justify-center items-center pointer-events-none"
            >
              <button
                onClick={handleTransitionToPage4}
                className="pointer-events-auto px-8 py-3 rounded-full font-serif text-sm md:text-base tracking-widest text-[#E8E2D5] bg-black/40 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:bg-black/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-500"
              >
                There's something I want to tell you before you sleep... 💌
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

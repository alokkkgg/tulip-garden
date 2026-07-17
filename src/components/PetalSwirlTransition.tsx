import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

interface PetalSwirlTransitionProps {
  startX: number;
  startY: number;
  onCovered: () => void;
  onRevealing: () => void;
  onComplete: () => void;
}

export const PetalSwirlTransition: React.FC<PetalSwirlTransitionProps> = ({ startX, startY, onCovered, onRevealing, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const singlePetalRef = useRef<HTMLDivElement>(null);
  const swirlGroupRef = useRef<HTMLDivElement>(null);
  const speedLinesRef = useRef<HTMLDivElement>(null);
  const massivePetalRef = useRef<HTMLDivElement>(null);

  // Pre-calculate positions to avoid layout thrashing during animation setup
  const petalData = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => {
      const angle = (i / 25) * Math.PI * 2;
      // Start further out, bring them in
      const radius = 60 + Math.random() * 40; 
      return {
        id: i,
        initialX: `calc(50vw + ${Math.cos(angle) * radius}vw)`,
        initialY: `calc(50vh + ${Math.sin(angle) * radius}vh)`,
        color: Math.random() > 0.5 ? '#FFD1DC' : '#FFB7C5'
      };
    });
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    gsap.set(singlePetalRef.current, {
      x: startX - 15,
      y: startY,
      scale: 0,
      rotation: 0,
      opacity: 0
    });

    tl
      // Single petal blooms out of button
      .to(singlePetalRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" })
      // Single petal flies up. As soon as it starts flying, swirl begins.
      .to(singlePetalRef.current, {
        y: "-=30vh",
        x: "+=5vw",
        rotation: 120,
        duration: 2,
        ease: "power1.inOut"
      }, "+=0.2")
      
      // Speed lines fake the upward camera immediately as petal rises
      .to(speedLinesRef.current, {
        y: "100vh",
        opacity: 0.4,
        duration: 3,
        ease: "power2.inOut"
      }, "-=1.8")

      // The Swirl starts practically immediately as the petal rises to avoid dead time
      .to(swirlGroupRef.current, { opacity: 1, duration: 0.5 }, "-=2.0")
      .to(".swirl-petal", {
        scale: () => 1 + Math.random() * 1.5,
        opacity: () => 0.8 + Math.random() * 0.2,
        rotation: () => Math.random() * 720,
        x: "50vw",
        y: "50vh",
        duration: 2.5,
        stagger: {
          each: 0.015,
          from: "random"
        },
        ease: "power3.inOut"
      }, "-=2.0")

      // The massive petal scales up to guarantee perfect soft coverage
      .to(massivePetalRef.current, {
        scale: 40,
        opacity: 1,
        rotation: 180,
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
          onCovered();
        }
      }, "-=1.0")

      // Hold coverage.
      .to({}, { 
        duration: 0.8,
        onComplete: () => {
          onRevealing(); // Garden wakes up right as this ends
        }
      })

      // The Clearing
      .to(massivePetalRef.current, { opacity: 0, scale: 50, duration: 3.5, ease: "power2.inOut" })
      .to(".swirl-petal", {
        scale: () => 0.2 + Math.random() * 0.5,
        opacity: 0,
        x: () => `${-20 + Math.random() * 140}vw`,
        y: () => `${-20 + Math.random() * 140}vh`,
        duration: 3.5,
        ease: "power2.inOut",
        stagger: {
          each: 0.01,
          from: "center"
        }
      }, "-=3.5")
      .to(singlePetalRef.current, { opacity: 0, duration: 1 }, "-=3.5");

    // Continuous rotation for the swirl group (GPU accelerated transform)
    gsap.to(swirlGroupRef.current, {
      rotation: 360,
      duration: 12,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center"
    });

  }, [startX, startY, onCovered, onRevealing, onComplete]);

  // NO blur filter on these petals to ensure 60FPS
  const swirlElements = petalData.map((data) => (
    <div
      key={`swirl-${data.id}`}
      className="swirl-petal absolute w-16 h-16 rounded-tr-full rounded-bl-full will-change-transform"
      style={{
        left: data.initialX,
        top: data.initialY,
        opacity: 0,
        scale: 0,
        transformOrigin: 'center center',
        backgroundColor: data.color,
        // Instead of CSS blur, we use solid shapes. If they overlap fast, it looks fine.
      }}
    />
  ));

  const speedLines = Array.from({ length: 15 }).map((_, i) => (
    <div 
      key={`streak-${i}`}
      className="absolute bg-gradient-to-b from-transparent via-white to-transparent will-change-transform"
      style={{
        left: `${Math.random() * 100}vw`,
        top: `${-50 - Math.random() * 50}vh`,
        width: `${1 + Math.random() * 3}px`,
        height: `${20 + Math.random() * 40}vh`,
        opacity: 0.2 + Math.random() * 0.3
      }}
    />
  ));

  return (
    <div ref={containerRef} className="absolute inset-0 z-[100] pointer-events-none overflow-hidden">
      <div ref={speedLinesRef} className="absolute inset-0 top-[-100vh] h-[200vh] opacity-0 will-change-transform">
        {speedLines}
      </div>
      
      {/* We can safely blur the single petal since it's just one element */}
      <div 
        ref={singlePetalRef} 
        className="absolute w-12 h-12 rounded-tr-full rounded-bl-full bg-[#FFD1DC] will-change-transform z-30" 
      />
      
      {/* The massive petal handles the soft background cover, so the 60 solid petals blend into it */}
      <div 
        ref={massivePetalRef}
        className="absolute top-1/2 left-1/2 w-[20vw] h-[20vw] -ml-[10vw] -mt-[10vw] rounded-tr-full rounded-bl-full bg-[#FDF0F3] z-10 opacity-0 will-change-transform"
        style={{ filter: 'blur(30px)' }}
      />
      
      <div ref={swirlGroupRef} className="absolute inset-0 opacity-0 z-20 will-change-transform">
        {swirlElements}
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ButterflyProps {
  isActive: boolean;
  playFlutter?: () => void;
}

export const Butterfly: React.FC<ButterflyProps> = ({ isActive, playFlutter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftWingRef = useRef<SVGPathElement>(null);
  const rightWingRef = useRef<SVGPathElement>(null);

  // We use a ref for the timeline so we can kill/override it on tap
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current || !leftWingRef.current || !rightWingRef.current) {
      gsap.killTweensOf([containerRef.current, leftWingRef.current, rightWingRef.current]);
      if (timelineRef.current) timelineRef.current.kill();
      return;
    }

    const container = containerRef.current;
    const leftWing = leftWingRef.current;
    const rightWing = rightWingRef.current;

    let flapTween: gsap.core.Tween;

    const startFlapping = (fast: boolean) => {
      if (flapTween) flapTween.kill();
      
      const duration = fast ? 0.08 : 0.4;
      const angle = fast ? 60 : 30;

      flapTween = gsap.to([leftWing, rightWing], {
        rotationY: (i) => i === 0 ? angle : -angle,
        transformOrigin: (i) => i === 0 ? "right center" : "left center",
        duration: duration,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    };

    const animateFlight = () => {
      startFlapping(true); // Fly fast

      // Start off screen left or right
      const startLeft = Math.random() > 0.5;
      gsap.set(container, {
        x: startLeft ? "-10vw" : "110vw",
        y: "80vh",
        scale: 0.3 + Math.random() * 0.2,
        opacity: 0,
        rotation: startLeft ? 15 : -15
      });

      // Pick a random landing spot
      const landX = 30 + Math.random() * 40;
      const landY = 40 + Math.random() * 30;

      const tl = gsap.timeline({
        onComplete: () => {
          startFlapping(false); // Rest and flap slowly
          
          // Stay rested for a while, then fly again
          tl.to({}, { duration: 4 + Math.random() * 6 });
          
          tl.call(() => {
            startFlapping(true);
          });

          const exitLeft = Math.random() > 0.5;
          tl.to(container, {
            x: exitLeft ? "-10vw" : "110vw",
            y: "-10vh",
            opacity: 0,
            duration: 5 + Math.random() * 4,
            ease: "power1.in"
          });

          tl.call(() => {
            setTimeout(animateFlight, 15000 + Math.random() * 20000);
          });
        }
      });
      timelineRef.current = tl;

      tl.to(container, {
        x: `${landX}vw`,
        y: `${landY}vh`,
        opacity: 1,
        duration: 4 + Math.random() * 3,
        ease: "sine.inOut",
      });
    };

    // Initial delay
    const timer = setTimeout(animateFlight, 3000);

    return () => {
      clearTimeout(timer);
      gsap.killTweensOf([container, leftWing, rightWing]);
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [isActive]);

  const handleTap = () => {
    if (!isActive || !containerRef.current || !timelineRef.current) return;
    
    if (playFlutter) playFlutter();

    // Kill current timeline (resting or flying)
    timelineRef.current.kill();

    // Get current position
    const currentX = gsap.getProperty(containerRef.current, "x") as string;
    const currentY = gsap.getProperty(containerRef.current, "y") as string;
    
    // Parse vw/vh to raw numbers approx
    const numX = parseFloat(currentX);
    const numY = parseFloat(currentY);

    const tl = gsap.timeline();
    timelineRef.current = tl;

    // Fast flapping
    gsap.killTweensOf([leftWingRef.current, rightWingRef.current]);
    gsap.to([leftWingRef.current, rightWingRef.current], {
      rotationY: (i) => i === 0 ? 70 : -70,
      transformOrigin: (i) => i === 0 ? "right center" : "left center",
      duration: 0.05,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

    // Elegant circle around the tap point
    tl.to(containerRef.current, {
      motionPath: {
        path: [
          { x: `${numX - 5}vw`, y: `${numY - 10}vh` },
          { x: `${numX}vw`, y: `${numY - 15}vh` },
          { x: `${numX + 5}vw`, y: `${numY - 10}vh` },
          { x: `${numX}vw`, y: `${numY}vh` }, // back to center
        ],
        curviness: 1.5,
      },
      duration: 2,
      ease: "sine.inOut"
    });

    // Then pick a new random spot to land
    const landX = 20 + Math.random() * 60;
    const landY = 30 + Math.random() * 40;

    tl.to(containerRef.current, {
      x: `${landX}vw`,
      y: `${landY}vh`,
      duration: 3,
      ease: "power2.out",
      onComplete: () => {
        // Slow flap
        gsap.killTweensOf([leftWingRef.current, rightWingRef.current]);
        gsap.to([leftWingRef.current, rightWingRef.current], {
          rotationY: (i) => i === 0 ? 30 : -30,
          transformOrigin: (i) => i === 0 ? "right center" : "left center",
          duration: 0.4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut"
        });

        // Eventually fly away
        tl.to({}, { duration: 5 });
        tl.call(() => {
          gsap.to([leftWingRef.current, rightWingRef.current], {
            rotationY: (i) => i === 0 ? 60 : -60,
            duration: 0.08,
            yoyo: true,
            repeat: -1
          });
        });
        tl.to(containerRef.current, {
          x: "110vw",
          y: "-10vh",
          opacity: 0,
          duration: 5,
          ease: "power1.in"
        });
      }
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute z-[30] opacity-0 cursor-pointer pointer-events-auto" 
      style={{ width: '45px', height: '45px' }}
      onClick={handleTap}
    >
      {/* Premium Butterfly SVG */}
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]">
        <g transform="translate(50, 50)">
          {/* Antennae */}
          <path d="M0,-15 Q-5,-25 -10,-22" fill="none" stroke="#4A4543" strokeWidth="0.8" />
          <path d="M0,-15 Q5,-25 10,-22" fill="none" stroke="#4A4543" strokeWidth="0.8" />
          
          {/* Body */}
          <ellipse cx="0" cy="0" rx="2.5" ry="16" fill="#3D3836" />
          
          {/* Left Wing Group */}
          <g ref={leftWingRef}>
            {/* Top Wing */}
            <path d="M-1,-8 C-25,-35 -48,-15 -40,5 C-30,20 -15,10 -1,-2 Z" fill="#FFF8FA" />
            <path d="M-1,-8 C-25,-35 -48,-15 -40,5 C-30,20 -15,10 -1,-2 Z" fill="none" stroke="#F0E6E8" strokeWidth="1" />
            {/* Bottom Wing */}
            <path d="M-1,-2 C-15,15 -35,35 -20,40 C-10,42 -5,25 -1,8 Z" fill="#FFF8FA" />
            <path d="M-1,-2 C-15,15 -35,35 -20,40 C-10,42 -5,25 -1,8 Z" fill="none" stroke="#F0E6E8" strokeWidth="1" />
            {/* Premium detail spots */}
            <circle cx="-25" cy="-5" r="2" fill="#E6D3D8" />
            <circle cx="-15" cy="25" r="1.5" fill="#E6D3D8" />
          </g>
          
          {/* Right Wing Group */}
          <g ref={rightWingRef}>
            {/* Top Wing */}
            <path d="M1,-8 C25,-35 48,-15 40,5 C30,20 15,10 1,-2 Z" fill="#FFF8FA" />
            <path d="M1,-8 C25,-35 48,-15 40,5 C30,20 15,10 1,-2 Z" fill="none" stroke="#F0E6E8" strokeWidth="1" />
            {/* Bottom Wing */}
            <path d="M1,-2 C15,15 35,35 20,40 C10,42 5,25 1,8 Z" fill="#FFF8FA" />
            <path d="M1,-2 C15,15 35,35 20,40 C10,42 5,25 1,8 Z" fill="none" stroke="#F0E6E8" strokeWidth="1" />
            {/* Premium detail spots */}
            <circle cx="25" cy="-5" r="2" fill="#E6D3D8" />
            <circle cx="15" cy="25" r="1.5" fill="#E6D3D8" />
          </g>
        </g>
      </svg>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Birds: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      gsap.killTweensOf(".bird-group");
      return;
    }

    const animateFlock = () => {
      // Start from off-screen left or right
      const startLeft = Math.random() > 0.5;
      const startX = startLeft ? -20 : 120;
      const endX = startLeft ? 120 : -20;
      const startY = 10 + Math.random() * 30; // 10vh to 40vh
      
      gsap.fromTo(".bird-group", 
        { 
          x: `${startX}vw`, 
          y: `${startY}vh`,
          scale: 0.15 + Math.random() * 0.2,
          opacity: 0
        },
        {
          x: `${endX}vw`,
          y: `${startY - 10 + Math.random() * 20}vh`,
          opacity: 0.4, // Keep them subtle
          duration: 25 + Math.random() * 15, // Very slow, distant
          ease: "none",
          onComplete: () => {
            // Wait a bit, then fly again
            setTimeout(animateFlock, 10000 + Math.random() * 20000);
          }
        }
      );
    };

    // Initial delay before first flock appears
    const timer = setTimeout(animateFlock, 5000);

    return () => {
      clearTimeout(timer);
      gsap.killTweensOf(".bird-group");
    };
  }, [isActive]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      <div className="bird-group absolute opacity-0" style={{ width: '100px', height: '50px' }}>
        {/* Simple V-shaped flock of birds */}
        <svg viewBox="0 0 100 50" fill="none" stroke="#877D76" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full opacity-60">
          <path d="M50 25 Q45 15 35 20 Q45 15 50 25 Z" fill="#877D76" />
          <path d="M50 25 Q55 15 65 20 Q55 15 50 25 Z" fill="#877D76" />
          
          <path d="M30 15 Q25 5 15 10 Q25 5 30 15 Z" fill="#877D76" />
          <path d="M30 15 Q35 5 45 10 Q35 5 30 15 Z" fill="#877D76" />

          <path d="M70 15 Q65 5 55 10 Q65 5 70 15 Z" fill="#877D76" />
          <path d="M70 15 Q75 5 85 10 Q75 5 70 15 Z" fill="#877D76" />
        </svg>
      </div>
    </div>
  );
};

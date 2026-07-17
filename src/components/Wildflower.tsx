import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface WildflowerProps {
  x: string;
  bottom: string;
  scale: number;
  delay: number;
  zIndex: number;
  blur?: number;
}

export const Wildflower: React.FC<WildflowerProps> = ({ x, bottom, scale, delay, zIndex, blur = 0 }) => {
  const stemRef = useRef<SVGGElement>(null);
  
  useEffect(() => {
    if (!stemRef.current) return;
    
    // Very subtle, quick rustling motion for tiny flowers
    gsap.to(stemRef.current, {
      rotation: -3 + Math.random() * 6,
      transformOrigin: "bottom center",
      duration: 2 + Math.random(),
      delay: delay,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  }, [delay]);

  return (
    <div 
      className="absolute pointer-events-none" 
      style={{ 
        left: x, 
        bottom: bottom,
        transform: `scale(${scale})`, 
        transformOrigin: 'bottom center',
        zIndex: zIndex,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        opacity: blur > 0 ? 0.6 : 0.9
      }}
    >
      <svg width="20" height="40" viewBox="0 0 20 40" className="overflow-visible">
        <g ref={stemRef}>
          <path d="M10,40 Q15,20 10,5" stroke="var(--color-stem-green-dark)" strokeWidth="1" fill="none" opacity="0.7"/>
          {/* Tiny petals */}
          <circle cx="10" cy="5" r="2.5" fill="white" opacity="0.95" filter="blur(0.2px)"/>
          <circle cx="7" cy="3" r="2.5" fill="white" opacity="0.95" filter="blur(0.2px)"/>
          <circle cx="13" cy="3" r="2.5" fill="white" opacity="0.95" filter="blur(0.2px)"/>
          <circle cx="7" cy="7" r="2.5" fill="white" opacity="0.95" filter="blur(0.2px)"/>
          <circle cx="13" cy="7" r="2.5" fill="white" opacity="0.95" filter="blur(0.2px)"/>
          {/* Center */}
          <circle cx="10" cy="5" r="1" fill="#FFD700" opacity="0.8"/>
        </g>
      </svg>
    </div>
  );
};

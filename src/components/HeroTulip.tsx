import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export const HeroTulip: React.FC = () => {
  const stemRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stemRef.current || !containerRef.current) return;

    // Gentle constant sway
    gsap.to(stemRef.current, {
      rotation: 3,
      transformOrigin: "bottom center",
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut" 
    });

    // Tiny ambient float on the whole container
    gsap.to(containerRef.current, {
      y: "-1vh",
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute pointer-events-none drop-shadow-[0_15px_30px_rgba(255,183,197,0.4)]" 
      style={{ 
        left: '50%',
        bottom: '15%',
        transform: 'translateX(-50%)',
        width: '120px', // Larger hero scale
        height: '40vh',
        zIndex: 5
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 400" className="overflow-visible">
        <defs>
          <linearGradient id="heroStemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A8C3A6" />
            <stop offset="100%" stopColor="#8FAD8D" />
          </linearGradient>
          <linearGradient id="heroPetalGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF0F5" />
            <stop offset="100%" stopColor="#FFB7C5" />
          </linearGradient>
          <linearGradient id="heroPetalGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD1DC" />
            <stop offset="100%" stopColor="#FF9EAF" />
          </linearGradient>
          <filter id="heroGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g ref={stemRef}>
          {/* Stem & Leaves */}
          <path d="M50,400 Q40,250 50,80" stroke="url(#heroStemGrad)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M50,320 Q80,260 75,180 Q60,240 50,320" fill="url(#heroStemGrad)" opacity="0.95" />
          <path d="M50,350 Q20,280 20,200 Q40,270 50,350" fill="url(#heroStemGrad)" opacity="0.95" />
          
          {/* Hero Bloom */}
          <g transform="translate(50, 80) scale(1.4) rotate(-3)">
            <path d="M-12,5 C-25,-15 -18,-45 0,-55 C18,-45 25,-15 12,5 Z" fill="url(#heroPetalGradBack)" filter="url(#heroGlow)"/>
            <path d="M-22,15 C-40,-5 -30,-35 -8,-45 C5,-25 -5,5 -22,15 Z" fill="url(#heroPetalGradBack)" opacity="0.9"/>
            <path d="M22,15 C40,-5 30,-35 8,-45 C-5,-25 5,5 22,15 Z" fill="url(#heroPetalGradBack)" opacity="0.9"/>
            <path d="M-18,25 C-28,-2 -12,-35 0,-45 C12,-35 28,-2 18,25 C8,32 -8,32 -18,25 Z" fill="url(#heroPetalGradFront)" filter="url(#heroGlow)"/>
            <path d="M-8,28 C-12,8 0,-25 0,-25 C0,-25 12,8 8,28 C4,32 -4,32 -8,28 Z" fill="url(#heroPetalGradFront)" />
          </g>
        </g>
      </svg>
    </div>
  );
};

import React, { useState, useRef, useMemo } from 'react';
import gsap from 'gsap';

interface TulipProps {
  x: string;
  bottom: string;
  scale: number;
  delay: number;
  rotationOffset: number;
  zIndex: number;
  blur?: number;
  opacity?: number;
  hueRotate?: number;
  isActive?: boolean;
  isNightMode?: boolean;
  playRustle?: () => void;
}

const MESSAGES = [
  "One flower for your smile.",
  "Take all the time you need.",
  "Tomorrow can wait.",
  "I'm quietly cheering for you.",
  "You deserve to rest.",
  "You're doing enough just by resting.",
  "I'm proud of you.",
  "Everything will be okay.",
  "Breathe in, breathe out.",
  "You are loved.",
  "It's okay to just exist today.",
  "Softness is a strength.",
  "Rest is productive.",
  "You don't have to be perfect.",
  "Let the world wait."
];

export const Tulip: React.FC<TulipProps> = React.memo(({ 
  x, bottom, scale, delay, rotationOffset, zIndex, blur = 0, opacity = 1, hueRotate = 0, isActive = true, playRustle 
}) => {
  const stemRef = useRef<SVGGElement>(null);
  const petalGroupRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [bloomed, setBloomed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isAnimatingMessage, setIsAnimatingMessage] = useState(false);

  const uniqueImperfection = useMemo(() => {
    const rand = Math.random();
    let swayClass = '';
    let swayAmount = 0;
    if (rand < 0.3) {
      swayClass = 'organic-sway';
      swayAmount = 2 + Math.random();
    } else if (rand < 0.7) {
      swayClass = 'organic-sway';
      swayAmount = 0.5 + Math.random() * 0.5; // Almost still
    }
    // remaining 30% have no swayClass (only react to interaction)

    return {
      petalScale: 0.85 + Math.random() * 0.3,
      leafBend: -15 + Math.random() * 30,
      stemCurve: 35 + Math.random() * 30, 
      durationMultiplier: 0.7 + Math.random() * 0.6,
      flowerTilt: -8 + Math.random() * 16,
      baseRotation: rotationOffset,
      swayClass,
      swayAmount
    };
  }, [rotationOffset]);

  const handleTap = () => {
    if (!isActive || !petalGroupRef.current || isAnimatingMessage) return;
    
    setIsAnimatingMessage(true);

    // Play subtle rustle immediately
    if (playRustle) playRustle();

    // The organic pause (200ms) before the bloom nod
    setTimeout(() => {
      // Re-trigger the SVG bloom class/filters
      setBloomed(true); 
      
      // Select a random message (repetition allowed naturally)
      setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
      
      // Force unmount/remount to restart animation by toggling state
      setShowMessage(false);
      setTimeout(() => setShowMessage(true), 10);

      // A gentle nod animation
      gsap.fromTo(petalGroupRef.current, 
        { scale: uniqueImperfection.petalScale },
        {
          scale: uniqueImperfection.petalScale * 1.15,
          duration: 2.5,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        }
      );

      // Clean up the message after 6 seconds (length of floatUpAndFade animation)
      setTimeout(() => {
        setShowMessage(false);
        setIsAnimatingMessage(false);
      }, 6000);

    }, 200);
  };

  const safeId = useMemo(() => x.replace(/[^a-z0-9]/gi, '') + Math.floor(Math.random()*1000), [x]);

  return (
    <div 
      ref={containerRef}
      className="absolute pointer-events-auto cursor-pointer" 
      onClick={handleTap}
      style={{ 
        left: x, 
        bottom: bottom,
        transform: `scale(${scale})`, 
        transformOrigin: 'bottom center',
        width: `${60 * uniqueImperfection.petalScale}px`,
        height: '45vh',
        zIndex: zIndex,
        filter: `${blur > 0 ? `blur(${blur}px)` : ''} hue-rotate(${hueRotate}deg)`,
        opacity: opacity
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 400" className="overflow-visible">
        <defs>
          <linearGradient id={`stemGrad-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A8C3A6" />
            <stop offset="100%" stopColor="#8FAD8D" />
          </linearGradient>
          <linearGradient id={`petalGradFront-${safeId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD1DC" />
            <stop offset="100%" stopColor="#FFB7C5" />
          </linearGradient>
          <linearGradient id={`petalGradBack-${safeId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFB7C5" />
            <stop offset="100%" stopColor="#FF9EAF" />
          </linearGradient>
          <filter id={`softBloom-${safeId}`}>
            <feGaussianBlur stdDeviation={bloomed ? "2" : "1"} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g style={{ transformOrigin: "bottom center", transform: `rotate(${uniqueImperfection.baseRotation}deg)` }}>
          <g 
            ref={stemRef}
            className={uniqueImperfection.swayClass}
            style={{
              '--sway-amount': `${uniqueImperfection.swayAmount}deg`,
              '--sway-duration': `${5 * uniqueImperfection.durationMultiplier}s`,
              '--sway-delay': `${delay}s`,
              transformOrigin: "bottom center"
            } as React.CSSProperties}
          >
            <path 
              d={`M50,400 Q${uniqueImperfection.stemCurve},250 50,80`} 
              stroke={`url(#stemGrad-${safeId})`} 
              strokeWidth="3.5" 
              fill="none" 
              strokeLinecap="round" 
            />
            <path d={`M50,320 Q${70 + uniqueImperfection.leafBend},260 75,180 Q60,240 50,320`} fill={`url(#stemGrad-${safeId})`} opacity="0.9" />
            <path d={`M50,350 Q${30 - uniqueImperfection.leafBend},280 20,200 Q40,270 50,350`} fill={`url(#stemGrad-${safeId})`} opacity="0.85" />
            
            <g ref={petalGroupRef} transform={`translate(50, 80) scale(${uniqueImperfection.petalScale}) rotate(${uniqueImperfection.flowerTilt})`}>
              {/* The Sunlight Catch (increases brightness when bloomed) */}
              {bloomed && (
                <circle cx="0" cy="-20" r="35" fill="rgba(255, 250, 230, 0.4)" filter="blur(10px)" opacity="0">
                  <animate attributeName="opacity" from="0" to="1" dur="2s" fill="freeze" />
                </circle>
              )}

              <path d="M-12,5 C-25,-15 -18,-45 0,-55 C18,-45 25,-15 12,5 Z" fill={`url(#petalGradBack-${safeId})`} filter={`url(#softBloom-${safeId})`}/>
              <path d="M-22,15 C-40,-5 -30,-35 -8,-45 C5,-25 -5,5 -22,15 Z" fill={`url(#petalGradBack-${safeId})`} opacity="0.85"/>
              <path d="M22,15 C40,-5 30,-35 8,-45 C-5,-25 5,5 22,15 Z" fill={`url(#petalGradBack-${safeId})`} opacity="0.85"/>
              <path d="M-18,25 C-28,-2 -12,-35 0,-45 C12,-35 28,-2 18,25 C8,32 -8,32 -18,25 Z" fill={`url(#petalGradFront-${safeId})`} filter={`url(#softBloom-${safeId})`}/>
              <path d="M-8,28 C-12,8 0,-25 0,-25 C0,-25 12,8 8,28 C4,32 -4,32 -8,28 Z" fill={`url(#petalGradFront-${safeId})`} opacity="0.95"/>
              
              {/* The Falling Petal (only appears and falls when bloomed) */}
              {bloomed && (
                <path d="M-8,28 C-12,8 0,-25 0,-25 C0,-25 12,8 8,28 C4,32 -4,32 -8,28 Z" fill={`url(#petalGradFront-${safeId})`} className="falling-petal" style={{ '--duration': '8s', '--delay': '0s', '--drift': '5' } as any} />
              )}
            </g>
          </g>
        </g>
      </svg>

      {/* The Comforting Message */}
      {showMessage && (
        <div className="absolute w-[200px] left-1/2 -ml-[100px] top-[-50px] text-center pointer-events-none">
          <p 
            className="text-[#6B615C] font-serif text-sm tracking-wide opacity-0 mix-blend-multiply"
            style={{ 
              animation: 'floatUpAndFade 6s ease-in-out forwards',
              textShadow: '0 0 4px rgba(255,255,255,0.8)' 
            }}
          >
            {message}
          </p>
        </div>
      )}
    </div>
  );
});

import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

export const PetalParticles: React.FC<{ isActive?: boolean }> = React.memo(({ isActive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const petals = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const size = 6 + (i % 3) * 2.5;
      const startX = Math.random() * 100;
      return {
        id: i,
        size,
        startX,
        duration: 15 + Math.random() * 10,
        delay: 2.0 + Math.random() * 15, // Lazy start at 2s
        drift: -5 + Math.random() * 15,
        rotate: Math.random() * 360
      };
    });
  }, []);

  // Pure JS pointer tracking for wind effect without React re-renders
  useEffect(() => {
    if (!containerRef.current || !isActive) return;

    let isDragging = false;

    const handlePointerDown = () => { isDragging = true; };
    const handlePointerUp = () => { 
      isDragging = false;
      // Drift back to center slowly when let go
      gsap.to(containerRef.current, {
        x: "0vw",
        duration: 8,
        ease: "sine.inOut",
        overwrite: "auto"
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      // Calculate a shift in vw based on pointer X
      const shiftVw = (e.clientX / window.innerWidth) * 100 - 50; 
      
      gsap.to(containerRef.current, {
        x: `${shiftVw * 0.8}vw`,
        duration: 2,
        ease: "power2.out",
        overwrite: "auto" // Override natural wind gusts while dragging
      });
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      gsap.killTweensOf(containerRef.current);
      return;
    }

    // Occasional wind gust applied to the entire container
    const triggerWind = () => {
      const gustStrength = 5 + Math.random() * 15; // move right by 5-20vw
      const gustDuration = 4 + Math.random() * 3;

      gsap.to(containerRef.current, {
        x: `+=${gustStrength}vw`,
        duration: gustDuration,
        ease: "power2.inOut",
        onComplete: () => {
          // Slow return to normal or just stay there (it's infinite falling anyway, so staying is fine, but let's drift back slowly)
          gsap.to(containerRef.current, {
            x: `-=${gustStrength * 0.8}vw`,
            duration: 10 + Math.random() * 10,
            ease: "sine.inOut"
          });
          
          setTimeout(triggerWind, 15000 + Math.random() * 25000);
        }
      });
    };

    const timer = setTimeout(triggerWind, 8000);
    return () => {
      clearTimeout(timer);
      gsap.killTweensOf(containerRef.current);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* The wind container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full will-change-transform">
        {petals.map((p) => (
          <div
            key={`fall-petal-${p.id}`}
            className="absolute top-[-10vh] falling-petal"
            style={{
              left: `${p.startX}vw`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50% 0 50% 50%',
              backgroundColor: '#FFD1DC',
              filter: 'drop-shadow(0 2px 4px rgba(255,183,197,0.4))',
              '--duration': `${p.duration}s`,
              '--delay': `${p.delay}s`,
              '--drift': p.drift,
              opacity: 0
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
});

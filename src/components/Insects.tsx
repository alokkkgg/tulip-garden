import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

export const Insects: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const insects = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({ id: i })), []);

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      gsap.killTweensOf(".insect");
      return;
    }

    insects.forEach((insect) => {
      const el = containerRef.current!.querySelector(`.insect-${insect.id}`);
      if (!el) return;

      const animateInsect = () => {
        gsap.to(el, {
          x: `+=${-30 + Math.random() * 60}`,
          y: `+=${-30 + Math.random() * 60}`,
          duration: 0.5 + Math.random() * 1.5,
          ease: "sine.inOut",
          onComplete: animateInsect
        });
      };

      // Set initial positions clustered around the flowers (bottom half)
      gsap.set(el, {
        x: Math.random() * window.innerWidth,
        y: (window.innerHeight * 0.5) + Math.random() * (window.innerHeight * 0.5),
        opacity: 0
      });

      // Fade in and start
      gsap.to(el, { opacity: 0.4 + Math.random() * 0.4, duration: 2, delay: Math.random() * 5 });
      animateInsect();
    });

    return () => gsap.killTweensOf(".insect");
  }, [isActive, insects]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-[12] overflow-hidden">
      {insects.map((insect) => (
        <div
          key={`insect-${insect.id}`}
          className={`insect insect-${insect.id} absolute w-1 h-1 bg-[#4A4543] rounded-full mix-blend-multiply opacity-0`}
          style={{ filter: 'blur(0.5px)' }}
        />
      ))}
    </div>
  );
};

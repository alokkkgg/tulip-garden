import React, { useMemo } from 'react';

export const Pollen: React.FC<{ isActive: boolean }> = React.memo(({ isActive }) => {
  const pollenSpecs = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const size = 1 + Math.random() * 2;
      return {
        id: i,
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        width: `${size}px`,
        height: `${size}px`,
        xDir: -20 + Math.random() * 40,
        yDir: 30 + Math.random() * 50, // Mostly drifting up
        duration: 10 + Math.random() * 20,
        delay: 1.0 + Math.random() * 10, // Lazy start at 1000ms
        opacityBase: 0.2 + Math.random() * 0.4
      };
    });
  }, []);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[15] overflow-hidden mix-blend-screen">
      {pollenSpecs.map((spec) => (
        <div
          key={`pollen-${spec.id}`}
          className="absolute bg-[#FFF8DC] rounded-full ambient-dust"
          style={{
            left: spec.left,
            top: spec.top,
            width: spec.width,
            height: spec.height,
            '--x-dir': spec.xDir,
            '--y-dir': spec.yDir,
            '--duration': `${spec.duration}s`,
            '--delay': `${spec.delay}s`,
            opacity: spec.opacityBase,
            boxShadow: '0 0 4px rgba(255,248,220,0.8)'
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});

import React, { useMemo } from 'react';

interface FirefliesProps {
  isActive: boolean;
}

export const Fireflies: React.FC<FirefliesProps> = React.memo(({ isActive }) => {
  const firefliesData = useMemo(() => {
    // Reduced from 30 to 10 to save rendering budget (User request)
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 60 + Math.random() * 30, // Bottom half of screen
      size: 2 + Math.random() * 3,
      delay: 1.5 + Math.random() * 5, // Lazy start at 1500ms
      duration: 4 + Math.random() * 6,
      xShift: -20 + Math.random() * 40,
      yShift: -20 + Math.random() * 40,
      minOpacity: 0.2 + Math.random() * 0.3
    }));
  }, []);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {firefliesData.map((ff) => (
        <div 
          key={ff.id}
          className="absolute rounded-full bg-[#FFE48A] shadow-[0_0_8px_2px_rgba(255,228,138,0.8)] firefly-float opacity-0"
          style={{
            left: `${ff.x}%`,
            top: `${ff.y}%`,
            width: `${ff.size}px`,
            height: `${ff.size}px`,
            '--duration': `${ff.duration}s`,
            '--delay': `${ff.delay}s`,
            '--x-shift': `${ff.xShift}px`,
            '--y-shift': `${ff.yShift}px`,
            '--min-opacity': ff.minOpacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});

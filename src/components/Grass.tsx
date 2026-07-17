import React, { useMemo } from 'react';

interface GrassProps {
  depth: number;
  color: string;
  speed: number;
  yOffset: string;
  blur?: number;
  opacity?: number;
  isActive?: boolean;
}

export const Grass: React.FC<GrassProps> = React.memo(({ depth, color, speed, yOffset, blur = 0, opacity = 1, isActive = true }) => {
  // Base path data for hills/waves
  const pathData = useMemo(() => {
    const points = [];
    const segments = 10; // More segments for a wave ripple effect
    const width = 120;
    
    points.push(`M0,50`);
    
    for (let i = 0; i <= segments; i++) {
      const x = (i * width) / segments;
      // Flatter hills for depth, higher hills up front
      const y = 40 + Math.sin(i * 1.2 + depth * 5) * Math.max(5, (20 - depth * 2)); 
      const cx = x - (width / segments) / 2;
      const cy = y - 5 + Math.cos(i * 1.5 + depth) * 8;
      
      if (i > 0) {
        points.push(`Q${cx},${cy} ${x},${y}`);
      }
    }
    
    points.push(`L${width},100 L0,100 Z`);
    return points.join(' ');
  }, [depth]);

  if (!isActive) return null;

  return (
    <div 
      className="absolute left-[-10%] w-[120%] h-[40vh] pointer-events-none transform-gpu" 
      style={{ 
        top: yOffset, 
        zIndex: 20 - depth,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        opacity: opacity
      }}
    >
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 120 100" className="drop-shadow-sm">
        <path 
          className="grass-wave"
          d={pathData}
          fill={color} 
          style={{ 
            '--scale-y': 1.03 - depth * 0.005,
            '--duration': `${(3.5 / speed) * 2}s`, 
            '--delay': `${depth * 0.5 + 0.7}s` // Lazy start stagger
          } as React.CSSProperties}
        />
      </svg>
    </div>
  );
});

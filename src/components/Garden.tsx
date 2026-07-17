import React, { useMemo } from 'react';
import { Grass } from './Grass';
import { Tulip } from './Tulip';
import { PetalParticles } from './PetalParticles';
import { Butterfly } from './Butterfly';
import { Wildflower } from './Wildflower';
import { Birds } from './Birds';
import { Pollen } from './Pollen';
import { Insects } from './Insects';
import { Fireflies } from './Fireflies';

interface GardenProps {
  isActive?: boolean;
  isNightMode?: boolean;
  playRustle?: () => void;
  playFlutter?: () => void;
}

export const Garden: React.FC<GardenProps> = ({ isActive = true, isNightMode = false, playRustle, playFlutter }) => {
  // Generate 50 naturally grouped tulips across different depth layers
  const tulips = useMemo(() => {
    const items: any[] = [];
    // Groups of tulips (clusters)
    const clusters = [
      { cx: 12, width: 25, count: 12, baseDepth: 4 }, // Far left cluster
      { cx: 88, width: 25, count: 14, baseDepth: 4 }, // Far right cluster
      { cx: 30, width: 20, count: 8, baseDepth: 3 },  // Mid-left
      { cx: 70, width: 20, count: 10, baseDepth: 3 }, // Mid-right
      { cx: 50, width: 15, count: 8, baseDepth: 1 }   // Center foreground
    ];

    let id = 0;
    clusters.forEach(cluster => {
      for (let i = 0; i < cluster.count; i++) {
        // Normal distribution around center
        const u = 1 - Math.random(); // Converting [0,1) to (0,1]
        const v = Math.random();
        const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        
        let xPos = cluster.cx + z * (cluster.width / 4);
        xPos = Math.max(2, Math.min(98, xPos));
        
        const depthVariance = Math.random() > 0.5 ? 0 : 1;
        const depth = cluster.baseDepth + depthVariance; // 1 to 5
        
        // Perspective: items further back appear higher on the screen Y axis
        const bottomOffset = 5 - (depth * 2); 
        
        items.push({
          id: id++,
          x: `${xPos}vw`,
          bottom: `${bottomOffset}vh`,
          scale: 1.25 - (depth * 0.15) + (Math.random() * 0.1), // Further = smaller
          delay: Math.random() * 5,
          rotationOffset: -12 + Math.random() * 24,
          zIndex: 20 - depth,
          blur: depth > 3 ? (depth - 3) * 1.5 : 0, 
          opacity: depth > 3 ? 1 - (depth - 3) * 0.15 : 1, 
          hueRotate: -25 + Math.random() * 50 
        });
      }
    });
    
    // Sort by zIndex to render properly
    return items.sort((a, b) => a.zIndex - b.zIndex);
  }, []);

  // Generate scattered tiny white wildflowers
  const wildflowers = useMemo(() => {
    const items: any[] = [];
    for (let i = 0; i < 50; i++) {
      const depth = 1 + Math.floor(Math.random() * 5); // 1 to 5
      items.push({
        id: i,
        x: `${2 + Math.random() * 96}vw`,
        bottom: `${3 + (5 - depth) * 3}vh`, 
        scale: 0.7 - (depth * 0.1) + Math.random() * 0.4,
        delay: Math.random() * 3,
        zIndex: 20 - depth,
        blur: depth > 3 ? (depth - 2) * 1.0 : 0
      });
    }
    return items;
  }, []);

  return (
    <div className="relative w-full h-full z-10">
      {/* Deepest Atmospheric Background Grass (Haze/Blur) */}
      <Grass depth={6} color="#E8EDE5" speed={0.2} yOffset="55%" blur={8} opacity={0.4} />
      <Grass depth={5} color="#DFE6DC" speed={0.3} yOffset="62%" blur={4} opacity={0.6} />
      <Grass depth={4} color="#D0D9CD" speed={0.4} yOffset="70%" blur={2} opacity={0.8} />
      
      {/* Mid-Background Grass */}
      <Grass depth={3} color="#C4D4C0" speed={0.6} yOffset="78%" blur={0.5} />
      <Grass depth={2} color="#B4CBAE" speed={0.8} yOffset="84%" />

      {/* Atmospheric Background Life */}
      {!isNightMode && <Birds isActive={isActive} />}

      {/* Wildflowers */}
      {wildflowers.map(wf => (
        <Wildflower key={`wf-${wf.id}`} {...wf} />
      ))}

      {/* Tulips */}
      {tulips.map(tulip => (
        <Tulip key={`tulip-${tulip.id}`} {...tulip} isActive={isActive} isNightMode={isNightMode} playRustle={playRustle} />
      ))}

      {/* Foreground Grass */}
      <Grass depth={1} color="#A8C3A6" speed={1.0} yOffset="90%" />
      <Grass depth={0} color="#8FAD8D" speed={1.2} yOffset="95%" />

      {/* Atmosphere Micro-Life */}
      {!isNightMode && (
        <>
          <Pollen isActive={isActive} />
          <Insects isActive={isActive} />
          <Butterfly isActive={isActive} playFlutter={playFlutter} />
        </>
      )}

      {/* Nighttime Atmosphere Life */}
      <Fireflies isActive={isActive && isNightMode} />
      
      <PetalParticles isActive={isActive} />
    </div>
  );
};

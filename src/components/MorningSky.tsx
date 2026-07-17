import React from 'react';

interface MorningSkyProps {
  isActive: boolean;
  isNightMode: boolean;
}

export const MorningSky: React.FC<MorningSkyProps> = React.memo(({ isActive, isNightMode }) => {
  if (!isActive) return null;

  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden transition-opacity duration-3000"
      style={{ opacity: isNightMode ? 0 : 1 }}
    >
      
      {/* 1. Base Gradient Sky */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(to bottom, #F6FBFF 0%, #FDFBF7 50%, #FFF3EC 100%)'
        }}
      />
      
      {/* 2. Atmospheric Shift Overlay */}
      <div 
        className="absolute inset-0 w-full h-full opacity-30 light-breathe"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 248, 235, 0.4) 50%, rgba(255, 230, 215, 0.5) 100%)',
          mixBlendMode: 'overlay'
        }}
      />

      {/* 3. Soft Morning Sun */}
      <div 
        className="absolute top-[10%] left-[15%] w-[150px] h-[150px] rounded-full mix-blend-screen ambient-glow"
        style={{
          background: 'radial-gradient(circle, rgba(255, 249, 230, 0.8) 0%, rgba(255, 245, 210, 0.3) 40%, transparent 70%)',
          boxShadow: '0 0 80px 30px rgba(255, 240, 200, 0.4), 0 0 150px 60px rgba(255, 235, 180, 0.2)'
        }}
      />

      {/* 4. Clouds (CSS Animated for simple continuous drift, lazy started via delay) */}
      <div className="absolute inset-0 w-full h-full opacity-70">
        
        {/* Cloud 1 - Slowest, farthest back */}
        <div 
          className="cloud-drift" 
          style={{ '--duration': '60s', '--delay': '0.3s', top: '20%' } as React.CSSProperties}
        >
          <div className="w-[300px] h-[80px] bg-white rounded-full blur-[20px] opacity-40" />
        </div>

        {/* Cloud 2 - Mid ground */}
        <div 
          className="cloud-drift" 
          style={{ '--duration': '45s', '--delay': '-14.7s', top: '15%' } as React.CSSProperties}
        >
          <div className="w-[400px] h-[100px] bg-white rounded-full blur-[25px] opacity-30" />
        </div>

        {/* Cloud 3 - Foreground, fastest */}
        <div 
          className="cloud-drift" 
          style={{ '--duration': '35s', '--delay': '-24.7s', top: '35%' } as React.CSSProperties}
        >
          <div className="w-[250px] h-[70px] bg-white rounded-full blur-[15px] opacity-50" />
        </div>

        {/* Cloud 4 - Very high up, very slow */}
        <div 
          className="cloud-drift" 
          style={{ '--duration': '70s', '--delay': '-39.7s', top: '5%' } as React.CSSProperties}
        >
          <div className="w-[350px] h-[90px] bg-white rounded-full blur-[22px] opacity-35" />
        </div>

      </div>

    </div>
  );
});

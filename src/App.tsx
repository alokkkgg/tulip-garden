import React, { useState } from 'react';
import gsap from 'gsap';
import { Page1Intro } from './pages/Page1Intro';
import { Page2Garden } from './pages/Page2Garden';
import { Page3ComfortCorner } from './pages/Page3ComfortCorner';
import { Page4SecretLetter } from './pages/Page4SecretLetter';
import { PetalSwirlTransition } from './components/PetalSwirlTransition';

export type SceneState = 'page1' | 'transition' | 'page2_ready' | 'page2_active' | 'page3_transition' | 'page3_active' | 'page4_transition' | 'page4_active';

function App() {
  const [scene, setScene] = useState<SceneState>('page1');
  const [transitionStartCoords, setTransitionStartCoords] = useState({ x: 0, y: 0 });
  const [transitionComplete, setTransitionComplete] = useState(false);

  const handleTransitionStart = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTransitionStartCoords({ 
      x: rect.left + rect.width / 2, 
      y: rect.top + rect.height / 2 
    });
    setScene('transition');
  };

  const handleScreenCovered = () => {
    setScene('page2_ready');
  };

  const handleScreenRevealing = () => {
    setScene('page2_active');
  };

  const handleTransitionComplete = () => {
    setTransitionComplete(true);
  };

  const handleNavigateToPage3 = () => {
    setScene('page3_transition');
    setTimeout(() => {
      setScene('page3_active');
    }, 1000);
  };

  const handleNavigateToPage4 = () => {
    setScene('page4_transition');
    setTimeout(() => {
      setScene('page4_active');
    }, 4000); // Allow time for fade to black
  };

  const [isNightMode, setIsNightMode] = useState(false);

  React.useEffect(() => {
    const handleNightfall = () => {
      setIsNightMode(true);
    };
    window.addEventListener('nightfall-start', handleNightfall);
    return () => {
      window.removeEventListener('nightfall-start', handleNightfall);
    };
  }, []);

  const isPage2Mounted = scene !== 'page1' && scene !== 'transition';
  const isPage3Mounted = scene === 'page3_transition' || scene === 'page3_active';
  const isPage4Mounted = scene === 'page4_transition' || scene === 'page4_active';
  
  // The garden is blurred when Page 3 menu/tea is active, but NOT when night mode is active (so we can see the night sky)
  const shouldBlurGarden = isPage3Mounted && !isNightMode;

  const sceneRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleHugStart = () => {
      if (sceneRef.current) {
        gsap.to(sceneRef.current, {
          scale: 0.97,
          duration: 2,
          ease: "power2.inOut"
        });
      }
    };

    const handleHugEnd = () => {
      if (sceneRef.current) {
        gsap.to(sceneRef.current, {
          scale: 1.0,
          duration: 3,
          ease: "power2.inOut"
        });
      }
    };

    window.addEventListener('hug-start', handleHugStart);
    window.addEventListener('hug-end', handleHugEnd);

    return () => {
      window.removeEventListener('hug-start', handleHugStart);
      window.removeEventListener('hug-end', handleHugEnd);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FDFBF7]">
      
      {(scene === 'page1' || scene === 'transition') && (
        <Page1Intro 
          onTransitionStart={handleTransitionStart}
          isFadingOut={scene === 'transition'}
        />
      )}

      {/* Wrapping Page 2 and 3 so they can be globally scaled together during the hug */}
      <div ref={sceneRef} className="absolute inset-0 w-full h-full transform-gpu origin-center">
        {isPage2Mounted && (
          <Page2Garden 
            isActive={scene === 'page2_active'} 
            isTransitionComplete={transitionComplete}
            isBlurred={shouldBlurGarden}
            isNightMode={isNightMode}
            onNavigateToPage3={handleNavigateToPage3}
            onNavigateToPage4={handleNavigateToPage4}
          />
        )}

        {isPage3Mounted && !isPage4Mounted && (
          <div className="absolute inset-0 z-50 pointer-events-none">
            <Page3ComfortCorner isActive={scene === 'page3_active'} />
          </div>
        )}
      </div>

      {isPage4Mounted && (
        <div className="absolute inset-0 z-[60] pointer-events-auto">
          <Page4SecretLetter isActive={scene === 'page4_active'} />
        </div>
      )}

      {/* The Transition Overlay */}
      {scene !== 'page1' && !transitionComplete && (
        <PetalSwirlTransition
          startX={transitionStartCoords.x}
          startY={transitionStartCoords.y}
          onCovered={handleScreenCovered}
          onRevealing={handleScreenRevealing}
          onComplete={handleTransitionComplete}
        />
      )}

      {/* Audio placeholders */}
      <audio id="audio-breeze" loop src="" />
      <audio id="audio-birds" loop src="" />
    </div>
  );
}

export default App;

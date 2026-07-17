import { useEffect, useRef, useCallback } from 'react';

export const useNatureAudio = (isActive: boolean, isNightMode: boolean = false, isLetterMode: boolean = false) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const breezeGainRef = useRef<GainNode | null>(null);
  const breezeFilterRef = useRef<BiquadFilterNode | null>(null);
  const cricketGainRef = useRef<GainNode | null>(null);

  // Refs for our recorded sounds
  const rustleAudioRef = useRef<HTMLAudioElement | null>(null);
  const flutterAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload recorded sounds
    rustleAudioRef.current = new Audio('/sounds/rustle.mp3');
    flutterAudioRef.current = new Audio('/sounds/flutter.mp3');
    
    // Lower volume for subtleties
    rustleAudioRef.current.volume = 0.4;
    flutterAudioRef.current.volume = 0.3;

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive && !isLetterMode) {
      if (breezeGainRef.current && audioCtxRef.current) {
        breezeGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 1);
      }
      if (cricketGainRef.current && audioCtxRef.current) {
        cricketGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 1);
      }
      return;
    }

    if (isLetterMode && breezeGainRef.current && cricketGainRef.current && audioCtxRef.current) {
       // Drop to almost silent
       breezeGainRef.current.gain.setTargetAtTime(0.02, audioCtxRef.current.currentTime, 3);
       cricketGainRef.current.gain.setTargetAtTime(0.003, audioCtxRef.current.currentTime, 3);
       return;
    }

    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtxRef.current = new AudioContextClass();
    }

    const ctx = audioCtxRef.current;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // --- BREEZE SETUP ---
    const bufferSize = ctx.sampleRate * 2; 
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = isNightMode ? 80 : 150; // Deeper at night
    lowpass.Q.value = 0.1;
    breezeFilterRef.current = lowpass;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05; 
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = isNightMode ? 20 : 50; 

    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);
    lfo.start();

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0; 
    breezeGainRef.current = masterGain;

    noiseSource.connect(lowpass);
    lowpass.connect(masterGain);
    masterGain.connect(ctx.destination);
    
    noiseSource.start();

    // --- CRICKET SETUP ---
    // Procedural cricket: a high-pitched oscillator modulated by a fast LFO to create a chirping rhythm
    const cricketOsc = ctx.createOscillator();
    cricketOsc.type = 'triangle';
    cricketOsc.frequency.value = 4500; // High pitch for cricket
    
    const chirpLfo = ctx.createOscillator();
    chirpLfo.type = 'square';
    chirpLfo.frequency.value = 15; // Fast pulsing (chirp speed)
    
    const chirpGain = ctx.createGain();
    chirpGain.gain.value = 0; // Starts silent
    
    // Pattern LFO to group chirps into bursts
    const patternLfo = ctx.createOscillator();
    patternLfo.type = 'sine';
    patternLfo.frequency.value = 0.5; // Every 2 seconds
    
    const patternGain = ctx.createGain();
    patternGain.gain.value = 0.5;
    
    patternLfo.connect(patternGain);
    
    const finalCricketGain = ctx.createGain();
    finalCricketGain.gain.value = 0; // Master volume for cricket
    cricketGainRef.current = finalCricketGain;

    chirpLfo.connect(chirpGain.gain);
    
    cricketOsc.connect(chirpGain);
    chirpGain.connect(finalCricketGain);
    finalCricketGain.connect(ctx.destination);

    cricketOsc.start();
    chirpLfo.start();
    patternLfo.start();

    // Fade in
    masterGain.gain.setTargetAtTime(isNightMode ? 0.1 : 0.3, ctx.currentTime, 2);
    finalCricketGain.gain.setTargetAtTime(isNightMode ? 0.015 : 0, ctx.currentTime, 2);

    return () => {
      noiseSource.stop();
      lfo.stop();
      cricketOsc.stop();
      chirpLfo.stop();
      patternLfo.stop();
      noiseSource.disconnect();
    };
  }, [isActive]);

  // Handle Night Mode transitions smoothly
  useEffect(() => {
    if (!audioCtxRef.current || !breezeFilterRef.current || !breezeGainRef.current || !cricketGainRef.current) return;
    
    const ctx = audioCtxRef.current;
    
    if (isNightMode) {
      // Transition to night
      breezeFilterRef.current.frequency.setTargetAtTime(80, ctx.currentTime, 3); // Deeper wind
      breezeGainRef.current.gain.setTargetAtTime(0.1, ctx.currentTime, 3); // Quieter wind
      cricketGainRef.current.gain.setTargetAtTime(0.015, ctx.currentTime, 4); // Fade in cricket
    } else {
      // Transition to day
      breezeFilterRef.current.frequency.setTargetAtTime(150, ctx.currentTime, 3); 
      breezeGainRef.current.gain.setTargetAtTime(0.3, ctx.currentTime, 3);
      cricketGainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 2); 
    }
  }, [isNightMode]);

  const playRustle = useCallback(() => {
    if (rustleAudioRef.current) {
      rustleAudioRef.current.currentTime = 0;
      rustleAudioRef.current.play().catch(() => {});
    }
  }, []);

  const playFlutter = useCallback(() => {
    if (flutterAudioRef.current) {
      flutterAudioRef.current.currentTime = 0;
      flutterAudioRef.current.play().catch(() => {});
    }
  }, []);

  return { playRustle, playFlutter };
};

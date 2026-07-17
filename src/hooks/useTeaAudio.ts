import { useEffect, useRef, useCallback } from 'react';

export const useTeaAudio = (isActive: boolean) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const steamNoiseRef = useRef<AudioBufferSourceNode | null>(null);
  const steamGainRef = useRef<GainNode | null>(null);

  // Initialize audio context on first interaction
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  // Procedural Ceramic Tap
  const playTap = useCallback(() => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // High frequency short ping for ceramic
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 5;

    // Very short, snappy envelope
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }, [initAudio]);

  // Procedural Steam Ambience (soft filtered white noise)
  useEffect(() => {
    if (!isActive) {
      // Fade out and stop steam
      if (steamGainRef.current && audioCtxRef.current) {
        steamGainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1);
        setTimeout(() => {
          if (steamNoiseRef.current) {
            steamNoiseRef.current.stop();
            steamNoiseRef.current.disconnect();
            steamNoiseRef.current = null;
          }
        }, 1000);
      }
      return;
    }

    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Generate 2 seconds of white noise
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to make it sound like soft escaping steam (hiss)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400; // Low frequency rumbling/hiss
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    
    // Fade in very slowly
    gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    
    steamNoiseRef.current = noise;
    steamGainRef.current = gain;

    return () => {
      if (steamGainRef.current && ctx) {
        steamGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      }
    };
  }, [isActive, initAudio]);

  return { playTap };
};

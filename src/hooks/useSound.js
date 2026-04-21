import { useState, useEffect, useCallback } from 'react';
import { SoundEngine } from '../audio/SoundEngine';

const MUTE_KEY = 'dreampick_tv_muted';

export function useSound() {
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Sync mute state to engine
  useEffect(() => {
    SoundEngine.setMuted(isMuted);
  }, [isMuted]);

  // Resume AudioContext on first user interaction (iOS/Safari requirement)
  useEffect(() => {
    const handler = () => {
      SoundEngine.resume();
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
    };
    document.addEventListener('click', handler, { once: true });
    document.addEventListener('touchstart', handler, { once: true });
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      try { localStorage.setItem(MUTE_KEY, String(next)); } catch {}
      return next;
    });
  }, []);

  const play = useCallback((id) => {
    SoundEngine.play(id);
  }, []);

  const startBgm = useCallback(() => {
    SoundEngine.startBgm();
  }, []);

  const stopBgm = useCallback(() => {
    SoundEngine.stopBgm();
  }, []);

  return { play, isMuted, toggleMute, startBgm, stopBgm };
}

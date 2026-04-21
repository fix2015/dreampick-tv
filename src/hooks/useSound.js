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

  // Unlock AudioContext on first user gesture — required on iOS/Android
  // Must happen inside a direct touch/click handler to satisfy browser autoplay policy
  useEffect(() => {
    const handler = () => {
      SoundEngine.unlock();
    };
    // Use capture phase so we unlock before any other handler runs
    document.addEventListener('touchstart', handler, { capture: true });
    document.addEventListener('touchend', handler, { capture: true });
    document.addEventListener('click', handler, { capture: true });
    return () => {
      document.removeEventListener('touchstart', handler, { capture: true });
      document.removeEventListener('touchend', handler, { capture: true });
      document.removeEventListener('click', handler, { capture: true });
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

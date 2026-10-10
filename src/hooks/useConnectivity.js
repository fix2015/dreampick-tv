import { useState, useEffect, useCallback, useRef } from 'react';
import { CDN, img } from '../utils/assets';

const PROBE_TIMEOUT_MS = 8000;

/** Try to load a small CDN image; resolves true if the CDN is reachable. */
function probeCdn() {
  return new Promise((resolve) => {
    const probe = new Image();
    const timer = setTimeout(() => {
      probe.src = '';
      resolve(false);
    }, PROBE_TIMEOUT_MS);
    probe.onload = () => { clearTimeout(timer); resolve(true); };
    probe.onerror = () => { clearTimeout(timer); resolve(false); };
    probe.src = `${img('mystery_box.png')}?probe=${Date.now()}`;
  });
}

/** Re-request CDN images that failed while offline. */
function reloadFailedImages(failed) {
  failed.forEach((el) => {
    if (!el.isConnected) return;
    const base = el.src.split('?')[0];
    el.style.display = '';
    el.src = `${base}?retry=${Date.now()}`;
  });
  failed.clear();
}

/**
 * Tracks whether the app can reach the image CDN.
 * Uses navigator.onLine + online/offline events, and also reacts to CDN
 * image load failures (flaky networks often report "online").
 */
export function useConnectivity() {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const [checking, setChecking] = useState(false);
  const failedImages = useRef(new Set());
  const probing = useRef(false);

  const check = useCallback(async () => {
    if (probing.current) return;
    probing.current = true;
    setChecking(true);
    const ok = await probeCdn();
    probing.current = false;
    setChecking(false);
    setOnline(ok);
    if (ok) reloadFailedImages(failedImages.current);
  }, []);

  useEffect(() => {
    const goOffline = () => setOnline(false);
    const goOnline = () => { check(); };
    const onImgError = (e) => {
      const el = e.target;
      if (el instanceof HTMLImageElement && el.src.startsWith(CDN)) {
        failedImages.current.add(el);
        check();
      }
    };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    window.addEventListener('error', onImgError, true);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
      window.removeEventListener('error', onImgError, true);
    };
  }, [check]);

  return { online, checking, retry: check };
}

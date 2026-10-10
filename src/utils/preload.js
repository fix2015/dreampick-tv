import { img } from './assets';

const requested = new Set();

/** Warm the HTTP cache for CDN images (deduplicated). */
export function preloadImages(paths) {
  paths.forEach((path) => {
    if (!path || requested.has(path)) return;
    requested.add(path);
    const image = new Image();
    image.decoding = 'async';
    image.src = img(path);
  });
}

/** Images a question needs on screen: its options plus the mystery box. */
export function questionImagePaths(question) {
  if (!question) return [];
  return [...question.options.map(o => o.image), 'mystery_box.png'];
}

/** Run when the browser is idle (falls back to a short timeout). */
export function whenIdle(fn) {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(fn, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 300);
  return () => clearTimeout(id);
}

/** Skip speculative downloads when the user asked to save data. */
export function saveDataEnabled() {
  return !!navigator.connection?.saveData;
}

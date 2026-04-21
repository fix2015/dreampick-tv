import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TIMER_DURATION = 3000;

export default function TimerBar({ isActive, onComplete, theme }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    const start = Date.now();
    let frame;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / TIMER_DURATION, 1);
      setProgress(pct);

      if (pct >= 1) {
        onComplete();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="w-full" style={{ maxWidth: '320px', padding: '0 var(--safe-inset)' }}>
      <div className="flex items-center" style={{ gap: 'var(--sp-8)' }}>
        <span style={{ fontSize: '20px' }}>🦄</span>
        <div
          className="flex-1 rounded-full bg-white/20 overflow-hidden border-2 border-white/40 shadow-inner"
          style={{ height: '14px' }}
        >
          <motion.div
            className="h-full rounded-full relative"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.badge}, var(--color-gold))`,
            }}
          >
            {progress > 0.7 && (
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
            )}
          </motion.div>
        </div>
        <span style={{ fontSize: '20px' }}>✨</span>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { useI18n } from '../i18n/i18n';

const TIMER_DURATION = 3000;

export default function TimerBar({ isActive, onComplete, theme, play }) {
  const { t } = useI18n();
  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const tickedSeconds = useRef(new Set());

  useEffect(() => {
    if (!isActive) return;
    const ticked = tickedSeconds.current;

    const start = Date.now();
    let frame;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / TIMER_DURATION, 1);
      setProgress(pct);

      // Play tick sound at 1s, 2s, 3s thresholds
      const sec = Math.floor(elapsed / 1000) + 1;
      if (sec <= 3 && !ticked.has(sec)) {
        ticked.add(sec);
        play('countdownTick');
        setSecondsLeft(4 - sec);
      }

      if (pct >= 1) {
        onComplete();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      ticked.clear();
      setProgress(0);
      setSecondsLeft(null);
    };
  }, [isActive, onComplete, play]);

  // Live region stays mounted so screen readers announce each second
  const announcement = (
    <div role="status" aria-live="assertive" aria-atomic="true" className="sr-only">
      {isActive && secondsLeft ? t('timer.seconds', { count: secondsLeft }) : ''}
    </div>
  );

  if (!isActive) return announcement;

  return (
    <div className="w-full" style={{ maxWidth: '320px', padding: '0 var(--safe-inset)' }}>
      {announcement}
      <div className="flex items-center" style={{ gap: 'var(--sp-8)' }}>
        <span style={{ fontSize: '20px' }} aria-hidden="true">🦄</span>
        <div
          role="progressbar"
          aria-label={t('timer.label')}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          className="flex-1 rounded-full bg-white/20 overflow-hidden border-2 border-white/40 shadow-inner"
          style={{ height: '14px' }}
        >
          <m.div
            className="h-full rounded-full relative"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.badge}, var(--color-gold))`,
            }}
          >
            {progress > 0.7 && (
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
            )}
          </m.div>
        </div>
        <span style={{ fontSize: '20px' }} aria-hidden="true">✨</span>
      </div>
    </div>
  );
}

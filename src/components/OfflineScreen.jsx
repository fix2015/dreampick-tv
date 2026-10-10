import { useEffect, useRef } from 'react';

export default function OfflineScreen({ checking, onRetry }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="offline-title"
      className="dp-gradient-bg fixed inset-0 flex flex-col items-center justify-center text-center"
      style={{ zIndex: 90, padding: 'var(--safe-inset)', gap: 'var(--sp-16)' }}
    >
      <div style={{ fontSize: '64px' }} aria-hidden="true">📡</div>
      <h1 id="offline-title" className="font-bold text-white" style={{ fontSize: 'var(--text-2xl)', maxWidth: '420px' }}>
        DreamPick needs internet to load pictures
      </h1>
      <p className="text-white/80" style={{ fontSize: 'var(--text-base)', maxWidth: '420px' }}>
        Check your Wi-Fi or mobile data, then try again.
      </p>
      <button
        ref={buttonRef}
        type="button"
        onClick={onRetry}
        disabled={checking}
        className="dp-btn"
        style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', opacity: checking ? 0.7 : 1 }}
      >
        {checking ? 'Checking…' : 'Retry 🔄'}
      </button>
    </div>
  );
}

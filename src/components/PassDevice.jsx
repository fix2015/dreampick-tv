import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/** Hand-over screen between Player 1 and Player 2 (hides Player 1's pick). */
export default function PassDevice({ onReady }) {
  const buttonRef = useRef(null);
  useEffect(() => { buttonRef.current?.focus(); }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pass-title"
      className="dp-gradient-bg fixed inset-0 flex flex-col items-center justify-center text-center"
      style={{ zIndex: 45, padding: 'var(--safe-inset)', gap: 'var(--sp-16)' }}
    >
      <div style={{ fontSize: '64px' }} aria-hidden="true">🤫</div>
      <h2 id="pass-title" className="font-bold text-white" style={{ fontSize: 'var(--text-2xl)' }}>
        Player 1 picked!
      </h2>
      <p className="text-white/80" style={{ fontSize: 'var(--text-lg)' }}>
        Pass the device to Player 2 👉
      </p>
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReady}
        className="dp-btn"
        style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' }}
      >
        I'm Player 2, ready!
      </motion.button>
    </div>
  );
}

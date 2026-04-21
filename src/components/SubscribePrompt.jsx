import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubscribePrompt({ show, onDismiss, play }) {
  useEffect(() => {
    if (show) play('subscribeAppear');
  }, [show, play]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ padding: 'var(--safe-inset)' }}
      >
        <div className="absolute inset-0">
          <img
            src="/images/subscribe_bg.png"
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(135deg, #FF6B6B, #FBBF24)';
            }}
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>

        <motion.div
          initial={{ scale: 0.5, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative z-10 bg-white text-center w-full"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--sp-32)',
            maxWidth: '420px',
            boxShadow: 'var(--shadow-popup)',
          }}
        >
          <div className="flex flex-col items-center" style={{ gap: 'var(--sp-16)' }}>
            <div style={{ fontSize: '48px' }}>🌟</div>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'var(--text-2xl)' }}>
              You're doing amazing!
            </h2>
            <p className="text-gray-600" style={{ fontSize: 'var(--text-base)' }}>
              Want more Dream Picks? Subscribe to DreamPick TV on YouTube for new quizzes every week!
            </p>

            <div className="flex flex-col w-full" style={{ gap: 'var(--sp-12)', marginTop: 'var(--sp-8)' }}>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.youtube.com/@DreamPickTV?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="dp-btn w-full inline-block no-underline text-center"
                style={{ background: 'linear-gradient(135deg, var(--color-youtube), var(--color-youtube-dark))' }}
              >
                Subscribe 🔔
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gray-100 text-gray-600 font-bold cursor-pointer border-none"
                style={{
                  padding: 'var(--sp-12) var(--sp-24)',
                  borderRadius: 'var(--radius-xl)',
                  fontSize: 'var(--text-base)',
                }}
                onClick={onDismiss}
              >
                Keep Playing ➜
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

import { motion } from 'framer-motion';

export default function ProgressHUD({ currentIndex, totalQuestions, stars, streak, dreamEnergy, theme }) {
  return (
    <div
      className="flex items-center justify-center flex-wrap w-full"
      style={{ gap: 'var(--sp-16)', padding: '0 var(--safe-inset)' }}
    >
      {/* Question counter */}
      <span
        className="text-white font-bold rounded-full"
        style={{
          backgroundColor: theme.badge,
          fontSize: 'var(--text-sm)',
          padding: 'var(--sp-4) var(--sp-16)',
        }}
      >
        {currentIndex + 1} / {totalQuestions}
      </span>

      {/* Stars */}
      <motion.div
        key={stars}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        className="flex items-center text-white font-bold"
        style={{ gap: 'var(--sp-4)', fontSize: 'var(--text-base)' }}
      >
        <span>⭐</span>
        <span>{stars}</span>
      </motion.div>

      {/* Streak */}
      {streak > 1 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center text-white font-bold"
          style={{ gap: 'var(--sp-4)', fontSize: 'var(--text-base)' }}
        >
          <span>🔥</span>
          <span>{streak}</span>
        </motion.div>
      )}

      {/* Dream Energy bar */}
      <div className="flex items-center" style={{ gap: 'var(--sp-8)' }}>
        <span style={{ fontSize: 'var(--text-sm)' }}>✨</span>
        <div
          className="rounded-full bg-white/20 overflow-hidden"
          style={{ width: '80px', height: '10px' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: 'var(--color-gold)' }}
            initial={false}
            animate={{ width: `${dreamEnergy}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRarityColor } from '../utils/helpers';
import { img } from '../utils/assets';
import Confetti from './Confetti';

export default function EndScreen({ sessionItems, sessionStars, streak, onPlayAgain, onGoHome, play }) {
  useEffect(() => {
    play('confetti');
  }, [play]);

  const luckyCount = sessionItems.filter(i => i.isLucky).length;
  const rareCount = sessionItems.filter(i => i.rarity === 'rare' || i.rarity === 'legendary').length;

  return (
    <div className="dp-gradient-bg dp-screen relative overflow-hidden">
      <Confetti active count={50} />

      <img
        src={img('end_screen.png')}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        onError={(e) => { e.target.style.display = 'none'; }}
      />

      <div
        className="relative z-10 w-full flex flex-col items-center"
        style={{ maxWidth: '640px', gap: 'var(--sp-24)' }}
      >
        {/* Title */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center"
        >
          <h1
            className="font-bold text-white"
            style={{
              fontSize: 'var(--text-3xl)',
              textShadow: '3px 3px 0px rgba(0,0,0,0.2)',
              marginBottom: 'var(--sp-8)',
            }}
          >
            Thanks for Playing! 🎉
          </h1>
          <p className="text-white/80" style={{ fontSize: 'var(--text-lg)' }}>
            Your Dream Collection
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center"
          style={{ gap: 'var(--sp-12)' }}
        >
          {[
            { emoji: '⭐', value: sessionStars, label: 'Stars' },
            { emoji: '🔥', value: streak, label: 'Streak' },
            { emoji: '🍀', value: luckyCount, label: 'Lucky' },
            { emoji: '💎', value: rareCount, label: 'Rares' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="dp-glass text-center"
              style={{ padding: 'var(--sp-12) var(--sp-16)', minWidth: '72px' }}
            >
              <div style={{ fontSize: '24px' }}>{stat.emoji}</div>
              <div className="text-white font-bold" style={{ fontSize: 'var(--text-xl)' }}>{stat.value}</div>
              <div className="text-white/70" style={{ fontSize: 'var(--text-xs)' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Collection gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 w-full"
          style={{ gap: 'var(--sp-8)' }}
        >
          {sessionItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
              className="relative overflow-hidden shadow-lg aspect-square"
              style={{
                borderRadius: 'var(--radius-md)',
                border: `3px solid ${getRarityColor(item.rarity)}`,
              }}
            >
              <img
                src={img(item.image)}
                alt={item.prompt}
                className="w-full h-full object-cover"
              />
              {item.isLucky && (
                <div className="absolute" style={{ top: 'var(--sp-4)', right: 'var(--sp-4)', fontSize: '14px' }}>🍀</div>
              )}
              {(item.rarity === 'rare' || item.rarity === 'legendary') && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-black/60 text-center font-bold"
                  style={{
                    color: getRarityColor(item.rarity),
                    fontSize: 'var(--text-xs)',
                    padding: 'var(--sp-4) 0',
                  }}
                >
                  {item.rarity === 'legendary' ? '🌟 LEGEND' : '✨ RARE'}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row justify-center w-full sm:w-auto"
          style={{ gap: 'var(--sp-12)' }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAgain}
            className="dp-btn"
            style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' }}
          >
            Play Again 🔄
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGoHome}
            className="dp-btn"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}
          >
            Try Another Category 🎮
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.youtube.com/@DreamPickTV?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="dp-btn no-underline text-center"
            style={{ background: 'linear-gradient(135deg, var(--color-youtube), var(--color-youtube-dark))' }}
          >
            Subscribe 🔔
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}

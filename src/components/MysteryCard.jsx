import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { img } from '../utils/assets';

export default function MysteryCard({ option, index, isSelected, isDisabled, isRevealed, onSelect, theme }) {
  const [flipped, setFlipped] = useState(false);
  const isChosen = isSelected === index;
  const otherChosen = isSelected !== null && !isChosen;

  useEffect(() => {
    if (isRevealed) {
      const timer = setTimeout(() => setFlipped(true), 200);
      return () => clearTimeout(timer);
    } else {
      setFlipped(false);
    }
  }, [isRevealed]);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{
        opacity: otherChosen ? 0.5 : 1,
        y: 0,
        scale: isChosen ? 1.05 : otherChosen ? 0.95 : 1,
      }}
      whileHover={isDisabled ? {} : { scale: 1.05, y: -8 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.1 }}
      onClick={() => !isDisabled && onSelect(index)}
      disabled={isDisabled}
      className="dp-card-wrapper cursor-pointer"
    >
      <div className="card-flip w-full" style={{ aspectRatio: '3/4' }}>
        <div
          className={`dp-card dp-card--mystery ${isChosen ? 'dp-card--selected' : ''} ${!isRevealed ? 'animate-pulse-glow' : ''}`}
          style={{ boxShadow: isChosen ? undefined : 'var(--shadow-card)' }}
        >
          {/* Number badge */}
          <div className="dp-card-badge" style={{ backgroundColor: '#FBBF24' }}>?</div>

          <div className={`card-flip-inner w-full h-full ${flipped ? 'flipped' : ''}`}>
            {/* Front - Mystery */}
            <div className="card-front w-full h-full">
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)',
                  padding: 'var(--sp-16)',
                }}
              >
                <img
                  src={img('mystery_box.png')}
                  alt="Mystery"
                  className="w-4/5 h-4/5 object-contain drop-shadow-lg"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10 pointer-events-none" />
            </div>

            {/* Back - Revealed */}
            <div className="card-back w-full h-full">
              <img
                src={img(option.image)}
                alt="Mystery Revealed"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Mystery label — proper padding */}
      {!isRevealed && !isChosen && (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="dp-card-label"
        >
          MYSTERY 🎁
        </motion.div>
      )}

      {isChosen && !isRevealed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="dp-card-label"
        >
          PICKED! ✨
        </motion.div>
      )}
    </motion.button>
  );
}

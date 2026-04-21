import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRarityLabel, getRarityColor } from '../utils/helpers';
import { img } from '../utils/assets';
import Confetti from './Confetti';

export default function RewardPopup({ reward, onContinue, play }) {
  useEffect(() => {
    if (!reward) return;
    if (reward.rarity === 'legendary') {
      play('rewardLegendary');
    } else if (reward.rarity === 'rare') {
      play('rewardRare');
    } else {
      play('rewardCommon');
    }
    const special = reward.rarity === 'rare' || reward.rarity === 'legendary';
    if (special || reward.isLucky) {
      play('confetti');
    }
  }, [reward, play]);

  if (!reward) return null;

  const isLucky = reward.isLucky;
  const rarityColor = getRarityColor(reward.rarity);
  const isSpecial = reward.rarity === 'rare' || reward.rarity === 'legendary';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-overlay)', backdropFilter: 'blur(4px)', padding: 'var(--safe-inset)' }}
        onClick={onContinue}
      >
        <Confetti active={isLucky || isSpecial} count={isLucky ? 60 : 30} />

        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white text-center relative overflow-hidden w-full"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--sp-24)',
            maxWidth: '380px',
            boxShadow: 'var(--shadow-popup)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {isSpecial && (
            <div
              className="absolute inset-0 opacity-20"
              style={{ background: `radial-gradient(circle, ${rarityColor} 0%, transparent 70%)` }}
            />
          )}

          <div className="relative z-10 flex flex-col items-center" style={{ gap: 'var(--sp-12)' }}>
            {isLucky && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-bold text-yellow-500"
                style={{ fontSize: 'var(--text-xl)' }}
              >
                🍀 Lucky Pick! 🍀
              </motion.div>
            )}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="overflow-hidden shadow-lg"
              style={{
                width: '140px',
                height: '140px',
                borderRadius: 'var(--radius-lg)',
                border: `4px solid ${rarityColor}`,
              }}
            >
              <img
                src={img(reward.image)}
                alt={reward.prompt}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <h3 className="font-bold text-gray-800" style={{ fontSize: 'var(--text-base)' }}>
              {reward.prompt.replace('CHOOSE YOUR ', 'Your ')}
            </h3>

            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block rounded-full text-white font-bold"
              style={{
                backgroundColor: rarityColor,
                fontSize: 'var(--text-sm)',
                padding: 'var(--sp-4) var(--sp-16)',
              }}
            >
              {getRarityLabel(reward.rarity)}
            </motion.span>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ fontSize: '24px' }}
            >
              {Array.from({ length: reward.stars }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  ⭐
                </motion.span>
              ))}
              {reward.isBonus && (
                <span
                  className="block text-orange-500 font-bold"
                  style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--sp-4)' }}
                >
                  BONUS x2! 🎉
                </span>
              )}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className="dp-btn w-full"
              style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', marginTop: 'var(--sp-8)' }}
            >
              Continue ➜
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

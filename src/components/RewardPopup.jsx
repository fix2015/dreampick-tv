import { useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { getRarityColor } from '../utils/helpers';
import { img } from '../utils/assets';
import Confetti from './Confetti';
import { duoAgreed } from '../utils/duo';
import { useI18n, questionNoun } from '../i18n/i18n';

export default function RewardPopup({ reward, duoResult, onContinue, play }) {
  const { t } = useI18n();
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
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-overlay)', backdropFilter: 'blur(4px)', padding: 'var(--safe-inset)' }}
        onClick={onContinue}
      >
        <Confetti active={isLucky || isSpecial} count={isLucky ? 60 : 30} />

        <m.div
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
              <m.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-bold text-yellow-500"
                style={{ fontSize: 'var(--text-xl)' }}
              >
                {t('reward.lucky')}
              </m.div>
            )}

            <m.div
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
            </m.div>

            {duoResult && (
              <p className="font-bold" style={{ fontSize: 'var(--text-lg)', color: duoAgreed(duoResult) ? '#16A34A' : '#EA580C' }}>
                {t(duoAgreed(duoResult) ? 'duo.agreed' : 'duo.different', { noun: questionNoun(t, duoResult.prompt) })}
              </p>
            )}

            <h3 className="font-bold text-gray-800" style={{ fontSize: 'var(--text-base)' }}>
              {t('reward.your', { noun: questionNoun(t, reward.prompt) })}
            </h3>

            <m.span
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
              {t(`rarity.${reward.rarity}`)}
            </m.span>

            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ fontSize: '24px' }}
            >
              {Array.from({ length: reward.stars }, (_, i) => (
                <m.span
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  ⭐
                </m.span>
              ))}
              {reward.isBonus && (
                <span
                  className="block text-orange-500 font-bold"
                  style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--sp-4)' }}
                >
                  {t('reward.bonus')}
                </span>
              )}
            </m.div>

            <m.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className="dp-btn w-full"
              style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', marginTop: 'var(--sp-8)' }}
            >
              {t('reward.continue')}
            </m.button>
          </div>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
}

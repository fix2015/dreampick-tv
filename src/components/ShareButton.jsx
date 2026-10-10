import { useState } from 'react';
import { motion } from 'framer-motion';
import { createSummaryImage, shareImage } from '../utils/shareImage';
import { getRarityColor } from '../utils/helpers';
import { useI18n } from '../i18n/i18n';

export default function ShareButton({ sessionItems, sessionStars }) {
  const { t } = useI18n();
  const [status, setStatus] = useState('idle'); // idle | working | done | saved | error

  const handleShare = async () => {
    setStatus('working');
    try {
      const blob = await createSummaryImage({
        items: sessionItems,
        stars: sessionStars,
        title: t('share.imageTitle'),
        subtitle: t('share.imageSubtitle', { count: sessionItems.length }),
        rarityColor: getRarityColor,
      });
      const result = await shareImage(blob, {
        title: t('share.title'),
        text: t('share.text'),
      });
      setStatus({ cancelled: 'idle', downloaded: 'saved' }[result] || 'done');
    } catch {
      setStatus('error');
    }
  };

  const label = {
    idle: t('share.button'),
    working: t('share.working'),
    done: t('share.done'),
    saved: t('share.saved'),
    error: t('share.error'),
  }[status];

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      disabled={status === 'working' || sessionItems.length === 0}
      aria-busy={status === 'working'}
      className="dp-btn"
      style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
    >
      <span aria-live="polite">{label}</span>
    </motion.button>
  );
}

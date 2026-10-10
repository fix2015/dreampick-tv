import { useState } from 'react';
import { motion } from 'framer-motion';
import { createSummaryImage, shareImage } from '../utils/shareImage';
import { getRarityColor } from '../utils/helpers';

export default function ShareButton({ sessionItems, sessionStars }) {
  const [status, setStatus] = useState('idle'); // idle | working | done | saved | error

  const handleShare = async () => {
    setStatus('working');
    try {
      const blob = await createSummaryImage({
        items: sessionItems,
        stars: sessionStars,
        title: 'My Dream Picks ✨',
        subtitle: `${sessionItems.length} dreams collected`,
        rarityColor: getRarityColor,
      });
      const result = await shareImage(blob, {
        title: 'My DreamPick TV dreams',
        text: 'Look at my dream picks on DreamPick TV!',
      });
      setStatus({ cancelled: 'idle', downloaded: 'saved' }[result] || 'done');
    } catch {
      setStatus('error');
    }
  };

  const label = {
    idle: 'Share My Dreams 📤',
    working: 'Making picture…',
    done: 'Shared! 📤',
    saved: 'Saved! ⬇️',
    error: 'Could not share 😕',
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

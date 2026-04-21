import { motion } from 'framer-motion';

export default function MuteButton({ isMuted, onToggle }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      className="fixed z-50 flex items-center justify-center bg-white/20 backdrop-blur-sm border-2 border-white/30 cursor-pointer"
      style={{
        bottom: 'var(--safe-inset)',
        right: 'var(--safe-inset)',
        width: '44px',
        height: '44px',
        borderRadius: 'var(--radius-full)',
        fontSize: '20px',
      }}
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? '🔇' : '🔊'}
    </motion.button>
  );
}

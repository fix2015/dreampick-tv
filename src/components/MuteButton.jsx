import { m } from 'framer-motion';
import { useI18n } from '../i18n/i18n';

export default function MuteButton({ isMuted, onToggle }) {
  const { t } = useI18n();
  return (
    <m.button
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
      aria-label={isMuted ? t('mute.unmute') : t('mute.mute')}
    >
      {isMuted ? '🔇' : '🔊'}
    </m.button>
  );
}

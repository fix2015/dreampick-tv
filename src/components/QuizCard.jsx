import { m } from 'framer-motion';
import { img } from '../utils/assets';
import { useI18n } from '../i18n/i18n';

export default function QuizCard({ option, index, isSelected, isDisabled, onSelect, theme, ariaLabel }) {
  const { t } = useI18n();
  const isChosen = isSelected === index;
  const otherChosen = isSelected !== null && !isChosen;

  return (
    <m.button
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
      aria-label={ariaLabel}
      aria-pressed={isChosen}
      className="dp-card-wrapper cursor-pointer"
    >
      <div
        className={`dp-card ${isChosen ? 'dp-card--selected' : ''}`}
        style={{ boxShadow: isChosen ? undefined : 'var(--shadow-card)' }}
      >
        <img
          src={img(option.image)}
          alt={ariaLabel || option.label}
          className="w-full h-full object-cover"
          loading="eager"
        />

        {/* Number badge */}
        <div className="dp-card-badge" style={{ backgroundColor: theme.badge }} aria-hidden="true">
          {index + 1}
        </div>

        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20 pointer-events-none" />

        {isChosen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-yellow-300/20 pointer-events-none"
          />
        )}
      </div>

      {isChosen && (
        <m.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400 }}
          className="dp-card-label"
        >
          {t('card.picked')}
        </m.div>
      )}
    </m.button>
  );
}

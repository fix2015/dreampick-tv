import { useState } from 'react';
import { motion } from 'framer-motion';
import { loadProgress } from '../utils/storage';
import { loadDaily, currentStreak, isDailyDone } from '../utils/daily';
import DailyPickCard from './DailyPickCard';
import LanguagePicker from './LanguagePicker';
import { useI18n } from '../i18n/i18n';

const CATEGORY_COLORS = {
  dream_bedroom: '#7B68EE',
  dream_candy: '#E879A8',
  dream_car: '#EF5350',
  dream_pet: '#FFB74D',
  dream_robot: '#4FC3F7',
  dream_school: '#66BB6A',
  dream_space: '#BA68C8',
  dream_superpower: '#FBBF24',
  dream_treehouse: '#7ECDC0',
  dream_vacation: '#4FC3F7',
  random_mix: '#FF6B6B',
};

export default function HomeScreen({ categories, dailyQuestion, onStartGame }) {
  const { t } = useI18n();
  const progress = loadProgress();
  const daily = loadDaily();
  const [playerCount, setPlayerCount] = useState(1);
  const allCategories = [
    ...categories,
    { id: 'random_mix', emoji: '🎲', questionCount: 10 },
  ];

  return (
    <div className="dp-gradient-bg dp-screen relative z-10">

      {/* Floating decorations — hidden on mobile */}
      <div className="hidden md:block absolute top-12 left-12 text-4xl lg:text-5xl animate-float opacity-70">🌟</div>
      <div className="hidden md:block absolute top-24 right-16 text-3xl lg:text-4xl animate-float opacity-70" style={{ animationDelay: '1s' }}>🦄</div>
      <div className="hidden md:block absolute bottom-24 left-16 text-3xl lg:text-4xl animate-float opacity-70" style={{ animationDelay: '2s' }}>✨</div>
      <div className="hidden md:block absolute bottom-36 right-12 text-4xl lg:text-5xl animate-float opacity-70" style={{ animationDelay: '0.5s' }}>🌈</div>

      {/* Title */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="text-center"
        style={{ marginBottom: 'var(--sp-32)' }}
      >
        <h1 className="dp-hero-title">DreamPick TV</h1>
        <p
          className="text-white/90 font-medium"
          style={{ fontSize: 'var(--text-lg)', marginTop: 'var(--sp-8)' }}
        >
          {t('home.tagline')}
        </p>
      </motion.div>

      {/* Stats bar */}
      {progress.totalGamesPlayed > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center text-white/90 font-medium"
          style={{ gap: 'var(--sp-16)', marginBottom: 'var(--sp-24)', fontSize: 'var(--text-sm)' }}
        >
          <span>{t('home.stats.stars', { count: progress.totalStars })}</span>
          <span>{t('home.stats.games', { count: progress.totalGamesPlayed })}</span>
          <span>{t('home.stats.lucky', { count: progress.luckyPicks })}</span>
          <span>{t('home.stats.rares', { count: progress.rareFinds })}</span>
        </motion.div>
      )}

      <DailyPickCard
        question={dailyQuestion}
        streak={currentStreak(daily)}
        done={isDailyDone(daily)}
        onPlay={() => onStartGame('daily')}
      />

      {/* Player mode: solo or pass-and-play */}
      <div
        role="radiogroup"
        aria-label={t('home.players')}
        className="dp-glass flex"
        style={{ padding: 'var(--sp-4)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-16)' }}
      >
        {[1, 2].map(n => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={playerCount === n}
            onClick={() => setPlayerCount(n)}
            className="font-bold cursor-pointer border-none"
            style={{
              padding: 'var(--sp-8) var(--sp-16)',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-sm)',
              minHeight: '44px',
              background: playerCount === n ? 'white' : 'transparent',
              color: playerCount === n ? '#6D28D9' : 'white',
            }}
          >
            {n === 1 ? t('home.onePlayer') : t('home.twoPlayers')}
          </button>
        ))}
      </div>

      {/* Categories grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="dp-category-grid"
      >
        {allCategories.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i, type: 'spring' }}
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStartGame(cat.id, playerCount)}
            className="flex flex-col items-center cursor-pointer backdrop-blur-sm transition-shadow hover:shadow-xl"
            style={{
              gap: 'var(--sp-4)',
              padding: 'var(--sp-12) var(--sp-8)',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--color-glass-border)',
              background: `linear-gradient(135deg, ${CATEGORY_COLORS[cat.id] || '#7B68EE'}dd, ${CATEGORY_COLORS[cat.id] || '#7B68EE'}88)`,
            }}
          >
            <span style={{ fontSize: '32px' }}>{cat.emoji}</span>
            <span
              className="text-white font-bold text-center leading-tight"
              style={{ fontSize: 'var(--text-sm)' }}
            >
              {t(`category.${cat.id}`)}
            </span>
            <span className="text-white/60" style={{ fontSize: 'var(--text-xs)' }}>
              {t('home.picks', { count: cat.questionCount })}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-white/60"
        style={{ marginTop: 'var(--sp-32)', fontSize: 'var(--text-sm)' }}
      >
        {t('home.footer')}
      </motion.p>

      <LanguagePicker />
    </div>
  );
}

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import QuizCard from './QuizCard';
import MysteryCard from './MysteryCard';
import TimerBar from './TimerBar';
import ProgressHUD from './ProgressHUD';
import BackgroundEffects from './BackgroundEffects';
import { getTheme } from '../utils/themes';

export default function QuestionScreen({
  question,
  currentIndex,
  totalQuestions,
  selectedCard,
  phase,
  sessionStars,
  streak,
  dreamEnergy,
  onSelectCard,
  onCountdownComplete,
  onCollectReward,
}) {
  const theme = getTheme(currentIndex);
  const isRevealed = phase === 'reveal' || phase === 'reward';
  const isDisabled = phase !== 'choosing';

  useEffect(() => {
    if (phase === 'reveal') {
      const timer = setTimeout(onCollectReward, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, onCollectReward]);

  if (!question) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <BackgroundEffects theme={theme} />

      {/* Corner mascots — hidden on mobile */}
      <div className="hidden md:block absolute text-2xl lg:text-3xl opacity-60 animate-float z-10" style={{ top: 'var(--safe-inset)', left: 'var(--safe-inset)' }}>🐱</div>
      <div className="hidden md:block absolute text-2xl lg:text-3xl opacity-60 animate-float z-10" style={{ top: 'var(--safe-inset)', right: 'var(--safe-inset)', animationDelay: '1s' }}>🐾</div>
      <div className="hidden md:block absolute text-2xl lg:text-3xl opacity-60 animate-float z-10" style={{ bottom: 'var(--safe-inset)', left: 'var(--safe-inset)', animationDelay: '2s' }}>🦄</div>
      <div className="hidden md:block absolute text-2xl lg:text-3xl opacity-60 animate-float z-10" style={{ bottom: 'var(--safe-inset)', right: 'var(--safe-inset)', animationDelay: '0.5s' }}>✨</div>

      {/* Side label — desktop only */}
      <div
        className="hidden lg:flex absolute top-1/2 -translate-y-1/2 z-10"
        style={{ right: 'var(--sp-16)', writingMode: 'vertical-rl' }}
      >
        <span className="text-white/40 font-bold tracking-widest uppercase" style={{ fontSize: 'var(--text-sm)' }}>
          Daily Quiz
        </span>
      </div>

      {/* Main content — stacked with system spacing */}
      <div
        className="relative z-10 flex flex-col items-center w-full"
        style={{ padding: 'var(--sp-24) 0', gap: 'var(--sp-24)' }}
      >
        {/* Progress HUD */}
        <ProgressHUD
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          stars={sessionStars}
          streak={streak}
          dreamEnergy={dreamEnergy}
          theme={theme}
        />

        {/* Question prompt */}
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          style={{ padding: '0 var(--safe-inset)' }}
        >
          <h2
            className="font-bold text-white text-center"
            style={{
              fontSize: 'var(--text-question)',
              textShadow: '3px 3px 0px rgba(0,0,0,0.2)',
              lineHeight: 1.2,
            }}
          >
            {question.prompt}
          </h2>
        </motion.div>

        {/* Cards row */}
        <div className="dp-card-row">
          {question.options.map((option, idx) => {
            if (option.isMystery) {
              return (
                <MysteryCard
                  key={idx}
                  option={option}
                  index={idx}
                  isSelected={selectedCard}
                  isDisabled={isDisabled}
                  isRevealed={isRevealed}
                  onSelect={onSelectCard}
                  theme={theme}
                />
              );
            }
            return (
              <QuizCard
                key={idx}
                option={option}
                index={idx}
                isSelected={selectedCard}
                isDisabled={isDisabled}
                onSelect={onSelectCard}
                theme={theme}
              />
            );
          })}
        </div>

        {/* Timer */}
        <TimerBar
          isActive={phase === 'countdown'}
          onComplete={onCountdownComplete}
          theme={theme}
        />

        {/* Instruction text */}
        {phase === 'choosing' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/70 font-medium"
            style={{ fontSize: 'var(--text-base)' }}
          >
            Tap a card to pick! 👆
          </motion.p>
        )}
      </div>
    </div>
  );
}

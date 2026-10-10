import { lazy, Suspense, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import MuteButton from './components/MuteButton';
import OfflineScreen from './components/OfflineScreen';
import { useConnectivity } from './hooks/useConnectivity';
import { useGameState } from './hooks/useGameState';
import { useSound } from './hooks/useSound';
import { stopPromptVoice } from './audio/promptVoice';
import { preloadImages, questionImagePaths, saveDataEnabled, whenIdle } from './utils/preload';

// Animation-heavy screens are split out of the startup bundle and prefetched when idle
const loadQuestionScreen = () => import('./components/QuestionScreen');
const loadEndScreen = () => import('./components/EndScreen');
const loadRewardPopup = () => import('./components/RewardPopup');
const loadSubscribePrompt = () => import('./components/SubscribePrompt');
const loadPassDevice = () => import('./components/PassDevice');
const QuestionScreen = lazy(loadQuestionScreen);
const EndScreen = lazy(loadEndScreen);
const RewardPopup = lazy(loadRewardPopup);
const SubscribePrompt = lazy(loadSubscribePrompt);
const PassDevice = lazy(loadPassDevice);

const screenFallback = <div className="dp-gradient-bg min-h-screen" />;

export default function App() {
  const {
    screen,
    categories,
    dailyQuestion,
    currentCategory,
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedCard,
    phase,
    showSubscribe,
    sessionItems,
    streak,
    dreamEnergy,
    sessionStars,
    lastReward,
    players,
    turn,
    duoResults,
    startGame,
    preloadFirstQuestion,
    selectCard,
    passToPlayer2,
    onCountdownComplete,
    collectReward,
    nextQuestion,
    dismissSubscribe,
    goHome,
  } = useGameState();

  const { play, isMuted, toggleMute, startBgm, stopBgm } = useSound();
  const { online, checking, retry } = useConnectivity();

  // While the home screen shows: prefetch screen chunks and the first question's images
  useEffect(() => {
    if (screen !== 'home') return undefined;
    return whenIdle(() => {
      [loadQuestionScreen, loadRewardPopup, loadSubscribePrompt, loadPassDevice, loadEndScreen]
        .forEach(load => load().catch(() => {}));
      preloadImages(questionImagePaths(dailyQuestion));
      if (!saveDataEnabled()) preloadFirstQuestion('random_mix');
    });
  }, [screen, dailyQuestion, preloadFirstQuestion]);

  // Background music: play during game, stop on other screens
  useEffect(() => {
    if (screen === 'game') {
      startBgm();
    } else {
      stopBgm();
    }
  }, [screen, startBgm, stopBgm]);

  const handleStartGame = (categoryId, playerCount = 1) => {
    play('buttonClick');
    startGame(categoryId, playerCount);
  };

  const handleSelectCard = (cardIndex) => {
    play('cardPick');
    selectCard(cardIndex);
  };

  const handleNextQuestion = () => {
    play('buttonClick');
    nextQuestion();
  };

  const handleDismissSubscribe = () => {
    play('buttonClick');
    dismissSubscribe();
  };

  const handleGoHome = () => {
    play('buttonClick');
    stopPromptVoice();
    goHome();
  };

  return (
    <div className="min-h-screen">
      {screen === 'home' && (
        <HomeScreen
          categories={categories}
          dailyQuestion={dailyQuestion}
          onStartGame={handleStartGame}
          onPrepareCategory={preloadFirstQuestion}
          play={play}
        />
      )}

      {screen === 'game' && (
        <Suspense fallback={screenFallback}>
          <QuestionScreen
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            selectedCard={selectedCard}
            phase={phase}
            sessionStars={sessionStars}
            streak={streak}
            dreamEnergy={dreamEnergy}
            onSelectCard={handleSelectCard}
            onCountdownComplete={onCountdownComplete}
            onCollectReward={collectReward}
            onGoHome={handleGoHome}
            players={players}
            turn={turn}
            play={play}
          />

          {phase === 'pass' && (
            <PassDevice onReady={() => { play('buttonClick'); passToPlayer2(); }} />
          )}

          {phase === 'reward' && (
            <RewardPopup
              reward={lastReward}
              duoResult={players === 2 ? duoResults[duoResults.length - 1] : null}
              onContinue={handleNextQuestion}
              play={play}
            />
          )}

          <SubscribePrompt
            show={showSubscribe}
            onDismiss={handleDismissSubscribe}
            play={play}
          />
        </Suspense>
      )}

      {screen === 'end' && (
        <Suspense fallback={screenFallback}>
          <EndScreen
            sessionItems={sessionItems}
            duoResults={players === 2 ? duoResults : null}
            sessionStars={sessionStars}
            streak={streak}
            onPlayAgain={() => { play('buttonClick'); startGame(currentCategory, players); }}
            onGoHome={handleGoHome}
            play={play}
          />
        </Suspense>
      )}

      <MuteButton isMuted={isMuted} onToggle={toggleMute} />

      {!online && <OfflineScreen checking={checking} onRetry={retry} />}
    </div>
  );
}

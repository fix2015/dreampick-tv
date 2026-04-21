import { useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import QuestionScreen from './components/QuestionScreen';
import EndScreen from './components/EndScreen';
import RewardPopup from './components/RewardPopup';
import SubscribePrompt from './components/SubscribePrompt';
import MuteButton from './components/MuteButton';
import { useGameState } from './hooks/useGameState';
import { useSound } from './hooks/useSound';

export default function App() {
  const {
    screen,
    categories,
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
    startGame,
    selectCard,
    onCountdownComplete,
    collectReward,
    nextQuestion,
    dismissSubscribe,
    goHome,
  } = useGameState();

  const { play, isMuted, toggleMute, startBgm, stopBgm } = useSound();

  // Background music: play during game, stop on other screens
  useEffect(() => {
    if (screen === 'game') {
      startBgm();
    } else {
      stopBgm();
    }
  }, [screen, startBgm, stopBgm]);

  const handleStartGame = (categoryId) => {
    play('buttonClick');
    startGame(categoryId);
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
    goHome();
  };

  return (
    <div className="min-h-screen">
      {screen === 'home' && (
        <HomeScreen
          categories={categories}
          onStartGame={handleStartGame}
          play={play}
        />
      )}

      {screen === 'game' && (
        <>
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
            play={play}
          />

          {phase === 'reward' && (
            <RewardPopup
              reward={lastReward}
              onContinue={handleNextQuestion}
              play={play}
            />
          )}

          <SubscribePrompt
            show={showSubscribe}
            onDismiss={handleDismissSubscribe}
            play={play}
          />
        </>
      )}

      {screen === 'end' && (
        <EndScreen
          sessionItems={sessionItems}
          sessionStars={sessionStars}
          streak={streak}
          onPlayAgain={() => { play('buttonClick'); startGame(currentCategory); }}
          onGoHome={handleGoHome}
          play={play}
        />
      )}

      <MuteButton isMuted={isMuted} onToggle={toggleMute} />
    </div>
  );
}

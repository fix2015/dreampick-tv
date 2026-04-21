import HomeScreen from './components/HomeScreen';
import QuestionScreen from './components/QuestionScreen';
import EndScreen from './components/EndScreen';
import RewardPopup from './components/RewardPopup';
import SubscribePrompt from './components/SubscribePrompt';
import { useGameState } from './hooks/useGameState';

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

  return (
    <div className="min-h-screen">
      {screen === 'home' && (
        <HomeScreen
          categories={categories}
          onStartGame={startGame}
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
            onSelectCard={selectCard}
            onCountdownComplete={onCountdownComplete}
            onCollectReward={collectReward}
          />

          {phase === 'reward' && (
            <RewardPopup
              reward={lastReward}
              onContinue={nextQuestion}
            />
          )}

          <SubscribePrompt
            show={showSubscribe}
            onDismiss={dismissSubscribe}
          />
        </>
      )}

      {screen === 'end' && (
        <EndScreen
          sessionItems={sessionItems}
          sessionStars={sessionStars}
          streak={streak}
          onPlayAgain={() => startGame(currentCategory)}
          onGoHome={goHome}
        />
      )}
    </div>
  );
}

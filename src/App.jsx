import { useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import QuestionScreen from './components/QuestionScreen';
import EndScreen from './components/EndScreen';
import RewardPopup from './components/RewardPopup';
import SubscribePrompt from './components/SubscribePrompt';
import MuteButton from './components/MuteButton';
import PassDevice from './components/PassDevice';
import OfflineScreen from './components/OfflineScreen';
import { useConnectivity } from './hooks/useConnectivity';
import { useGameState } from './hooks/useGameState';
import { useSound } from './hooks/useSound';
import { stopPromptVoice } from './audio/promptVoice';

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
        </>
      )}

      {screen === 'end' && (
        <EndScreen
          sessionItems={sessionItems}
          duoResults={players === 2 ? duoResults : null}
          sessionStars={sessionStars}
          streak={streak}
          onPlayAgain={() => { play('buttonClick'); startGame(currentCategory, players); }}
          onGoHome={handleGoHome}
          play={play}
        />
      )}

      <MuteButton isMuted={isMuted} onToggle={toggleMute} />

      {!online && <OfflineScreen checking={checking} onRetry={retry} />}
    </div>
  );
}

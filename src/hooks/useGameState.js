import { useState, useCallback, useRef } from 'react';
import { shuffleArray, determineRarity, getStarsForRarity } from '../utils/helpers';
import { addCollectedItem, markGameComplete, loadProgress } from '../utils/storage';
import { getDailyQuestion, recordDailyPlayed } from '../utils/daily';
import gameData from '../data/questions.json';

const QUESTIONS_PER_GAME = 10;
const SUBSCRIBE_INTERVAL = 4;

export function useGameState() {
  const [screen, setScreen] = useState('home');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [phase, setPhase] = useState('choosing'); // choosing | countdown | reveal | reward
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [sessionItems, setSessionItems] = useState([]);
  const [streak, setStreak] = useState(0);
  const [dreamEnergy, setDreamEnergy] = useState(0);
  const [sessionStars, setSessionStars] = useState(0);
  const [lastReward, setLastReward] = useState(null);
  // Pass-and-play (2 players answer the same question)
  const [players, setPlayers] = useState(1);
  const [turn, setTurn] = useState(1);
  const [firstPick, setFirstPick] = useState(null);
  const [duoResults, setDuoResults] = useState([]);
  const questionsAnswered = useRef(0);

  const categories = gameData.categories;
  const dailyQuestion = getDailyQuestion(gameData.questions);

  const startGame = useCallback((categoryId, playerCount = 1) => {
    let pool;
    if (categoryId === 'daily') {
      pool = [getDailyQuestion(gameData.questions)];
    } else if (categoryId === 'random_mix') {
      pool = shuffleArray(gameData.questions);
    } else {
      pool = shuffleArray(gameData.questions.filter(q => q.categoryId === categoryId));
    }
    const selected = pool.slice(0, Math.min(QUESTIONS_PER_GAME, pool.length));
    setQuestions(selected);
    setCurrentIndex(0);
    setCurrentCategory(categoryId);
    setSelectedCard(null);
    setPhase('choosing');
    setSessionItems([]);
    setStreak(0);
    setDreamEnergy(0);
    setSessionStars(0);
    setShowSubscribe(false);
    setLastReward(null);
    setPlayers(categoryId === 'daily' ? 1 : playerCount);
    setTurn(1);
    setFirstPick(null);
    setDuoResults([]);
    questionsAnswered.current = 0;
    setScreen('game');
  }, []);

  const selectCard = useCallback((cardIndex) => {
    if (phase !== 'choosing') return;
    if (players === 2 && turn === 1) {
      setFirstPick(cardIndex);
      setPhase('pass');
      return;
    }
    setSelectedCard(cardIndex);
    setPhase('countdown');
  }, [phase, players, turn]);

  const passToPlayer2 = useCallback(() => {
    setTurn(2);
    setPhase('choosing');
  }, []);

  const onCountdownComplete = useCallback(() => {
    setPhase('reveal');
  }, []);

  const collectReward = useCallback(() => {
    const question = questions[currentIndex];
    if (!question) return;

    const isMysteryPick = selectedCard === 2;
    const rarity = isMysteryPick ?
      (Math.random() < 0.4 ? 'rare' : Math.random() < 0.15 ? 'legendary' : 'uncommon') :
      determineRarity();
    const stars = getStarsForRarity(rarity);
    const isBonus = Math.random() < 0.15;
    const totalStars = isBonus ? stars * 2 : stars;

    const item = {
      id: `${question.id}_${selectedCard}_${Date.now()}`,
      questionId: question.id,
      prompt: question.prompt,
      image: question.options[selectedCard].image,
      rarity,
      stars: totalStars,
      isLucky: isMysteryPick,
      isBonus,
      categoryId: question.categoryId,
    };

    if (players === 2) {
      const options = question.options;
      setDuoResults(prev => [...prev, {
        questionId: question.id,
        prompt: question.prompt,
        p1: firstPick,
        p2: selectedCard,
        p1Image: options[firstPick].image,
        p2Image: options[selectedCard].image,
      }]);
    }

    setLastReward(item);
    setSessionItems(prev => [...prev, item]);
    setSessionStars(prev => prev + totalStars);
    setStreak(prev => prev + 1);
    setDreamEnergy(prev => Math.min(prev + (isMysteryPick ? 20 : 10), 100));
    addCollectedItem(item);

    setPhase('reward');
  }, [questions, currentIndex, selectedCard, players, firstPick]);

  const finishGame = useCallback(() => {
    markGameComplete(streak);
    if (currentCategory === 'daily') recordDailyPlayed();
    setScreen('end');
  }, [streak, currentCategory]);

  const nextQuestion = useCallback(() => {
    questionsAnswered.current += 1;

    if (questionsAnswered.current % SUBSCRIBE_INTERVAL === 0 &&
        questionsAnswered.current < questions.length) {
      setShowSubscribe(true);
      return;
    }

    if (currentIndex + 1 >= questions.length) {
      finishGame();
      return;
    }

    setCurrentIndex(prev => prev + 1);
    setSelectedCard(null);
    setPhase('choosing');
    setLastReward(null);
    setTurn(1);
    setFirstPick(null);
  }, [currentIndex, questions.length, finishGame]);

  const dismissSubscribe = useCallback(() => {
    setShowSubscribe(false);
    if (currentIndex + 1 >= questions.length) {
      finishGame();
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setSelectedCard(null);
    setPhase('choosing');
    setLastReward(null);
    setTurn(1);
    setFirstPick(null);
  }, [currentIndex, questions.length, finishGame]);

  const goHome = useCallback(() => {
    setScreen('home');
  }, []);

  const currentQuestion = questions[currentIndex] || null;
  const progress = loadProgress();

  return {
    screen,
    categories,
    dailyQuestion,
    currentCategory,
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
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
    progress,
    startGame,
    selectCard,
    passToPlayer2,
    onCountdownComplete,
    collectReward,
    nextQuestion,
    dismissSubscribe,
    goHome,
  };
}

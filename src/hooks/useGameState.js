import { useState, useCallback, useRef } from 'react';
import { shuffleArray, determineRarity, getStarsForRarity } from '../utils/helpers';
import { addCollectedItem, markGameComplete, loadProgress } from '../utils/storage';
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
  const questionsAnswered = useRef(0);

  const categories = gameData.categories;

  const startGame = useCallback((categoryId) => {
    let pool;
    if (categoryId === 'random_mix') {
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
    questionsAnswered.current = 0;
    setScreen('game');
  }, []);

  const selectCard = useCallback((cardIndex) => {
    if (phase !== 'choosing') return;
    setSelectedCard(cardIndex);
    setPhase('countdown');
  }, [phase]);

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

    setLastReward(item);
    setSessionItems(prev => [...prev, item]);
    setSessionStars(prev => prev + totalStars);
    setStreak(prev => prev + 1);
    setDreamEnergy(prev => Math.min(prev + (isMysteryPick ? 20 : 10), 100));
    addCollectedItem(item);

    setPhase('reward');
  }, [questions, currentIndex, selectedCard]);

  const nextQuestion = useCallback(() => {
    questionsAnswered.current += 1;

    if (questionsAnswered.current % SUBSCRIBE_INTERVAL === 0 &&
        questionsAnswered.current < questions.length) {
      setShowSubscribe(true);
      return;
    }

    if (currentIndex + 1 >= questions.length) {
      markGameComplete(streak);
      setScreen('end');
      return;
    }

    setCurrentIndex(prev => prev + 1);
    setSelectedCard(null);
    setPhase('choosing');
    setLastReward(null);
  }, [currentIndex, questions.length, streak]);

  const dismissSubscribe = useCallback(() => {
    setShowSubscribe(false);
    if (currentIndex + 1 >= questions.length) {
      markGameComplete(streak);
      setScreen('end');
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setSelectedCard(null);
    setPhase('choosing');
    setLastReward(null);
  }, [currentIndex, questions.length, streak]);

  const goHome = useCallback(() => {
    setScreen('home');
  }, []);

  const currentQuestion = questions[currentIndex] || null;
  const progress = loadProgress();

  return {
    screen,
    categories,
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
    progress,
    startGame,
    selectCard,
    onCountdownComplete,
    collectReward,
    nextQuestion,
    dismissSubscribe,
    goHome,
  };
}

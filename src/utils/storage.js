const STORAGE_KEY = 'dreampick_tv_progress';

function getDefaultState() {
  return {
    totalStars: 0,
    totalGamesPlayed: 0,
    bestStreak: 0,
    collectedItems: [],
    seenQuestions: [],
    luckyPicks: 0,
    rareFinds: 0,
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    return { ...getDefaultState(), ...JSON.parse(raw) };
  } catch {
    return getDefaultState();
  }
}

export function saveProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

export function addCollectedItem(item) {
  const progress = loadProgress();
  if (!progress.collectedItems.find(i => i.id === item.id)) {
    progress.collectedItems.push(item);
  }
  progress.totalStars += item.stars || 1;
  if (item.isLucky) progress.luckyPicks++;
  if (item.rarity === 'rare' || item.rarity === 'legendary') progress.rareFinds++;
  saveProgress(progress);
  return progress;
}

export function markGameComplete(streak) {
  const progress = loadProgress();
  progress.totalGamesPlayed++;
  if (streak > progress.bestStreak) progress.bestStreak = streak;
  saveProgress(progress);
  return progress;
}

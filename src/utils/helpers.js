export function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function pickRandom(arr, count) {
  return shuffleArray(arr).slice(0, count);
}

export function determineRarity() {
  const roll = Math.random();
  if (roll < 0.05) return 'legendary';
  if (roll < 0.20) return 'rare';
  if (roll < 0.45) return 'uncommon';
  return 'common';
}

export function getRarityLabel(rarity) {
  const labels = {
    common: 'Common',
    uncommon: 'Uncommon',
    rare: '✨ Rare!',
    legendary: '🌟 Legendary!',
  };
  return labels[rarity] || 'Common';
}

export function getRarityColor(rarity) {
  const colors = {
    common: '#9CA3AF',
    uncommon: '#60A5FA',
    rare: '#A78BFA',
    legendary: '#FBBF24',
  };
  return colors[rarity] || '#9CA3AF';
}

export function getStarsForRarity(rarity) {
  const stars = { common: 1, uncommon: 2, rare: 3, legendary: 5 };
  return stars[rarity] || 1;
}

const LOADING_PHRASES = [
  "Mixing dream ingredients...",
  "Polishing the mystery box...",
  "Summoning dream energy...",
  "Loading magical picks...",
  "Preparing your adventure...",
  "Charging dream crystals...",
  "Waking up the unicorns...",
  "Sprinkling star dust...",
];

export function getRandomLoadingPhrase() {
  return LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)];
}

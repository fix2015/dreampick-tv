const DAILY_KEY = 'dreampick_tv_daily';

/** Calendar date in UTC (YYYY-MM-DD) so everyone gets the same Daily Pick. */
export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function previousDayKey(key) {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return todayKey(d);
}

/** Deterministic 32-bit hash (FNV-1a) of a string. */
function hashString(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** The question of the day, seeded by the date. */
export function getDailyQuestion(questions, key = todayKey()) {
  if (!questions.length) return null;
  return questions[hashString(`dreampick-${key}`) % questions.length];
}

export function loadDaily() {
  const fallback = { lastPlayed: null, streak: 0, bestStreak: 0 };
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

/** Streak that is still alive today (0 if the player missed a day). */
export function currentStreak(daily = loadDaily(), key = todayKey()) {
  if (daily.lastPlayed === key || daily.lastPlayed === previousDayKey(key)) return daily.streak;
  return 0;
}

export function isDailyDone(daily = loadDaily(), key = todayKey()) {
  return daily.lastPlayed === key;
}

/** Record today's Daily Pick as played and update the streak. */
export function recordDailyPlayed(key = todayKey()) {
  const daily = loadDaily();
  if (daily.lastPlayed === key) return daily;
  const streak = daily.lastPlayed === previousDayKey(key) ? daily.streak + 1 : 1;
  const next = { lastPlayed: key, streak, bestStreak: Math.max(streak, daily.bestStreak) };
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable
  }
  return next;
}

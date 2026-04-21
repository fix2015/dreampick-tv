/**
 * SoundEngine — Web Audio API synthesizer for DreamPick TV.
 * Singleton: import { SoundEngine } from './SoundEngine' and call SoundEngine.play('cardPick').
 * All sounds are generated at runtime — zero audio files needed.
 */

let ctx = null;
let masterGain = null;
let bgmGain = null;
let bgmInterval = null;
let muted = false;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    bgmGain = ctx.createGain();
    bgmGain.gain.value = 0.15;
    bgmGain.connect(masterGain);
  }
  return ctx;
}

function resume() {
  const c = getCtx();
  if (c.state === 'suspended') c.resume();
}

// --- Helpers ---

function osc(type, freq, startTime, duration, gainVal = 0.3, dest = masterGain) {
  const c = getCtx();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(gainVal, startTime);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  o.connect(g);
  g.connect(dest);
  o.start(startTime);
  o.stop(startTime + duration);
}

function noise(duration, startTime, filterFreq = 3000, gainVal = 0.15) {
  const c = getCtx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(filterFreq, startTime);
  filter.Q.value = 1;
  const g = c.createGain();
  g.gain.setValueAtTime(gainVal, startTime);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  src.connect(filter);
  filter.connect(g);
  g.connect(masterGain);
  src.start(startTime);
  src.stop(startTime + duration);
  return { filter, gain: g };
}

// --- Sound definitions ---

const sounds = {
  buttonClick() {
    const c = getCtx();
    const t = c.currentTime;
    osc('triangle', 1200, t, 0.06, 0.2);
  },

  cardPick() {
    const c = getCtx();
    const t = c.currentTime;
    osc('sine', 523, t, 0.12, 0.25);
    osc('sine', 659, t + 0.08, 0.15, 0.2);
  },

  countdownTick() {
    const c = getCtx();
    const t = c.currentTime;
    osc('square', 880, t, 0.05, 0.15);
  },

  cardReveal() {
    const c = getCtx();
    const t = c.currentTime;
    // Shimmer sweep
    const { filter } = noise(0.5, t, 3000, 0.12);
    filter.frequency.exponentialRampToValueAtTime(500, t + 0.5);
    // Rising tone
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(400, t);
    o.frequency.exponentialRampToValueAtTime(800, t + 0.4);
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o.connect(g);
    g.connect(masterGain);
    o.start(t);
    o.stop(t + 0.5);
  },

  rewardCommon() {
    const c = getCtx();
    const t = c.currentTime;
    osc('sine', 880, t, 0.3, 0.2);
    osc('sine', 1047, t + 0.1, 0.25, 0.15);
  },

  rewardRare() {
    const c = getCtx();
    const t = c.currentTime;
    // C5 - E5 - G5 arpeggio
    osc('sine', 523, t, 0.2, 0.25);
    osc('sine', 659, t + 0.12, 0.2, 0.25);
    osc('sine', 784, t + 0.24, 0.35, 0.3);
    // Shimmer
    noise(0.4, t + 0.2, 4000, 0.06);
  },

  rewardLegendary() {
    const c = getCtx();
    const t = c.currentTime;
    // 5-note fanfare: C5 - D5 - E5 - G5 - C6
    const notes = [523, 587, 659, 784, 1047];
    notes.forEach((freq, i) => {
      osc('sine', freq, t + i * 0.1, 0.35, 0.25);
      osc('sine', freq * 2, t + i * 0.1, 0.25, 0.08); // harmonic
    });
    // Big shimmer
    noise(0.8, t + 0.15, 5000, 0.08);
    noise(0.5, t + 0.4, 2000, 0.06);
  },

  confetti() {
    const c = getCtx();
    const t = c.currentTime;
    // Burst of random sparkle blips
    for (let i = 0; i < 12; i++) {
      const freq = 1500 + Math.random() * 3000;
      const delay = Math.random() * 0.4;
      osc('sine', freq, t + delay, 0.06, 0.08);
    }
    noise(0.3, t, 6000, 0.04);
  },

  subscribeAppear() {
    const c = getCtx();
    const t = c.currentTime;
    // G5 - E5 gentle descending
    osc('sine', 784, t, 0.2, 0.2);
    osc('sine', 659, t + 0.15, 0.3, 0.18);
  },
};

// --- Background Music ---

const BGM_NOTES = [523, 587, 659, 784, 880, 784, 659, 587]; // C5 pentatonic-ish loop
let bgmStep = 0;

function bgmTick() {
  if (muted || !ctx) return;
  const t = ctx.currentTime;
  const freq = BGM_NOTES[bgmStep % BGM_NOTES.length];
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.value = freq;
  // Detune slightly for warmth
  o.detune.value = (Math.random() - 0.5) * 10;
  g.gain.setValueAtTime(0.12, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  o.connect(g);
  g.connect(bgmGain);
  o.start(t);
  o.stop(t + 0.7);

  // Soft pad underneath every 2 beats
  if (bgmStep % 2 === 0) {
    const pad = ctx.createOscillator();
    const pg = ctx.createGain();
    pad.type = 'triangle';
    pad.frequency.value = freq / 2;
    pg.gain.setValueAtTime(0.06, t);
    pg.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
    pad.connect(pg);
    pg.connect(bgmGain);
    pad.start(t);
    pad.stop(t + 1.1);
  }

  bgmStep++;
}

function startBgm() {
  if (bgmInterval) return;
  resume();
  bgmStep = 0;
  bgmTick();
  bgmInterval = setInterval(bgmTick, 450);
}

function stopBgm() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}

// --- Public API ---

export const SoundEngine = {
  resume,

  play(id) {
    if (muted) return;
    resume();
    if (sounds[id]) sounds[id]();
  },

  startBgm,
  stopBgm,

  setMuted(val) {
    muted = val;
    if (masterGain) masterGain.gain.value = val ? 0 : 1;
    if (val) stopBgm();
  },

  isMuted() {
    return muted;
  },
};

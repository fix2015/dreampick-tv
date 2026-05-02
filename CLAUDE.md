# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint across the project
- `npm run preview` — preview production build locally
- `npm run deploy` — build and deploy to GitHub Pages via gh-pages

### Capacitor (native mobile builds)

- `npm run cap:ios` — build for Capacitor, sync, and open Xcode
- `npm run cap:android` — build for Capacitor, sync, and open Android Studio
- `npm run cap:sync` — build for Capacitor and sync to native projects
- `npm run build:cap` — Vite build with `CAPACITOR=1` (sets base path to `/` instead of `/dreampick-tv/`)

## Architecture

This is **DreamPick TV**, a React quiz/collectible game where players pick mystery cards to earn rewards with rarity tiers. Built with React 19, Vite 8, Tailwind CSS 4, and Framer Motion.

### Game Flow

Three screens controlled by `useGameState` hook (`src/hooks/useGameState.js`):
1. **HomeScreen** — category selection from `src/data/questions.json`
2. **QuestionScreen** — card-picking game with phases: `choosing → countdown → reveal → reward`
3. **EndScreen** — session summary with collected items and stats

### State Management

All game state lives in the `useGameState` custom hook — no external state library. This single hook manages screen navigation, game progression, reward calculation, and streak tracking. It returns ~20 values/callbacks consumed by `App.jsx`.

### Key Concepts

- **Rarity system**: Items are common/uncommon/rare/legendary with weighted random rolls (`src/utils/helpers.js`). Card index 2 is the "mystery pick" with boosted rare/legendary odds.
- **Dream Energy**: Fills 0–100 per session; mystery picks give 20, regular picks give 10.
- **Persistence**: `localStorage` via `src/utils/storage.js` under key `dreampick_tv_progress`. Tracks lifetime stats (stars, streaks, collected items).
- **Subscribe prompt**: Shown every 4 questions (`SUBSCRIBE_INTERVAL`), pauses game flow.
- **Themes**: Rotating color palettes in `src/utils/themes.js`, cycled by index.

### Audio System

`src/audio/SoundEngine.js` manages all sound effects via Web Audio API. The `useSound` hook (`src/hooks/useSound.js`) wraps SoundEngine with React state for mute toggle (persisted to localStorage under `dreampick_tv_muted`). AudioContext is unlocked on first user gesture (touch/click) to satisfy mobile autoplay policies. TTS voice prompts are handled separately in `src/audio/promptVoice.js`.

### Project Structure

Flat layout — all components live directly in `src/components/`, all utilities in `src/utils/`, and both custom hooks (`useGameState`, `useSound`) in `src/hooks/`. No nested folders, no routing library. Game data (questions/categories) is a static JSON import from `src/data/questions.json`.

### Tech Notes

- JSX files (not TypeScript), ES modules throughout
- Tailwind v4 integrated via `@tailwindcss/vite` plugin (no `tailwind.config.js`)
- Vite base path: `/dreampick-tv/` for GitHub Pages, `/` when `CAPACITOR=1` env is set
- ESLint ignores unused vars matching `^[A-Z_]` pattern (for React component imports)
- Capacitor config (`capacitor.config.json`): appId `tv.dreampick.app`, serves from `dist/`
- No test framework configured — no unit or integration tests

import { createContext, useContext } from 'react';
import en from './en.json';
import pl from './pl.json';
import uk from './uk.json';
import es from './es.json';

const DICTS = { en, pl, uk, es };
const LANG_KEY = 'dreampick_tv_lang';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pl', label: 'Polski' },
  { code: 'uk', label: 'Українська' },
  { code: 'es', label: 'Español' },
];

export function detectLanguage() {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored && DICTS[stored]) return stored;
  } catch {
    // storage unavailable
  }
  const preferred = typeof navigator !== 'undefined' ? (navigator.languages || [navigator.language]) : [];
  for (const tag of preferred) {
    const code = String(tag || '').toLowerCase().split('-')[0];
    if (DICTS[code]) return code;
  }
  return 'en';
}

export function storeLanguage(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // storage unavailable
  }
}

/**
 * Look up `key` for `lang` (falling back to English), pick a plural form
 * when the entry is an object and `vars.count` is set, and fill {placeholders}.
 */
export function translate(lang, key, vars) {
  let entry = DICTS[lang]?.[key] ?? en[key] ?? key;
  if (entry && typeof entry === 'object') {
    const form = new Intl.PluralRules(lang).select(vars?.count ?? 0);
    entry = entry[form] ?? entry.other;
  }
  if (!vars) return entry;
  return entry.replace(/\{(\w+)\}/g, (m, name) => (vars[name] ?? m));
}

export const I18nContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key, vars) => translate('en', key, vars),
});

export function useI18n() {
  return useContext(I18nContext);
}

/** "CHOOSE YOUR TREEHOUSE" -> localized noun ("domek na drzewie", ...). */
export function questionNoun(t, prompt) {
  const english = prompt.replace(/^CHOOSE YOUR\s+/i, '').toLowerCase();
  return t(`noun.${english}`) === `noun.${english}` ? english : t(`noun.${english}`);
}

/** Localized question title, e.g. "Choose your bed" / "Wybierz: łóżko". */
export function questionTitle(t, prompt) {
  return t('question.prompt', { noun: questionNoun(t, prompt) });
}

import { LANGUAGES, useI18n } from '../i18n/i18n';

export default function LanguagePicker() {
  const { lang, setLang, t } = useI18n();

  return (
    <label
      className="flex items-center text-white/80"
      style={{ gap: 'var(--sp-8)', marginTop: 'var(--sp-16)', fontSize: 'var(--text-sm)' }}
    >
      <span aria-hidden="true">🌐</span>
      <span>{t('home.language')}</span>
      <select
        value={lang}
        onChange={e => setLang(e.target.value)}
        className="bg-white/20 text-white font-bold border-2 border-white/30 cursor-pointer"
        style={{ borderRadius: 'var(--radius-md)', padding: 'var(--sp-4) var(--sp-8)', minHeight: '44px' }}
      >
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code} style={{ color: '#1F2937' }}>{l.label}</option>
        ))}
      </select>
    </label>
  );
}

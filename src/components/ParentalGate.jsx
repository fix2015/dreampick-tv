import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ANSWER = '12'; // 7 + 5
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'];

/**
 * Parental gate (App Store guideline 1.3 / 5.1.4): an adult must answer
 * a simple sum before the app leaves to an external site.
 * A wrong answer closes the dialog.
 */
export default function ParentalGate({ onPass, onCancel }) {
  const [value, setValue] = useState('');
  const dialogRef = useRef(null);
  const firstKeyRef = useRef(null);

  const submit = (v) => {
    if (v === ANSWER) onPass();
    else onCancel();
  };

  const press = (key) => {
    if (key === 'del') {
      setValue(v => v.slice(0, -1));
    } else if (key === 'ok') {
      submit(value);
    } else if (value.length < 2) {
      const next = value + key;
      setValue(next);
      if (next.length === 2) submit(next);
    }
  };

  // Focus management: focus the keypad on open, restore focus on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    firstKeyRef.current?.focus();
    return () => {
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, []);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
      return;
    }
    if (e.key === 'Tab') {
      // Keep focus inside the dialog
      const focusable = dialogRef.current.querySelectorAll('button');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 100, backgroundColor: 'rgba(0,0,0,0.6)', padding: 'var(--safe-inset)' }}
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="parental-gate-title"
        aria-describedby="parental-gate-question"
        className="bg-white text-center w-full"
        style={{
          maxWidth: '320px',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--sp-24)',
          boxShadow: 'var(--shadow-popup)',
        }}
        onClick={e => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <h2 id="parental-gate-title" className="font-bold text-gray-800" style={{ fontSize: 'var(--text-xl)' }}>
          Ask a grown-up
        </h2>
        <p id="parental-gate-question" className="text-gray-700" style={{ fontSize: 'var(--text-lg)', marginTop: 'var(--sp-8)' }}>
          What is 7 + 5?
        </p>

        <output
          aria-live="polite"
          aria-label="Your answer"
          className="block font-bold text-gray-900"
          style={{
            fontSize: 'var(--text-2xl)',
            minHeight: '1.5em',
            margin: 'var(--sp-12) 0',
            borderBottom: '2px solid #E5E7EB',
          }}
        >
          {value || ' '}
        </output>

        <div className="grid grid-cols-3" style={{ gap: 'var(--sp-8)' }}>
          {KEYS.map((key, i) => (
            <button
              key={key}
              ref={i === 0 ? firstKeyRef : undefined}
              type="button"
              onClick={() => press(key)}
              aria-label={key === 'del' ? 'Delete' : key === 'ok' ? 'Check answer' : key}
              className="font-bold cursor-pointer border-none"
              style={{
                minHeight: '48px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-lg)',
                background: key === 'ok' ? 'var(--color-gold)' : '#F3F4F6',
                color: '#1F2937',
              }}
            >
              {key === 'del' ? '⌫' : key === 'ok' ? 'OK' : key}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 underline cursor-pointer border-none bg-transparent"
          style={{ marginTop: 'var(--sp-16)', fontSize: 'var(--text-sm)', minHeight: '44px' }}
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body,
  );
}

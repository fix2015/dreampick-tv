import { motion } from 'framer-motion';
import { img } from '../utils/assets';

function promptToTitle(prompt) {
  const lower = prompt.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export default function DailyPickCard({ question, streak, done, onPlay }) {
  if (!question) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onPlay}
      className="dp-glass w-full flex items-center text-left cursor-pointer border-2 border-white/30"
      style={{ maxWidth: '56rem', gap: 'var(--sp-16)', padding: 'var(--sp-12) var(--sp-16)', marginBottom: 'var(--sp-24)' }}
    >
      <div className="flex shrink-0" style={{ gap: 'var(--sp-4)' }} aria-hidden="true">
        {question.options.map((opt) => (
          <img
            key={opt.id}
            src={img(opt.isMystery ? 'mystery_box.png' : opt.image)}
            alt=""
            className="object-cover"
            style={{ width: '48px', height: '64px', borderRadius: 'var(--radius-md)', background: opt.isMystery ? '#FFB300' : undefined }}
          />
        ))}
      </div>
      <div className="flex-1 flex flex-col" style={{ gap: 'var(--sp-4)' }}>
        <span className="text-white/80 font-bold uppercase tracking-wide" style={{ fontSize: 'var(--text-xs)' }}>
          📅 Daily Pick
        </span>
        <span className="text-white font-bold" style={{ fontSize: 'var(--text-lg)' }}>
          {promptToTitle(question.prompt)}
        </span>
        <span className="text-white/80" style={{ fontSize: 'var(--text-sm)' }}>
          {done ? '✅ Done today! Come back tomorrow' : 'Same pick for everyone today'}
          {streak > 0 && ` · 🔥 ${streak}-day streak`}
        </span>
      </div>
    </motion.button>
  );
}

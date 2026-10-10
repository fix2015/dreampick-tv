import { motion } from 'framer-motion';
import { img } from '../utils/assets';
import { promptNoun, duoAgreed } from '../utils/duo';

export default function DuoSummary({ results }) {
  const agreedCount = results.filter(duoAgreed).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="dp-glass w-full flex flex-col"
      style={{ padding: 'var(--sp-16)', gap: 'var(--sp-12)' }}
      aria-labelledby="duo-summary-title"
    >
      <h2 id="duo-summary-title" className="text-white font-bold text-center" style={{ fontSize: 'var(--text-xl)' }}>
        👯 You agreed on {agreedCount} of {results.length} picks!
      </h2>
      <ul className="flex flex-col" style={{ gap: 'var(--sp-8)' }}>
        {results.map((r) => {
          const agreed = duoAgreed(r);
          const noun = promptNoun(r.prompt);
          return (
            <li key={r.questionId} className="flex items-center" style={{ gap: 'var(--sp-12)' }}>
              <div className="flex shrink-0" style={{ gap: 'var(--sp-4)' }} aria-hidden="true">
                <img src={img(r.p1Image)} alt="" className="object-cover" style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)' }} />
                {!agreed && (
                  <img src={img(r.p2Image)} alt="" className="object-cover" style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)' }} />
                )}
              </div>
              <span className="text-white" style={{ fontSize: 'var(--text-sm)' }}>
                {agreed ? `🤝 You both picked the ${noun}!` : `🙃 Different picks for the ${noun}`}
              </span>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}

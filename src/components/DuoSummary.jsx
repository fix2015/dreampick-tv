import { motion } from 'framer-motion';
import { img } from '../utils/assets';
import { duoAgreed } from '../utils/duo';
import { useI18n, questionNoun } from '../i18n/i18n';

export default function DuoSummary({ results }) {
  const { t } = useI18n();
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
        {t('duo.summary', { agreed: agreedCount, total: results.length })}
      </h2>
      <ul className="flex flex-col" style={{ gap: 'var(--sp-8)' }}>
        {results.map((r) => {
          const agreed = duoAgreed(r);
          const noun = questionNoun(t, r.prompt);
          return (
            <li key={r.questionId} className="flex items-center" style={{ gap: 'var(--sp-12)' }}>
              <div className="flex shrink-0" style={{ gap: 'var(--sp-4)' }} aria-hidden="true">
                <img src={img(r.p1Image)} alt="" className="object-cover" style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)' }} />
                {!agreed && (
                  <img src={img(r.p2Image)} alt="" className="object-cover" style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)' }} />
                )}
              </div>
              <span className="text-white" style={{ fontSize: 'var(--text-sm)' }}>
                {t(agreed ? 'duo.agreed' : 'duo.different', { noun })}
              </span>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}

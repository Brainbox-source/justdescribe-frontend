import { ArrowUp } from 'lucide-react'
import { toDisplayText } from '../utils/format'
import { CopyButton } from './CopyButton'

const LABEL_CLASSES =
  'font-sans text-xs font-semibold tracking-wider text-black/60 uppercase'

const BADGE_CLASSES =
  'inline-block rounded-xl bg-brand-navy/8 px-3.5 py-2 text-base font-semibold text-brand-navy'

/**
 * @param {{
 *   recommendation: import('../api/tickets').Recommendation,
 *   onDescribeAnother: () => void
 * }} props
 */
export function ResultCard({ recommendation, onDescribeAnother }) {
  return (
    <section className="w-full rounded-[32px] bg-white p-6 shadow-[0_24px_60px_-24px_rgba(6,30,50,0.3)]">
      <div className="flex items-center justify-between">
        <h2 className={LABEL_CLASSES}>Subject</h2>
        <CopyButton text={recommendation.subject} label="Copy subject" />
      </div>
      <p className="mt-2 text-lg font-bold">{recommendation.subject}</p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <h2 className={LABEL_CLASSES}>Classification</h2>
          <p className="mt-3">
            <span className={BADGE_CLASSES}>
              {toDisplayText(recommendation.classification)}
            </span>
          </p>
        </div>
        <div>
          <h2 className={LABEL_CLASSES}>Case</h2>
          <p className="mt-3">
            <span className={BADGE_CLASSES}>
              {toDisplayText(recommendation.case)}
            </span>
          </p>
        </div>
        <div>
          <h2 className={LABEL_CLASSES}>Nature of case</h2>
          <p className="mt-3">
            <span className={BADGE_CLASSES}>
              {toDisplayText(recommendation.natureOfCase)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className={LABEL_CLASSES}>Description</h2>
        <CopyButton
          text={recommendation.description}
          label="Copy description"
        />
      </div>
      <p className="mt-2 text-base leading-7 whitespace-pre-wrap">
        {recommendation.description}
      </p>

      <button
        type="button"
        onClick={onDescribeAnother}
        className="bg-brand-gradient mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-base font-semibold text-white"
      >
        <ArrowUp size={18} aria-hidden="true" />
        Describe another issue
      </button>
    </section>
  )
}

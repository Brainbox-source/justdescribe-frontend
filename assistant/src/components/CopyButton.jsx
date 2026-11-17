import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const RESET_DELAY_MS = 2000

/**
 * @param {{ text: string, label: string }} props
 */
export function CopyButton({ text, label }) {
  /** @type {['idle' | 'copied' | 'failed', Function]} */
  const [copyState, setCopyState] = useState('idle')
  const resetTimerRef = useRef(undefined)

  useEffect(() => {
    return () => {
      window.clearTimeout(resetTimerRef.current)
    }
  }, [])

  /** @returns {Promise<void>} */
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }

    window.clearTimeout(resetTimerRef.current)
    resetTimerRef.current = window.setTimeout(() => {
      setCopyState('idle')
    }, RESET_DELAY_MS)
  }

  const visibleText =
    copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Failed' : 'Copy'

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        void handleCopy()
      }}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy/5"
    >
      {copyState === 'copied' ? (
        <Check size={16} aria-hidden="true" />
      ) : (
        <Copy size={16} aria-hidden="true" />
      )}
      <span aria-live="polite">{visibleText}</span>
    </button>
  )
}

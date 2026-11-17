import { ArrowUp } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { MAX_DESCRIPTION_LENGTH, MIN_DESCRIPTION_LENGTH } from '../constants'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { LogoLoader } from './LogoLoader'

/**
 * @param {{
 *   description: string,
 *   onDescriptionChange: (value: string) => void,
 *   onSubmit: () => void,
 *   isSubmitting: boolean,
 *   errorMessage: string | null
 * }} props
 */
export function DescriptionForm({
  description,
  onDescriptionChange,
  onSubmit,
  isSubmitting,
  errorMessage,
}) {
  const textareaRef = useRef(null)
  const isOnline = useOnlineStatus()

  const trimmedLength = description.trim().length
  const isLongEnough = trimmedLength >= MIN_DESCRIPTION_LENGTH
  const canSubmit = isLongEnough && isOnline && !isSubmitting
  const showMinimumHint = description.length > 0 && !isLongEnough

  useEffect(() => {
    if (description.length > 0) {
      textareaRef.current?.focus()
    }
    // Runs once on mount: focus the box only when the student comes back to edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    const element = textareaRef.current

    if (element === null) {
      return
    }

    element.style.height = 'auto'
    element.style.height = `${element.scrollHeight}px`
  }, [description])

  /** @param {import('react').SyntheticEvent<HTMLFormElement>} event */
  function handleFormSubmit(event) {
    event.preventDefault()

    if (canSubmit) {
      onSubmit()
    }
  }

  /** @param {import('react').KeyboardEvent<HTMLTextAreaElement>} event */
  function handleKeyDown(event) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()

      if (canSubmit) {
        onSubmit()
      }
    }
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="w-full rounded-[32px] bg-white p-6 shadow-[0_24px_60px_-24px_rgba(6,30,50,0.3)]"
    >
      <div className="relative">
        <label htmlFor="description" className="sr-only">
          Describe your issue or enquiry
        </label>
        <textarea
          id="description"
          ref={textareaRef}
          rows={3}
          value={description}
          maxLength={MAX_DESCRIPTION_LENGTH}
          readOnly={isSubmitting}
          placeholder="e.g. my exam is on saturday but my cbt center is too far from where i live. can i change it?"
          onChange={(event) => {
            onDescriptionChange(event.target.value)
          }}
          onKeyDown={handleKeyDown}
          className="block max-h-[50dvh] w-full resize-none rounded-2xl border border-brand-tan bg-white p-4 pb-16 text-base leading-6 text-black placeholder:text-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/8"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          aria-label={
            isSubmitting ? 'Generating your recommendation' : 'Get recommendation'
          }
          aria-busy={isSubmitting}
          className="bg-brand-gradient absolute right-3 bottom-3 flex size-10 cursor-pointer items-center justify-center rounded-full text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? (
            <LogoLoader />
          ) : (
            <ArrowUp size={22} aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-4 font-mono text-xs text-black/60">
        <span>
           {showMinimumHint
             ? `At least ${MIN_DESCRIPTION_LENGTH} characters`
             : 'Review result before use.'}
        </span>
        <span>
          {description.length}/{MAX_DESCRIPTION_LENGTH}
        </span>
      </div>

      {!isOnline ? (
        <p role="status" className="mt-3 text-sm font-semibold text-brand-red">
          You are offline. Connect to the internet to continue.
        </p>
      ) : null}

      {errorMessage !== null ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-brand-red">
          {errorMessage}
        </p>
      ) : null}
    </form>
  )
}

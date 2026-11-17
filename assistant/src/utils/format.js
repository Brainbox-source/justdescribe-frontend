const ACRONYMS = ['LMS']

/**
 * Turns a backend value like "lms and classroom support" into
 * "LMS and classroom support".
 * @param {string} value
 * @returns {string}
 */
export function toDisplayText(value) {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return trimmed
  }

  let result = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)

  for (const acronym of ACRONYMS) {
    result = result.replace(new RegExp(`\\b${acronym}\\b`, 'gi'), acronym)
  }

  return result
}

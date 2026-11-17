import { useSyncExternalStore } from 'react'

/**
 * @param {() => void} onChange
 * @returns {() => void}
 */
function subscribe(onChange) {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)

  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
  }
}

/** @returns {boolean} */
function getSnapshot() {
  return navigator.onLine
}

/** @returns {boolean} */
function getServerSnapshot() {
  return true
}

/** @returns {boolean} */
export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

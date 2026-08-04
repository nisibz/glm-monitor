import { useEffect } from 'react'

export function usePolling(fn: () => void, interval: number) {
  useEffect(() => {
    const tick = () => {
      if (!document.hidden) fn()
    }
    const id = setInterval(tick, interval)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [fn, interval])
}

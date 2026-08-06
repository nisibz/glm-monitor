import { useCallback, useEffect, useState } from 'react'
import { fetchQuota, type Quota } from '@/data/quota'
import { usePolling } from '@/hooks/usePolling'

const POLL_INTERVAL = 60_000

export function useQuota() {
  const [quota, setQuota] = useState<Quota | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      setQuota(await fetchQuota())
      setLastUpdated(Date.now())
    } catch (e) {
      if (!silent)
        setError(e instanceof Error ? e.message : 'Failed to load quota')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  usePolling(() => void load(true), POLL_INTERVAL)

  return { quota, loading, error, retry: load, lastUpdated }
}

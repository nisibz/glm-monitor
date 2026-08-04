import { useCallback, useEffect, useState } from 'react'
import { fetchQuota, type Quota } from '@/data/quota'

export function useQuota() {
  const [quota, setQuota] = useState<Quota | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setQuota(await fetchQuota())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load quota')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { quota, loading, error, retry: load }
}

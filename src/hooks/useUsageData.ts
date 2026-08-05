import { useCallback, useEffect, useState } from 'react'
import { deriveDatasets, fetchHourlyMonth, type Dataset, type Row } from '@/data/usage'
import { usePolling } from '@/hooks/usePolling'

const POLL_INTERVAL = 3_600_000

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: '7 Days' },
  { id: 'month', label: '30 Days' },
]

export function useUsageData() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [hourlyMonth, setHourlyMonth] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      // single source: 4 chunked hourly calls cover 30 days; today/week/month are derived from it
      const hourly = await fetchHourlyMonth()
      setHourlyMonth(hourly)
      setDatasets(deriveDatasets(hourly))
      setLastUpdated(Date.now())
    } catch (e) {
      if (!silent) setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  usePolling(() => void load(true), POLL_INTERVAL)

  return { datasets, hourlyMonth, loading, error, retry: load, tabs: TABS, lastUpdated }
}

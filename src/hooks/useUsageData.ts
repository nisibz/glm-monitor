import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type Dataset,
  deriveDatasets,
  fetchHourlyMonth,
  type Row,
} from '@/data/usage'
import { usePolling } from '@/hooks/usePolling'

const POLL_INTERVAL = 3_600_000

export function useUsageData() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [hourlyMonth, setHourlyMonth] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  // Past-day rows never change; fetch them once, then only the moving window.
  const rowsRef = useRef(new Map<string, Row>())
  const hasOldRef = useRef(false)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const rows = await fetchHourlyMonth(new Date(), !hasOldRef.current)
      const map = rowsRef.current
      for (const r of rows) map.set(r.time, r)
      if (rows.length > 0) hasOldRef.current = true
      const hourly = [...map.values()].sort((a, b) =>
        a.time.localeCompare(b.time),
      )
      setHourlyMonth(hourly)
      setDatasets(deriveDatasets(hourly))
      setLastUpdated(Date.now())
    } catch (e) {
      if (!silent)
        setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  usePolling(() => void load(true), POLL_INTERVAL)

  return {
    datasets,
    hourlyMonth,
    loading,
    error,
    retry: load,
    lastUpdated,
  }
}

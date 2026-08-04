import { useCallback, useEffect, useState } from 'react'
import { fetchUsageData, getUsageRanges, type Dataset } from '@/data/usage'

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: '7 Days' },
  { id: 'month', label: '30 Days' },
]

export function useUsageData() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { today, week, month } = getUsageRanges()
    try {
      const results = await Promise.all([
        fetchUsageData('today', TABS[0].label, today.start, today.end),
        fetchUsageData('week', TABS[1].label, week.start, week.end),
        fetchUsageData('month', TABS[2].label, month.start, month.end),
      ])
      setDatasets(results)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { datasets, loading, error, retry: load, tabs: TABS }
}

import { useEffect, useState } from 'react'
import type { Metric } from '@/lib/metrics'

// ponytail: try-catch guards incognito/quota-exceeded (throw → crash on mount). Versioning deferred until a schema change actually happens.
const read = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function useViewPrefs() {
  const [datasetId, setDatasetId] = useState(() => read('datasetId') ?? 'today')
  const [hideZero, setHideZero] = useState(() => read('hideZero') === '1')
  const [granularity, setGranularity] = useState<'hourly' | 'daily'>(() =>
    read('granularity') === 'daily' ? 'daily' : 'hourly',
  )
  const [metric, setMetric] = useState<Metric>(() =>
    read('metric') === 'calls' ? 'calls' : 'tokens',
  )
  useEffect(() => {
    try {
      localStorage.setItem('datasetId', datasetId)
      localStorage.setItem('hideZero', hideZero ? '1' : '0')
      localStorage.setItem('granularity', granularity)
      localStorage.setItem('metric', metric)
    } catch {
      // incognito or quota exceeded — prefs just won't persist this session
    }
  }, [datasetId, hideZero, granularity, metric])
  return {
    datasetId,
    setDatasetId,
    hideZero,
    setHideZero,
    granularity,
    setGranularity,
    metric,
    setMetric,
  }
}

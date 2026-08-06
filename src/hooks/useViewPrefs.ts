import { useEffect, useState } from 'react'
import type { Metric } from '@/lib/metrics'

export function useViewPrefs() {
  const [datasetId, setDatasetId] = useState(
    () => localStorage.getItem('datasetId') ?? 'today',
  )
  const [hideZero, setHideZero] = useState(
    () => localStorage.getItem('hideZero') === '1',
  )
  const [granularity, setGranularity] = useState<'hourly' | 'daily'>(() =>
    localStorage.getItem('granularity') === 'daily' ? 'daily' : 'hourly',
  )
  const [metric, setMetric] = useState<Metric>(() =>
    localStorage.getItem('metric') === 'calls' ? 'calls' : 'tokens',
  )
  useEffect(() => {
    localStorage.setItem('datasetId', datasetId)
    localStorage.setItem('hideZero', hideZero ? '1' : '0')
    localStorage.setItem('granularity', granularity)
    localStorage.setItem('metric', metric)
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

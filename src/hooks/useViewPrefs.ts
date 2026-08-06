import { useEffect, useState } from 'react'

export function useViewPrefs() {
  const [datasetId, setDatasetId] = useState(
    () => localStorage.getItem('datasetId') ?? 'today',
  )
  const [hideZero, setHideZero] = useState(() => localStorage.getItem('hideZero') === '1')
  const [granularity, setGranularity] = useState<'hourly' | 'daily'>(
    () => (localStorage.getItem('granularity') === 'daily' ? 'daily' : 'hourly'),
  )
  useEffect(() => {
    localStorage.setItem('datasetId', datasetId)
    localStorage.setItem('hideZero', hideZero ? '1' : '0')
    localStorage.setItem('granularity', granularity)
  }, [datasetId, hideZero, granularity])
  return { datasetId, setDatasetId, hideZero, setHideZero, granularity, setGranularity }
}

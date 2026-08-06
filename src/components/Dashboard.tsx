import { useMemo } from 'react'
import { useQuota } from '@/hooks/useQuota'
import { useUsageData } from '@/hooks/useUsageData'
import { useNow } from '@/hooks/useNow'
import { useViewPrefs } from '@/hooks/useViewPrefs'
import { aggregateDaily } from '@/data/usage'
import { QuotaCard } from '@/components/QuotaCard'
import { UsageChart } from '@/components/UsageChart'
import { UsageTable } from '@/components/UsageTable'
import { UsagePattern } from '@/components/UsagePattern'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardControls } from '@/components/DashboardControls'
import { LoadError } from '@/components/LoadError'
import { Loading } from '@/components/Loading'

export default function Dashboard() {
  const quota = useQuota()
  const { datasets, loading, error, retry, tabs, lastUpdated: usageUpdated, hourlyMonth } = useUsageData()
  const now = useNow()
  const { datasetId, setDatasetId, hideZero, setHideZero, granularity, setGranularity } = useViewPrefs()
  const dataset = datasets.find((d) => d.id === datasetId)
  const visibleRows = useMemo(() => {
    const hourly = datasetId === 'month' ? hourlyMonth : (dataset?.rows ?? [])
    const view = granularity === 'daily' ? aggregateDaily(hourly) : hourly
    return hideZero ? view.filter((r) => r.calls > 0 || r.tokens > 0) : view
  }, [datasetId, dataset, hourlyMonth, granularity, hideZero])
  const lastUpdated = Math.max(quota.lastUpdated ?? 0, usageUpdated ?? 0)

  const refresh = () => {
    void quota.retry()
    void retry()
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-4 p-4 transition-colors duration-300 md:p-6">
      <DashboardHeader lastUpdated={lastUpdated} now={now} loading={loading} onRefresh={refresh} />

      {error && <LoadError error={error} onRetry={() => void retry()} />}

      {loading && datasets.length === 0 ? (
        <Loading />
      ) : dataset ? (
        <>
          <QuotaCard
            {...quota}
            todayRows={datasets.find((d) => d.id === 'today')?.rows}
            weekRows={datasets.find((d) => d.id === 'week')?.rows}
            monthRows={datasets.find((d) => d.id === 'month')?.rows}
          />

          <DashboardControls
            hideZero={hideZero}
            onToggleHideZero={() => setHideZero(!hideZero)}
            granularity={granularity}
            onGranularityChange={setGranularity}
            datasetId={datasetId}
            onDatasetChange={setDatasetId}
            tabs={tabs}
          />

          <div className="grid gap-4 lg:grid-cols-[7fr_3fr]">
            <UsageChart rows={visibleRows} />
            <UsageTable rows={visibleRows} />
          </div>

          {hourlyMonth.length > 0 && <UsagePattern rows={hourlyMonth} />}
        </>
      ) : (
        <p className="py-10 text-center text-muted-foreground">No data available.</p>
      )}
    </div>
  )
}

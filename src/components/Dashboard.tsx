import { lazy, Suspense, useMemo } from 'react'
import { DashboardControls } from '@/components/DashboardControls'
import { DashboardHeader } from '@/components/DashboardHeader'
import { LoadError } from '@/components/LoadError'
import { Loading } from '@/components/Loading'
import { QuotaCard } from '@/components/QuotaCard'
import { UsageTable } from '@/components/UsageTable'
import { Skeleton } from '@/components/ui/skeleton'
import { aggregateDaily } from '@/data/usage'
import { useQuota } from '@/hooks/useQuota'
import { useUsageData } from '@/hooks/useUsageData'
import { useViewPrefs } from '@/hooks/useViewPrefs'

// ponytail: recharts (~400 kB) isolated in its own chunk so it never blocks first paint.
const UsageChart = lazy(() => import('@/components/UsageChart'))
const UsagePattern = lazy(() => import('@/components/UsagePattern'))

function ChartFallback() {
  return <Skeleton className="h-135" />
}

export default function Dashboard() {
  const quota = useQuota()
  const {
    datasets,
    loading,
    error,
    retry,
    lastUpdated: usageUpdated,
    hourlyMonth,
  } = useUsageData()
  const {
    datasetId,
    setDatasetId,
    hideZero,
    setHideZero,
    granularity,
    setGranularity,
    metric,
    setMetric,
  } = useViewPrefs()
  const dataset = datasets.find((d) => d.id === datasetId)
  const visibleRows = useMemo(() => {
    const hourly = datasetId === 'month' ? hourlyMonth : (dataset?.rows ?? [])
    const view =
      granularity === 'daily' && datasetId !== 'today'
        ? aggregateDaily(hourly)
        : hourly
    return hideZero ? view.filter((r) => r.calls > 0 || r.tokens > 0) : view
  }, [datasetId, dataset, hourlyMonth, granularity, hideZero])
  const lastUpdated = Math.max(quota.lastUpdated ?? 0, usageUpdated ?? 0)

  const refresh = () => {
    void quota.retry()
    void retry()
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-6xl flex-col gap-4 p-4 transition-colors duration-300 md:p-6">
      <DashboardHeader
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={refresh}
      />

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
            metric={metric}
            onMetricChange={setMetric}
            datasetId={datasetId}
            onDatasetChange={setDatasetId}
            tabs={datasets.map((d) => ({ id: d.id, label: d.label }))}
          />

          <div className="grid gap-4 lg:grid-cols-[7fr_3fr]">
            <Suspense fallback={<ChartFallback />}>
              <UsageChart rows={visibleRows} metric={metric} />
            </Suspense>
            <UsageTable rows={visibleRows} />
          </div>

          {hourlyMonth.length > 0 && (
            <Suspense fallback={<ChartFallback />}>
              <UsagePattern rows={hourlyMonth} metric={metric} />
            </Suspense>
          )}
        </>
      ) : (
        <p className="py-10 text-center text-muted-foreground">
          No data available.
        </p>
      )}
    </main>
  )
}

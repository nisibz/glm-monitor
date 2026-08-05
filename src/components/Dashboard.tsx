import { useEffect, useMemo, useState } from 'react'
import { IconMoon, IconRefresh, IconSun } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuota } from '@/hooks/useQuota'
import { useUsageData } from '@/hooks/useUsageData'
import { useNow } from '@/hooks/useNow'
import { QuotaCard } from '@/components/QuotaCard'
import { UsageChart } from '@/components/UsageChart'
import { UsageTable } from '@/components/UsageTable'
import { cn } from '@/lib/utils'
import { fmtRelative } from '@/lib/format'

function DarkToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setDark(!dark)}
      aria-label="Toggle dark mode"
    >
      <span
        key={dark ? 'sun' : 'moon'}
        className="motion-safe:animate-in motion-safe:zoom-in motion-safe:duration-200"
      >
        {dark ? <IconSun className="size-4" /> : <IconMoon className="size-4" />}
      </span>
    </Button>
  )
}

function Loading() {
  return (
    <div className="flex flex-col gap-4" aria-label="Loading">
      <Card>
        <CardContent className="h-36 animate-pulse rounded-lg bg-muted/50" />
      </Card>
      <Card>
        <CardContent className="h-90 animate-pulse rounded-lg bg-muted/50" />
      </Card>
    </div>
  )
}

export default function Dashboard() {
  const quota = useQuota()
  const { datasets, loading, error, retry, tabs, lastUpdated: usageUpdated } = useUsageData()
  const now = useNow()
  const [datasetId, setDatasetId] = useState('today')
  const [hideZero, setHideZero] = useState(false)
  const dataset = datasets.find((d) => d.id === datasetId)
  const visibleRows = useMemo(
    () => (hideZero && dataset ? dataset.rows.filter((r) => r.calls > 0 || r.tokens > 0) : dataset?.rows ?? []),
    [dataset, hideZero],
  )
  const lastUpdated = Math.max(quota.lastUpdated ?? 0, usageUpdated ?? 0)

  const refresh = () => {
    void quota.retry()
    void retry()
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-4 p-4 transition-colors duration-300 md:p-6">
      <header className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-300 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">GLM Usage Monitor</h1>
          <p className="text-sm text-muted-foreground">
            Quota and usage
            {lastUpdated > 0 && ` · updated ${fmtRelative(lastUpdated, now)}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={refresh} disabled={loading} aria-label="Refresh data">
            <IconRefresh className={cn('size-4', loading && 'animate-spin')} />
          </Button>
          <DarkToggle />
        </div>
      </header>

      {error && (
        <Alert className="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in motion-safe:duration-300">
          <AlertTitle className="flex items-center justify-between">
            Failed to load data
            <Button variant="outline" size="sm" onClick={() => void retry()}>
              <IconRefresh className="size-4" /> Retry
            </Button>
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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

          <div className="flex items-center justify-end gap-2">
            <Button
              variant={hideZero ? 'default' : 'outline'}
              size="sm"
              onClick={() => setHideZero(!hideZero)}
              aria-pressed={hideZero}
            >
              Hide zeros
            </Button>
            <Tabs value={datasetId} onValueChange={setDatasetId}>
              <TabsList>
                {tabs.map((t) => (
                  <TabsTrigger key={t.id} value={t.id}>
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-4 lg:grid-cols-[7fr_3fr]">
            <UsageChart rows={visibleRows} />
            <UsageTable rows={visibleRows} />
          </div>
        </>
      ) : (
        <p className="py-10 text-center text-muted-foreground">No data available.</p>
      )}
    </div>
  )
}

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Metric } from '@/lib/metrics'

export function DashboardControls({
  hideZero,
  onToggleHideZero,
  granularity,
  onGranularityChange,
  metric,
  onMetricChange,
  datasetId,
  onDatasetChange,
  tabs,
}: {
  hideZero: boolean
  onToggleHideZero: () => void
  granularity: 'hourly' | 'daily'
  onGranularityChange: (v: 'hourly' | 'daily') => void
  metric: Metric
  onMetricChange: (v: Metric) => void
  datasetId: string
  onDatasetChange: (v: string) => void
  tabs: { id: string; label: string }[]
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant={hideZero ? 'default' : 'outline'}
        size="sm"
        onClick={onToggleHideZero}
        aria-pressed={hideZero}
      >
        Hide zeros
      </Button>
      <Tabs value={metric} onValueChange={(v) => onMetricChange(v as Metric)}>
        <TabsList>
          <TabsTrigger value="calls">Calls</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs value={granularity} onValueChange={(v) => onGranularityChange(v as 'hourly' | 'daily')}>
        <TabsList>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs value={datasetId} onValueChange={onDatasetChange}>
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

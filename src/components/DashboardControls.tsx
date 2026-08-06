import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function DashboardControls({
  hideZero,
  onToggleHideZero,
  granularity,
  onGranularityChange,
  datasetId,
  onDatasetChange,
  tabs,
}: {
  hideZero: boolean
  onToggleHideZero: () => void
  granularity: 'hourly' | 'daily'
  onGranularityChange: (v: 'hourly' | 'daily') => void
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

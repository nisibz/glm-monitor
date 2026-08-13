import {
  IconApi,
  IconArrowsExchange,
  IconCalendar,
  IconClock,
  IconCoin,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { METRICS, type Metric } from '@/lib/metrics'
import { cn } from '@/lib/utils'

const METRIC_ICON = { calls: IconApi, tokens: IconCoin } as const
const GRAN_ICON = { hourly: IconClock, daily: IconCalendar } as const
const GRAN_LABEL = { hourly: 'Hourly', daily: 'Daily' } as const

// ponytail: stack both labels in one grid cell so the button keeps the widest
// label's width instead of resizing when the flipped value changes.
function StableText({
  activeIndex,
  options,
}: {
  activeIndex: number
  options: readonly string[]
}) {
  return (
    <span className="inline-grid">
      {options.map((o, i) => (
        <span
          key={o}
          className={`col-start-1 row-start-1 ${i === activeIndex ? '' : 'invisible'}`}
        >
          {o}
        </span>
      ))}
    </span>
  )
}

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
  const MetricIcon = METRIC_ICON[metric]
  const GranIcon = GRAN_ICON[granularity]

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleHideZero}
        aria-pressed={hideZero}
        aria-label={hideZero ? 'Show zero rows' : 'Hide zero rows'}
      >
        {hideZero ? (
          <IconEyeOff className="size-4" />
        ) : (
          <IconEye className="size-4" />
        )}
      </Button>
      <Button
        variant="outline"
        onClick={() => onMetricChange(metric === 'calls' ? 'tokens' : 'calls')}
        aria-label={`Metric: ${METRICS[metric].label}. Click to switch`}
      >
        <MetricIcon className="size-4" />
        <StableText
          activeIndex={metric === 'tokens' ? 1 : 0}
          options={[METRICS.calls.label, METRICS.tokens.label]}
        />
        <IconArrowsExchange className="size-3 text-muted-foreground" />
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          onGranularityChange(granularity === 'hourly' ? 'daily' : 'hourly')
        }
        aria-label={`Granularity: ${GRAN_LABEL[granularity]}. Click to switch`}
      >
        <GranIcon className="size-4" />
        <StableText
          activeIndex={granularity === 'daily' ? 1 : 0}
          options={[GRAN_LABEL.hourly, GRAN_LABEL.daily]}
        />
        <IconArrowsExchange className="size-3 text-muted-foreground" />
      </Button>
      <fieldset
        aria-label="Dataset"
        className="inline-flex h-8 w-fit items-center justify-center rounded-lg bg-muted p-[3px]"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onDatasetChange(t.id)}
            aria-pressed={t.id === datasetId}
            className={cn(
              'relative inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-1.5 py-0.5 font-medium text-foreground/60 text-sm transition-all hover:text-foreground focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:text-muted-foreground dark:hover:text-foreground',
              t.id === datasetId &&
                'bg-background text-foreground shadow-sm dark:border-input dark:bg-input/30 dark:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </fieldset>
    </div>
  )
}

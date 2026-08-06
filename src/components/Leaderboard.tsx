import { useMemo } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Row } from '@/data/usage'
import { fmtCompact, fmtInt } from '@/lib/format'
import { METRICS, type Metric } from '@/lib/metrics'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ponytail: duplicated from UsagePattern — extract only when a 3rd caller appears.
const weekdayIndex = (time: string) => {
  const day = new Date(`${time.slice(0, 10)}T00:00:00`).getDay() // 0=Sun..6=Sat
  return (day + 6) % 7 // -> 0=Mon..6=Sun
}

export function Leaderboard({
  rows,
  dimension,
  metric,
}: {
  rows: Row[]
  dimension: 'hour' | 'weekday'
  metric: Metric
}) {
  const label = METRICS[metric].label
  const ranked = useMemo(() => {
    const buckets =
      dimension === 'hour'
        ? Array.from({ length: 24 }, (_, h) => ({
            label: String(h).padStart(2, '0'),
            value: 0,
          }))
        : WEEKDAYS.map((label) => ({ label, value: 0 }))
    for (const r of rows) {
      const i =
        dimension === 'hour'
          ? Number(r.time.slice(11, 13))
          : weekdayIndex(r.time)
      if (i >= 0 && i < buckets.length) buckets[i].value += r[metric]
    }
    return buckets
      .map((b, i) => ({ ...b, idx: i }))
      .sort((a, b) => b.value - a.value || a.idx - b.idx)
  }, [rows, dimension, metric])

  return (
    <TooltipProvider>
      <ol className="scrollbar-thin min-h-0 flex-1 overflow-auto pr-1">
        {ranked.map((b, i) => (
          <li
            key={b.idx}
            className={`flex items-center gap-2 px-1 py-1 text-sm tabular-nums ${
              i < 3 ? 'font-semibold text-foreground' : 'text-muted-foreground'
            }`}
          >
            <span className="w-5 text-right text-muted-foreground text-xs">
              {i + 1}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-default font-mono underline decoration-muted-foreground/50 decoration-dotted underline-offset-4">
                  {b.label}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {fmtCompact(b.value)} ({fmtInt(b.value)}) {label}
              </TooltipContent>
            </Tooltip>
          </li>
        ))}
      </ol>
    </TooltipProvider>
  )
}

import { useMemo } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { fmtCompact, fmtInt } from '@/lib/format'
import { METRICS, type Metric } from '@/lib/metrics'

export function Leaderboard({
  data,
  metric,
}: {
  data: { label: string; value: number }[]
  metric: Metric
}) {
  const label = METRICS[metric].label
  const ranked = useMemo(
    () =>
      data
        .map((b, i) => ({ ...b, idx: i }))
        .sort((a, b) => b.value - a.value || a.idx - b.idx),
    [data],
  )

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

import { useMemo } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Row } from '@/data/usage'
import { fmtCompact, fmtInt } from '@/lib/format'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ponytail: duplicated from UsagePattern — extract only when a 3rd caller appears.
const weekdayIndex = (time: string) => {
  const day = new Date(`${time.slice(0, 10)}T00:00:00`).getDay() // 0=Sun..6=Sat
  return (day + 6) % 7 // -> 0=Mon..6=Sun
}

export function Leaderboard({
  rows,
  dimension,
}: {
  rows: Row[]
  dimension: 'hour' | 'weekday'
}) {
  const ranked = useMemo(() => {
    const buckets =
      dimension === 'hour'
        ? Array.from({ length: 24 }, (_, h) => ({
            label: String(h).padStart(2, '0'),
            tokens: 0,
          }))
        : WEEKDAYS.map((label) => ({ label, tokens: 0 }))
    for (const r of rows) {
      const i = dimension === 'hour' ? Number(r.time.slice(11, 13)) : weekdayIndex(r.time)
      if (i >= 0 && i < buckets.length) buckets[i].tokens += r.tokens
    }
    return buckets
      .map((b, i) => ({ ...b, idx: i }))
      .sort((a, b) => b.tokens - a.tokens || a.idx - b.idx)
  }, [rows, dimension])

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
            <span className="w-5 text-right text-xs text-muted-foreground">{i + 1}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-default font-mono underline decoration-dotted decoration-muted-foreground/50 underline-offset-4">
                  {b.label}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {fmtCompact(b.tokens)} ({fmtInt(b.tokens)})
              </TooltipContent>
            </Tooltip>
          </li>
        ))}
      </ol>
    </TooltipProvider>
  )
}

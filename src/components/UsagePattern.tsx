import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Leaderboard } from '@/components/Leaderboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Row } from '@/data/usage'
import { fmtCompact, fmtInt } from '@/lib/format'
import { METRICS, type Metric } from '@/lib/metrics'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ponytail: timestamp treated as local-naive; weekday via local parse so it matches the user's locale.
const weekdayIndex = (time: string) => {
  const day = new Date(`${time.slice(0, 10)}T00:00:00`).getDay() // 0=Sun..6=Sat
  return (day + 6) % 7 // -> 0=Mon..6=Sun
}

interface ChartCardProps {
  title: string
  data: { label: string; value: number }[]
  color: string
  dimension: 'hour' | 'weekday'
  rows: Row[]
  metric: Metric
}

function ChartCard({
  title,
  data,
  color,
  dimension,
  rows,
  metric,
}: ChartCardProps) {
  const m = METRICS[metric]
  return (
    <Card className="flex h-112 flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 gap-3">
        <div className="min-w-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                minTickGap={12}
                className="text-xs"
              />
              <YAxis
                tickFormatter={fmtCompact}
                tickLine={false}
                axisLine={false}
                width={48}
                className="text-xs"
              />
              <Tooltip
                formatter={(v) => [fmtInt(Number(v)), m.label]}
                cursor={{ fill: 'var(--muted)' }}
              />
              <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex w-18 shrink-0 flex-col">
          <Leaderboard rows={rows} dimension={dimension} metric={metric} />
        </div>
      </CardContent>
    </Card>
  )
}

export function UsagePattern({
  rows,
  metric,
}: {
  rows: Row[]
  metric: Metric
}) {
  const byHour = useMemo(() => {
    const buckets = Array.from({ length: 24 }, (_, h) => ({
      label: String(h).padStart(2, '0'),
      value: 0,
    }))
    for (const r of rows) {
      const h = Number(r.time.slice(11, 13))
      if (h >= 0 && h < 24) buckets[h].value += r[metric]
    }
    return buckets
  }, [rows, metric])

  const byWeekday = useMemo(() => {
    const buckets = WEEKDAYS.map((label) => ({ label, value: 0 }))
    for (const r of rows) {
      buckets[weekdayIndex(r.time)].value += r[metric]
    }
    return buckets
  }, [rows, metric])

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="Usage by hour of day"
        data={byHour}
        color="var(--chart-1)"
        dimension="hour"
        rows={rows}
        metric={metric}
      />
      <ChartCard
        title="Usage by weekday"
        data={byWeekday}
        color="var(--chart-2)"
        dimension="weekday"
        rows={rows}
        metric={metric}
      />
    </div>
  )
}

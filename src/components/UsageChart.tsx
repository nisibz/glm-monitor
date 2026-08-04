import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Row } from '@/data/usage'
import { fmtCompact, fmtInt, timeLabel } from '@/lib/format'

const METRICS = {
  calls: { key: 'calls', label: 'Calls', color: 'var(--chart-2)' },
  tokens: { key: 'tokens', label: 'Tokens', color: 'var(--chart-1)' },
} as const

type Metric = keyof typeof METRICS

export function UsageChart({ rows }: { rows: Row[] }) {
  const [metric, setMetric] = useState<Metric>('tokens')
  const m = METRICS[metric]

  return (
    <Card className="flex h-135 flex-col">
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle>Usage Overview</CardTitle>
        <Tabs value={metric} onValueChange={(v) => setMetric(v as Metric)}>
          <TabsList>
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="metricFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={m.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={m.color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis
                dataKey="time"
                tickFormatter={timeLabel}
                minTickGap={40}
                tickLine={false}
                axisLine={false}
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
                formatter={(value) => [fmtInt(Number(value)), m.label]}
                labelFormatter={(l) => String(l)}
              />
              <Area
                key={m.key}
                type="monotone"
                dataKey={m.key}
                name={m.label}
                stroke={m.color}
                strokeWidth={2}
                fill="url(#metricFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

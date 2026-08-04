import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Row } from '@/data/usage'
import { fmtCompact, fmtInt, timeLabel } from '@/lib/format'

function MiniChart({
  title,
  type,
  color,
  rows,
}: {
  title: string
  type: 'line' | 'area'
  color: string
  rows: Row[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-50 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'line' ? (
              <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                <Tooltip formatter={(v) => [fmtInt(Number(v)), title]} />
                <Line type="monotone" dataKey="calls" name={title} stroke={color} strokeWidth={2} dot={false} />
              </LineChart>
            ) : (
              <AreaChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="splitFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.02} />
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
                <Tooltip formatter={(v) => [fmtInt(Number(v)), title]} />
                <Area type="monotone" dataKey="tokens" name={title} stroke={color} strokeWidth={2} fill="url(#splitFill)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function SplitCharts({ rows }: { rows: Row[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <MiniChart title="Model Calls" type="line" color="var(--chart-2)" rows={rows} />
      <MiniChart title="Tokens Usage" type="area" color="var(--chart-1)" rows={rows} />
    </div>
  )
}

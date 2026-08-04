import { IconRobot } from '@tabler/icons-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { Row } from '@/data/usage'
import { fmtCompact } from '@/lib/format'

export function ModelSummary({ rows }: { rows: Row[] }) {
  const totalTokens = rows.reduce((s, r) => s + r.tokens, 0)
  const totalCalls = rows.reduce((s, r) => s + r.calls, 0)
  const models = [{ name: 'GLM-5.2', tokens: totalTokens }]

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2">
        <IconRobot className="size-5 text-muted-foreground" />
        <CardTitle>Model Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {models.map((m) => {
          const pct = totalTokens ? Math.round((m.tokens / totalTokens) * 100) : 0
          return (
            <div key={m.name}>
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium">{m.name}</span>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {fmtCompact(m.tokens)} tokens · {pct}%
                </span>
              </div>
              <Progress value={pct} aria-label={`${m.name} share`} />
            </div>
          )
        })}
        <p className="border-t pt-3 text-sm text-muted-foreground">
          Total:{' '}
          <span className="font-medium text-foreground tabular-nums">
            {fmtCompact(totalTokens)} tokens / {totalCalls.toLocaleString('en')} calls
          </span>
        </p>
      </CardContent>
    </Card>
  )
}

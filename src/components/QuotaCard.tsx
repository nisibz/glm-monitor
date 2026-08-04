import { IconInfoCircle, IconRefresh } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { QuotaLimit } from '@/data/quota'
import { fmtEpoch, fmtInt } from '@/lib/format'
import { useQuota } from '@/hooks/useQuota'

function LimitRow({ limit }: { limit: QuotaLimit }) {
  const isTime = limit.type === 'TIME_LIMIT'
  const reset = `resets ${fmtEpoch(limit.nextResetTime)}`
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">
          {isTime ? `Requests / ${limit.unit} min` : 'Tokens'}
        </span>
        <span className="text-sm text-muted-foreground tabular-nums">
          {isTime
            ? `${fmtInt(limit.currentValue)} / ${fmtInt(limit.usage)} used · ${fmtInt(limit.remaining)} left · ${limit.percentage}%`
            : `${limit.percentage}% used`}
        </span>
      </div>
      <Progress value={limit.percentage} aria-label={`${limit.type} usage`} />
      <p className="mt-1 text-xs text-muted-foreground">{reset}</p>
      {isTime && limit.usageDetails && (
        <div className="mt-2 flex flex-wrap gap-2">
          {limit.usageDetails.map((d) => (
            <Badge key={d.modelCode} variant="secondary" className="font-mono text-xs">
              {d.modelCode}: {fmtInt(d.usage)}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export function QuotaCard() {
  const { quota, loading, error, retry } = useQuota()

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2">
          <IconInfoCircle className="size-5 text-muted-foreground" />
          Quota
        </CardTitle>
        {quota && <Badge>{quota.level}</Badge>}
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && !quota && (
          <div className="h-24 animate-pulse rounded-lg bg-muted/50" />
        )}
        {error && (
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={retry}>
              <IconRefresh className="size-4" /> Retry
            </Button>
          </div>
        )}
        {quota?.limits.map((limit) => <LimitRow key={limit.type} limit={limit} />)}
      </CardContent>
    </Card>
  )
}

import { IconInfoCircle, IconRefresh } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCountUp } from "@/hooks/useCountUp";
import type { QuotaLimit } from "@/data/quota";
import type { Row } from "@/data/usage";
import {
  fmtCompact,
  fmtCountdown,
  fmtEpoch,
  fmtInt,
  fmtWindow,
} from "@/lib/format";

function QuotaStat({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-1.5 whitespace-nowrap">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </span>
  );
}

function QuotaHero({ limit }: { limit: QuotaLimit }) {
  const pct = limit.percentage || 0;
  const hasNumbers =
    Number.isFinite(limit.usage) && Number.isFinite(limit.currentValue);
  const remaining = Number.isFinite(limit.remaining) ? limit.remaining : null;
  const hasReset = Number.isFinite(limit.nextResetTime);
  const shown = useCountUp(remaining ?? pct);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <span className="text-5xl font-semibold tabular-nums">
          {remaining != null ? fmtCompact(shown) : `${Math.round(shown)}%`}
        </span>
        <span className="text-sm text-muted-foreground">
          {remaining != null ? "tokens left" : "tokens used"}
        </span>
      </div>
      <Progress value={pct} aria-label="Quota usage" className="h-3" />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {hasNumbers && (
          <span className="tabular-nums">
            {fmtInt(limit.currentValue)} / {fmtInt(limit.usage)} tokens used (
            {pct}%)
          </span>
        )}
        {hasReset ? (
          <>
            <span className="tabular-nums">
              resets {fmtEpoch(limit.nextResetTime)}
            </span>
            <span className="tabular-nums">
              {fmtCountdown(limit.nextResetTime - Date.now())}
            </span>
          </>
        ) : (
          <span>{fmtWindow(limit)} window</span>
        )}
      </div>
    </div>
  );
}

export function QuotaCard({
  quota,
  loading,
  error,
  retry,
  todayRows,
  weekRows,
  monthRows,
}: ReturnType<typeof import("@/hooks/useQuota").useQuota> & {
  todayRows?: Row[];
  weekRows?: Row[];
  monthRows?: Row[];
}) {
  const limits = quota?.limits.filter((l) => l.type === "TOKENS_LIMIT") ?? [];
  const thisHourTokens = todayRows?.at(-1)?.tokens;
  const todayTokens = todayRows?.reduce((s, r) => s + r.tokens, 0);
  const thisWeekTokens = weekRows?.reduce((s, r) => s + r.tokens, 0);
  const thisMonthTokens = monthRows?.reduce((s, r) => s + r.tokens, 0);

  return (
    <Card>
      <CardHeader className="items-center gap-4">
        <CardTitle className="flex items-center gap-2">
          <IconInfoCircle className="size-5 text-muted-foreground" />
          Quota
          {quota && <Badge>{quota.level}</Badge>}
        </CardTitle>
        <div data-slot="card-action" className="flex flex-col items-end gap-0.5">
          {thisHourTokens != null && (
            <QuotaStat label="This hour" value={fmtCompact(thisHourTokens)} />
          )}
          {todayTokens != null && (
            <QuotaStat label="Today" value={fmtCompact(todayTokens)} />
          )}
          {thisWeekTokens != null && (
            <QuotaStat label="This week" value={fmtCompact(thisWeekTokens)} />
          )}
          {thisMonthTokens != null && (
            <QuotaStat label="This month" value={fmtCompact(thisMonthTokens)} />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && !quota && (
          <div className="h-32 animate-pulse rounded-lg bg-muted/50" />
        )}
        {error && (
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void retry()}>
              <IconRefresh className="size-4" /> Retry
            </Button>
          </div>
        )}
        {limits.length === 0 && !loading && !error && (
          <p className="text-sm text-muted-foreground">No quota limit found.</p>
        )}
        {limits.map((limit) => (
          <QuotaHero key={limit.type} limit={limit} />
        ))}
      </CardContent>
    </Card>
  );
}

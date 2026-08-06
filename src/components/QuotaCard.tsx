import { IconInfoCircle, IconRefresh } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCountUp } from "@/hooks/useCountUp";
import type { QuotaLimit } from "@/data/quota";
import type { Row } from "@/data/usage";
import { cn } from "@/lib/utils";
import {
  fmtCompact,
  fmtCountdown,
  fmtEpoch,
  fmtInt,
  fmtWindow,
} from "@/lib/format";

function QuotaStat({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: number;
}) {
  return (
    <span className="flex items-baseline gap-1.5 whitespace-nowrap">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
      {delta != null && Number.isFinite(delta) && (
        <span
          className={cn(
            "text-xs tabular-nums",
            delta > 0
              ? "text-warning"
              : delta < 0
                ? "text-success"
                : "text-muted-foreground",
          )}
        >
          {delta > 0 ? "↑" : delta < 0 ? "↓" : "—"}
          {Math.abs(Math.round(delta))}%
        </span>
      )}
    </span>
  );
}

function QuotaHero({
  limit,
  burnRate,
}: {
  limit: QuotaLimit;
  burnRate?: number;
}) {
  const pct = limit.percentage || 0;
  const hasNumbers =
    Number.isFinite(limit.usage) && Number.isFinite(limit.currentValue);
  const remaining = Number.isFinite(limit.remaining) ? limit.remaining : null;
  const hasReset = Number.isFinite(limit.nextResetTime);
  const shown = useCountUp(remaining ?? pct);

  const hoursUntilReset = hasReset
    ? (limit.nextResetTime - Date.now()) / 3_600_000
    : null;
  const willExceed =
    burnRate != null &&
    burnRate > 0 &&
    hoursUntilReset != null &&
    remaining != null &&
    burnRate * hoursUntilReset > remaining;
  const exhaustsInMs =
    burnRate != null && burnRate > 0 && remaining != null && remaining > 0
      ? (remaining / burnRate) * 3_600_000
      : null;

  const warning = pct >= 95 ? "destructive" : pct >= 80 ? "amber" : null;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <span
          className={cn(
            "text-5xl font-semibold tabular-nums",
            warning === "destructive" && "text-destructive",
          )}
        >
          {remaining != null ? fmtCompact(shown) : `${Math.round(shown)}%`}
        </span>
        <span className="text-sm text-muted-foreground">
          {remaining != null ? "tokens left" : "tokens used"}
        </span>
      </div>
      <Progress
        value={pct}
        aria-label="Quota usage"
        className={cn(
          "h-3",
          warning === "destructive" &&
            "*:data-[slot=progress-indicator]:bg-destructive",
          warning === "amber" &&
            "*:data-[slot=progress-indicator]:bg-warning",
        )}
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {hasNumbers && (
          <span className="tabular-nums">
            {fmtInt(limit.currentValue)} / {fmtInt(limit.usage)} tokens used (
            {pct}%)
          </span>
        )}
        {burnRate != null && burnRate > 0 && (
          <span className={cn("tabular-nums", willExceed && "text-destructive")}>
            ≈ {fmtCompact(burnRate)}/hr
            {willExceed && exhaustsInMs != null
              ? ` · runs out ${fmtCountdown(exhaustsInMs)}`
              : ""}
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

const sumByDateRange = (
  rows: Row[] | undefined,
  fromOffset: number,
  toOffset: number,
  now = new Date(),
) => {
  if (!rows?.length) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  const d = (off: number) => {
    const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + off);
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  };
  const from = d(fromOffset);
  const to = d(toOffset);
  return rows
    .filter((r) => {
      const day = r.time.slice(0, 10);
      return day >= from && day <= to;
    })
    .reduce((s, r) => s + r.tokens, 0);
};

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

  const yesterdayTokens = sumByDateRange(weekRows, -1, -1);
  const lastWeekTokens = sumByDateRange(monthRows, -13, -7);

  const pctDelta = (cur: number | undefined, prev: number | undefined) =>
    cur != null && prev != null && prev > 0 ? ((cur - prev) / prev) * 100 : undefined;

  const todayDelta = pctDelta(todayTokens, yesterdayTokens);
  const weekDelta = pctDelta(thisWeekTokens, lastWeekTokens);

  const burnRate = todayRows?.length
    ? (todayTokens ?? 0) / todayRows.length
    : undefined;

  return (
    <Card>
      <CardHeader className="gap-4">
        <CardTitle className="flex flex-col items-start gap-1.5">
          <span className="flex items-center gap-2">
            <IconInfoCircle className="size-5 text-muted-foreground" />
            Quota
          </span>
          {quota && <Badge>{quota.level}</Badge>}
        </CardTitle>
        <div data-slot="card-action" className="flex flex-col items-end gap-0.5">
          {thisHourTokens != null && (
            <QuotaStat label="This hour" value={fmtCompact(thisHourTokens)} />
          )}
          {todayTokens != null && (
            <QuotaStat
              label="Today"
              value={fmtCompact(todayTokens)}
              delta={todayDelta}
            />
          )}
          {thisWeekTokens != null && (
            <QuotaStat
              label="This week"
              value={fmtCompact(thisWeekTokens)}
              delta={weekDelta}
            />
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
          <QuotaHero key={limit.type} limit={limit} burnRate={burnRate} />
        ))}
      </CardContent>
    </Card>
  );
}

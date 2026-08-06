import { IconRefresh } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { DarkToggle } from '@/components/DarkToggle'
import { cn } from '@/lib/utils'
import { fmtRelative } from '@/lib/format'

export function DashboardHeader({
  lastUpdated,
  now,
  loading,
  onRefresh,
}: {
  lastUpdated: number
  now: number
  loading: boolean
  onRefresh: () => void
}) {
  return (
    <header className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-300 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">GLM Usage Monitor</h1>
        <p className="text-sm text-muted-foreground">
          Quota and usage
          {lastUpdated > 0 && ` · updated ${fmtRelative(lastUpdated, now)}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading} aria-label="Refresh data">
          <IconRefresh className={cn('size-4', loading && 'animate-spin')} />
        </Button>
        <DarkToggle />
      </div>
    </header>
  )
}

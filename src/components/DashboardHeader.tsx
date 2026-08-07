import { IconRefresh } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { DarkToggle } from '@/components/DarkToggle'
import { Button } from '@/components/ui/button'
import { fmtRelative } from '@/lib/format'
import { cn } from '@/lib/utils'

export function DashboardHeader({
  lastUpdated,
  loading,
  onRefresh,
}: {
  lastUpdated: number
  loading: boolean
  onRefresh: () => void
}) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])
  return (
    <header className="motion-safe:fade-in motion-safe:slide-in-from-top-2 flex items-center justify-between gap-4 motion-safe:animate-in motion-safe:duration-300">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">
          GLM Usage Monitor
        </h1>
        <p className="text-muted-foreground text-sm">
          Quota and usage
          {lastUpdated > 0 && ` · updated ${fmtRelative(lastUpdated, now)}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh data"
        >
          <IconRefresh className={cn('size-4', loading && 'animate-spin')} />
        </Button>
        <DarkToggle />
      </div>
    </header>
  )
}

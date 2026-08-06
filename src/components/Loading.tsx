import { Card, CardContent } from '@/components/ui/card'

export function Loading() {
  return (
    <div className="flex flex-col gap-4" aria-label="Loading">
      <Card>
        <CardContent className="h-52 animate-pulse rounded-lg bg-muted/50" />
      </Card>
      <div className="flex justify-end gap-2">
        <div className="h-9 w-64 animate-pulse rounded-md bg-muted/50" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[7fr_3fr]">
        <Card>
          <CardContent className="h-135 animate-pulse rounded-lg bg-muted/50" />
        </Card>
        <Card>
          <CardContent className="h-135 animate-pulse rounded-lg bg-muted/50" />
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="h-112 animate-pulse rounded-lg bg-muted/50" />
        </Card>
        <Card>
          <CardContent className="h-112 animate-pulse rounded-lg bg-muted/50" />
        </Card>
      </div>
    </div>
  )
}

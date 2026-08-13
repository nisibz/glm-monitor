import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="px-0">
          <Skeleton className="h-52 w-full rounded-lg" />
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[7fr_3fr]">
        <Card>
          <CardContent className="px-0">
            <Skeleton className="h-135 w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-0">
            <Skeleton className="h-135 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="px-0">
            <Skeleton className="h-112 w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-0">
            <Skeleton className="h-112 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

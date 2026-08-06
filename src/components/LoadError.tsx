import { IconRefresh } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function LoadError({
  error,
  onRetry,
}: {
  error: string
  onRetry: () => void
}) {
  return (
    <Alert className="motion-safe:fade-in motion-safe:zoom-in motion-safe:animate-in motion-safe:duration-300">
      <AlertTitle className="flex items-center justify-between">
        Failed to load data
        <Button variant="outline" size="sm" onClick={onRetry}>
          <IconRefresh className="size-4" /> Retry
        </Button>
      </AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}

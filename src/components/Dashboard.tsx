import { useEffect, useState } from 'react'
import { IconMoon, IconRefresh, IconSun } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUsageData } from '@/hooks/useUsageData'
import { QuotaCard } from '@/components/QuotaCard'
import { UsageChart } from '@/components/UsageChart'
import { UsageTable } from '@/components/UsageTable'

function DarkToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setDark(!dark)}
      aria-label="Toggle dark mode"
    >
      {dark ? <IconSun className="size-4" /> : <IconMoon className="size-4" />}
    </Button>
  )
}

function Loading() {
  return (
    <div className="flex flex-col gap-4" aria-label="Loading">
      <Card>
        <CardContent className="h-36 animate-pulse rounded-lg bg-muted/50" />
      </Card>
      <Card>
        <CardContent className="h-90 animate-pulse rounded-lg bg-muted/50" />
      </Card>
    </div>
  )
}

export default function Dashboard() {
  const { datasets, loading, error, retry, tabs } = useUsageData()
  const [datasetId, setDatasetId] = useState('today')
  const dataset = datasets.find((d) => d.id === datasetId)

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-4 p-4 md:p-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">GLM Usage Monitor</h1>
          <p className="text-sm text-muted-foreground">Quota and usage</p>
        </div>
        <DarkToggle />
      </header>

      {error && (
        <Alert>
          <AlertTitle className="flex items-center justify-between">
            Failed to load data
            <Button variant="outline" size="sm" onClick={retry}>
              <IconRefresh className="size-4" /> Retry
            </Button>
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Loading />
      ) : dataset ? (
        <>
          <QuotaCard />

          <Tabs value={datasetId} onValueChange={setDatasetId}>
            <TabsList>
              {tabs.map((t) => (
                <TabsTrigger key={t.id} value={t.id}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <UsageChart rows={dataset.rows} />

          <UsageTable rows={dataset.rows} />
        </>
      ) : (
        <p className="py-10 text-center text-muted-foreground">No data available.</p>
      )}
    </div>
  )
}

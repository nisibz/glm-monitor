import { useEffect, useState } from 'react'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { datasets, totalCalls, totalTokens } from '@/data/usage'
import { ModelSummary } from '@/components/ModelSummary'
import { SplitCharts } from '@/components/SplitCharts'
import { SummaryCards } from '@/components/SummaryCards'
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

export default function Dashboard() {
  const [datasetId, setDatasetId] = useState(datasets[0].id)
  const dataset = datasets.find((d) => d.id === datasetId) ?? datasets[0]
  const modelNames = ['GLM-5.2']

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-4 p-4 md:p-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">GLM Usage Monitor</h1>
          <p className="text-sm text-muted-foreground">Model call and token usage</p>
        </div>
        <DarkToggle />
      </header>

      <SummaryCards
        totalCalls={totalCalls(dataset.rows)}
        totalTokens={totalTokens(dataset.rows)}
        modelNames={modelNames}
        period={dataset.period}
      />

      <Tabs value={datasetId} onValueChange={setDatasetId}>
        <TabsList>
          {datasets.map((d) => (
            <TabsTrigger key={d.id} value={d.id}>
              {d.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <UsageChart rows={dataset.rows} />

      <SplitCharts rows={dataset.rows} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UsageTable rows={dataset.rows} />
        </div>
        <ModelSummary rows={dataset.rows} />
      </div>
    </div>
  )
}

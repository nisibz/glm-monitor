import {
  IconCalendar,
  IconChartBar,
  IconRobot,
  IconStack2,
} from '@tabler/icons-react'
import { Card, CardContent } from '@/components/ui/card'
import { fmtCompact, fmtInt } from '@/lib/format'

interface Props {
  totalCalls: number
  totalTokens: number
  modelNames: string[]
  period: string
}

export function SummaryCards({ totalCalls, totalTokens, modelNames, period }: Props) {
  const items = [
    { icon: IconChartBar, label: 'Total Calls', value: fmtInt(totalCalls) },
    { icon: IconStack2, label: 'Total Tokens', value: fmtCompact(totalTokens) },
    { icon: IconRobot, label: 'Model', value: modelNames.join(', ') },
    { icon: IconCalendar, label: 'Period', value: period },
  ]
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map(({ icon: Icon, label, value }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-muted p-2.5">
              <Icon className="size-5 text-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="truncate text-2xl font-semibold tabular-nums">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

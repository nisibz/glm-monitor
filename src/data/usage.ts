export interface Row {
  time: string
  calls: number
  tokens: number
}

export interface Dataset {
  id: string
  label: string
  period: string
  granularity: 'hourly' | 'daily'
  rows: Row[]
}

interface UsageResponse {
  data: {
    x_time: string[]
    modelCallCount: number[]
    tokensUsage: number[]
    granularity: string
  }
}

const pad = (n: number) => String(n).padStart(2, '0')
const dayStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const startOfDay = (now: Date, offset: number) =>
  `${dayStr(new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset))} 00:00:00`
const endOfDay = (now: Date, offset: number) =>
  `${dayStr(new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset))} 23:59:59`

const periodOf = (rows: Row[]) =>
  `${rows[0]?.time.slice(0, 10) ?? ''} - ${rows.at(-1)?.time.slice(0, 10) ?? ''}`

export async function fetchUsageData(
  id: string,
  label: string,
  start: string,
  end: string,
): Promise<Dataset> {
  const params = new URLSearchParams({
    startTime: start,
    endTime: end,
  })
  const res = await fetch(`/api/monitor/usage/model-usage?${params}`)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  const json = (await res.json()) as UsageResponse
  const { x_time, modelCallCount, tokensUsage, granularity } = json.data
  const rows: Row[] = x_time.map((time, i) => ({
    time,
    calls: modelCallCount[i],
    tokens: tokensUsage[i],
  }))
  return {
    id,
    label,
    period: periodOf(rows),
    granularity: granularity === 'daily' ? 'daily' : 'hourly',
    rows,
  }
}

// API returns hourly granularity only for ranges ≤8 days; chunk a month into ≤8-day windows.
const HOURLY_MONTH_WINDOWS: Array<[number, number]> = [
  [-29, -22],
  [-21, -14],
  [-13, -6],
  [-5, 0],
]

export async function fetchHourlyMonth(now: Date = new Date()): Promise<Row[]> {
  const datasets = await Promise.all(
    HOURLY_MONTH_WINDOWS.map(([from, to]) =>
      fetchUsageData('', '', startOfDay(now, from), endOfDay(now, to)),
    ),
  )
  return datasets.flatMap((d) => d.rows)
}

export const aggregateDaily = (rows: Row[]): Row[] => {
  const map = new Map<string, Row>()
  for (const r of rows) {
    const day = r.time.slice(0, 10)
    const cur = map.get(day) ?? { time: day, calls: 0, tokens: 0 }
    cur.calls += r.calls
    cur.tokens += r.tokens
    map.set(day, cur)
  }
  return [...map.values()].sort((a, b) => a.time.localeCompare(b.time))
}

// Derive the today/week/month datasets from a single 30-day hourly source.
export function deriveDatasets(hourly: Row[], now: Date = new Date()): Dataset[] {
  const today = dayStr(now)
  const weekStart = dayStr(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6))
  const todayRows = hourly.filter((r) => r.time.slice(0, 10) === today)
  const weekRows = hourly.filter((r) => {
    const day = r.time.slice(0, 10)
    return day >= weekStart && day <= today
  })
  const monthRows = aggregateDaily(hourly)
  return [
    { id: 'today', label: 'Today', period: periodOf(todayRows), granularity: 'hourly', rows: todayRows },
    { id: 'week', label: '7 Days', period: periodOf(weekRows), granularity: 'hourly', rows: weekRows },
    { id: 'month', label: '30 Days', period: periodOf(monthRows), granularity: 'daily', rows: monthRows },
  ]
}

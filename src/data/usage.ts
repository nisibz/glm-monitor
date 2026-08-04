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

export function getUsageRanges(now: Date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0')
  const date = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const startOf = (offset: number) =>
    `${date(new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset))} 00:00:00`
  const endOfToday = `${date(now)} 23:59:59`
  return {
    today: { start: startOf(0), end: endOfToday },
    week: { start: startOf(-6), end: endOfToday },
    month: { start: startOf(-29), end: endOfToday },
  }
}

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
    period: `${rows[0]?.time.slice(0, 10) ?? ''} - ${rows.at(-1)?.time.slice(0, 10) ?? ''}`,
    granularity: granularity === 'daily' ? 'daily' : 'hourly',
    rows,
  }
}

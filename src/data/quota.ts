export interface UsageDetail {
  modelCode: string
  usage: number
}

export interface QuotaLimit {
  type: 'TIME_LIMIT' | 'TOKENS_LIMIT'
  unit: number
  number: number
  usage: number
  currentValue: number
  remaining: number
  percentage: number
  nextResetTime: number
  usageDetails?: UsageDetail[]
}

export interface Quota {
  limits: QuotaLimit[]
  level: string
}

interface QuotaResponse {
  data: Quota
}

export async function fetchQuota(): Promise<Quota> {
  const res = await fetch('/api/monitor/usage/quota/limit')
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  const json = (await res.json()) as QuotaResponse
  return json.data
}

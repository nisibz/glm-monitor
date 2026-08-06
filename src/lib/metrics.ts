export const METRICS = {
  calls: { key: 'calls', label: 'Calls', color: 'var(--chart-2)' },
  tokens: { key: 'tokens', label: 'Tokens', color: 'var(--chart-1)' },
} as const

export type Metric = keyof typeof METRICS

export const fmtCompact = (n: number) =>
  new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n)

export const fmtInt = (n: number) =>
  Number.isFinite(n) ? new Intl.NumberFormat('en').format(n) : '—'

export const timeLabel = (t: string) => (t.length > 10 ? t.slice(-5) : t.slice(5))

export const fmtEpoch = (ms: number) => {
  if (!Number.isFinite(ms)) return '—'
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const fmtCountdown = (ms: number) => {
  if (!Number.isFinite(ms) || ms <= 0) return '—'
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  if (m) return `${m}m`
  return '<1m'
}

export const fmtWindow = (limit: { unit: number; number: number }) => {
  const { unit, number } = limit
  const suffix = unit === 6 || unit === 1 ? 'd' : unit === 3 ? 'h' : 'm'
  return `${number}${suffix} rolling`
}

export const fmtRelative = (ts: number, now = Date.now()) => {
  if (!ts) return ''
  const s = Math.max(0, Math.floor((now - ts) / 1000))
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

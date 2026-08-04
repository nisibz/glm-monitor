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
  const unit = limit.unit === 3 ? `${limit.number}h` : limit.unit === 1 ? `${limit.number}d` : `${limit.number}m`
  return `${unit} rolling`
}

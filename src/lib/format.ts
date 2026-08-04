export const fmtCompact = (n: number) =>
  new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n)

export const fmtInt = (n: number) => new Intl.NumberFormat('en').format(n)

export const timeLabel = (t: string) => (t.length > 10 ? t.slice(-5) : t.slice(5))

export const fmtEpoch = (ms: number) => {
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

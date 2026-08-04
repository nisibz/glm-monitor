export const fmtCompact = (n: number) =>
  new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n)

export const fmtInt = (n: number) => new Intl.NumberFormat('en').format(n)

export const timeLabel = (t: string) => (t.length > 10 ? t.slice(-5) : t.slice(5))

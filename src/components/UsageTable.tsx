import { useMemo, useState } from 'react'
import { IconChevronLeft, IconChevronRight, IconSearch } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Row } from '@/data/usage'
import { fmtInt } from '@/lib/format'

const PAGE_SIZE = 15

type SortKey = 'time' | 'calls' | 'tokens'

export function UsageTable({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('time')
  const [asc, setAsc] = useState(true)
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q ? rows.filter((r) => r.time.includes(q)) : rows
    const dir = asc ? 1 : -1
    return [...list].sort((a, b) =>
      typeof a[sortKey] === 'string'
        ? String(a[sortKey]).localeCompare(String(b[sortKey])) * dir
        : (Number(a[sortKey]) - Number(b[sortKey])) * dir,
    )
  }, [rows, query, sortKey, asc])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages - 1)
  const pageRows = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setAsc(!asc)
    else {
      setSortKey(key)
      setAsc(true)
    }
    setPage(0)
  }

  const header = (key: SortKey, label: string) => (
    <TableHead
      className="cursor-pointer select-none"
      onClick={() => toggleSort(key)}
    >
      {label}
      {sortKey === key && <span className="ml-1 text-muted-foreground">{asc ? '↑' : '↓'}</span>}
    </TableHead>
  )

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle>Usage Details</CardTitle>
        <div className="relative w-full max-w-xs">
          <IconSearch className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search date..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {header('time', 'Date')}
              {header('calls', 'Calls')}
              {header('tokens', 'Tokens')}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((r) => (
              <TableRow key={r.time}>
                <TableCell className="font-mono text-xs">{r.time}</TableCell>
                <TableCell className="text-right tabular-nums">{fmtInt(r.calls)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmtInt(r.tokens)}</TableCell>
              </TableRow>
            ))}
            {pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} rows
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={current === 0}
              onClick={() => setPage(current - 1)}
              aria-label="Previous page"
            >
              <IconChevronLeft className="size-4" />
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums">
              {current + 1} / {pages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={current >= pages - 1}
              onClick={() => setPage(current + 1)}
              aria-label="Next page"
            >
              <IconChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

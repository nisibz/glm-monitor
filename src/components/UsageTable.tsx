import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Row } from '@/data/usage'
import { fmtCompact, fmtInt } from '@/lib/format'

const PAGE_SIZE = 10

type SortKey = 'time' | 'calls' | 'tokens'

export function UsageTable({ rows }: { rows: Row[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('time')
  const [asc, setAsc] = useState(true)
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const dir = asc ? 1 : -1
    return [...rows].sort((a, b) =>
      typeof a[sortKey] === 'string'
        ? String(a[sortKey]).localeCompare(String(b[sortKey])) * dir
        : (Number(a[sortKey]) - Number(b[sortKey])) * dir,
    )
  }, [rows, sortKey, asc])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages - 1)
  const pageRows = filtered.slice(
    current * PAGE_SIZE,
    (current + 1) * PAGE_SIZE,
  )

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setAsc(!asc)
    else {
      setSortKey(key)
      setAsc(true)
    }
    setPage(0)
  }

  const header = (
    key: SortKey,
    label: string,
    align: 'left' | 'right' = 'right',
  ) => (
    <TableHead
      className={`sticky top-0 z-10 cursor-pointer select-none bg-card ${align === 'right' ? 'text-right' : ''}`}
      onClick={() => toggleSort(key)}
    >
      {label}
      {sortKey === key && (
        <span className="ml-1 text-muted-foreground">{asc ? '↑' : '↓'}</span>
      )}
    </TableHead>
  )

  return (
    <Card className="flex h-135 flex-col">
      <CardHeader>
        <CardTitle>Usage Details</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        <div className="scrollbar-thin min-h-0 flex-1 overflow-auto">
          <TooltipProvider>
            <Table className="border-separate border-spacing-0">
              <TableHeader>
                <TableRow>
                  {header('time', 'Date', 'left')}
                  {header('calls', 'Calls')}
                  {header('tokens', 'Tokens')}
                </TableRow>
              </TableHeader>
              <TableBody
                key={current}
                className="motion-safe:fade-in motion-safe:animate-in motion-safe:duration-300"
              >
                {pageRows.map((r) => (
                  <TableRow key={r.time}>
                    <TableCell className="font-mono text-xs">
                      {r.time}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {fmtInt(r.calls)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-default underline decoration-muted-foreground/50 decoration-dotted underline-offset-4">
                            {fmtCompact(r.tokens, 2)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>{fmtInt(r.tokens)}</TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No results
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
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
            <span className="text-muted-foreground text-sm tabular-nums">
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

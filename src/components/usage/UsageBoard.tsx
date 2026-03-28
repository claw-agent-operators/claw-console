/**
 * UsageBoard — main component for the Usage view in claw-console.
 *
 * Fetches per-run token usage data from GET /api/v1/usage and displays:
 *   - A day-range selector (24h / 7d / 30d / 90d) to control the time window
 *   - Summary cards showing total runs, input/output tokens, and estimated cost
 *   - A detailed table with one row per agent run showing token breakdown,
 *     duration, and cost
 *   - A disclaimer noting that costs are estimates based on published rates
 *
 * Data auto-refreshes every 30 seconds via React Query.
 */
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { fetchJSON, type UsageResponse } from '@/lib/api'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

/** Time range presets for the day-range selector. */
const RANGE_OPTIONS = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
]

/** Format a token count with K/M suffix for compact display. */
function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

/** Format a USD cost — 2 decimal places for >= $1, 4 for smaller amounts. */
function formatCost(usd: number): string {
  if (usd >= 1) return `$${usd.toFixed(2)}`
  return `$${usd.toFixed(4)}`
}

/** Format a duration in ms as a human-readable string (e.g. "3.2s", "1m 30s"). */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  const s = ms / 1000
  if (s < 60) return `${s.toFixed(1)}s`
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`
}

/** Format an ISO timestamp as a short locale string (e.g. "Mar 28, 10:15 AM"). */
function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function UsageBoard() {
  const [days, setDays] = useState(7)

  const { data, error } = useQuery({
    queryKey: ['usage', days],
    queryFn: () => {
      const since = new Date(Date.now() - days * 86_400_000).toISOString()
      return fetchJSON<UsageResponse>(`/api/v1/usage?since=${since}`)
    },
    refetchInterval: 30_000,
  })

  const rows = data?.rows ?? []
  const totals = data?.totals

  return (
    <div className="space-y-4">
      {/* Range selector */}
      <div className="flex gap-1">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.days}
            onClick={() => setDays(opt.days)}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              days === opt.days
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground hover:bg-accent/50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-fail">{(error as Error).message}</p>}

      {/* Summary cards */}
      {totals && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardHeader className="pb-1 pt-3 px-4">
              <span className="text-xs text-muted-foreground">Runs</span>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-3">
              <span className="text-2xl font-semibold">{totals.runs}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-3 px-4">
              <span className="text-xs text-muted-foreground">Input tokens</span>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-3">
              <span className="text-2xl font-semibold">{formatTokens(totals.input_tokens)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-3 px-4">
              <span className="text-xs text-muted-foreground">Output tokens</span>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-3">
              <span className="text-2xl font-semibold">{formatTokens(totals.output_tokens)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-3 px-4">
              <span className="text-xs text-muted-foreground">Est. cost</span>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-3">
              <span className="text-2xl font-semibold">{formatCost(totals.estimated_cost_usd)}</span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Usage table */}
      {rows.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">No usage data for this period.</p>
      )}
      {rows.length > 0 && (
        <div className="rounded-lg border overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-3 py-2 font-medium">Group</th>
                <th className="text-left px-3 py-2 font-medium">Time</th>
                <th className="text-right px-3 py-2 font-medium">Input</th>
                <th className="text-right px-3 py-2 font-medium">Output</th>
                <th className="text-right px-3 py-2 font-medium">Cache read</th>
                <th className="text-right px-3 py-2 font-medium">Cache write</th>
                <th className="text-right px-3 py-2 font-medium">Duration</th>
                <th className="text-right px-3 py-2 font-medium">Cost</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-3 py-2 font-mono text-xs">{row.group_folder}</td>
                  <td className="px-3 py-2 text-muted-foreground">{formatTime(row.completed_at)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatTokens(row.input_tokens)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatTokens(row.output_tokens)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{formatTokens(row.cache_read_input_tokens)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{formatTokens(row.cache_creation_input_tokens)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{formatDuration(row.duration_ms)}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-medium">{formatCost(row.estimated_cost_usd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Disclaimer */}
      {totals && totals.runs > 0 && (
        <p className="text-xs text-muted-foreground">
          Based on published Anthropic rates for Claude Sonnet 4. Actual invoice may differ.
        </p>
      )}
    </div>
  )
}

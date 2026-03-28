import { useEffect } from 'react'
import { useHealthStore, type HealthCheck } from '@/store/health'
import { createWS } from '@/lib/ws'
import { HealthTile } from './HealthTile'

export function HealthBoard() {
  const { checks, upsertCheck } = useHealthStore()

  useEffect(() => {
    const ws = createWS('/ws/health?interval=15', (msg) => {
      if (msg.type === 'check') {
        upsertCheck(msg as unknown as HealthCheck)
      }
    })
    return () => ws.close()
  }, [upsertCheck])

  const grouped = new Map<string, HealthCheck[]>()
  for (const c of checks) {
    const list = grouped.get(c.arch) ?? []
    list.push(c)
    grouped.set(c.arch, list)
  }

  return (
    <div className="space-y-6">
      {grouped.size === 0 && (
        <p className="text-sm text-muted-foreground">Waiting for health data...</p>
      )}
      {[...grouped.entries()].map(([arch, archChecks]) => (
        <div key={arch}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">{arch}</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
            {archChecks.map((c) => (
              <HealthTile key={c.name} check={c} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

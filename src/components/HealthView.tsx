import { useEffect, useState } from 'react'
import { openWS } from '../api'

interface Check {
  arch: string
  name: string
  status: 'pass' | 'warn' | 'fail'
  detail: string
  remediation?: string
}

const statusColor: Record<string, string> = { pass: '#4c4', warn: '#ea4', fail: '#e44' }

export function HealthView() {
  const [checks, setChecks] = useState<Check[]>([])

  useEffect(() => {
    const ws = openWS('/ws/health?interval=15', (msg) => {
      if (msg.type === 'check') {
        setChecks((prev) => {
          const key = `${msg.arch}:${msg.name}`
          const next = prev.filter((c) => `${c.arch}:${c.name}` !== key)
          next.push(msg as unknown as Check)
          return next
        })
      }
    })
    return () => ws.close()
  }, [])

  const grouped = new Map<string, Check[]>()
  for (const c of checks) {
    const list = grouped.get(c.arch) ?? []
    list.push(c)
    grouped.set(c.arch, list)
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 1rem' }}>Health</h2>
      {grouped.size === 0 && <p style={{ color: '#888' }}>Waiting for health data...</p>}
      {[...grouped.entries()].map(([arch, archChecks]) => (
        <div key={arch} style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: '#aaa', marginBottom: '0.5rem' }}>{arch}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.5rem' }}>
            {archChecks.map((c) => (
              <div key={c.name} style={{ background: '#1a1a1a', border: `1px solid ${statusColor[c.status] ?? '#444'}`, borderRadius: 6, padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '0.85rem' }}>{c.name}</strong>
                  <span style={{ color: statusColor[c.status], fontSize: '0.8rem', fontWeight: 600 }}>{c.status.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{c.detail}</div>
                {c.remediation && <div style={{ fontSize: '0.75rem', color: '#ea4', marginTop: '0.25rem' }}>{c.remediation}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

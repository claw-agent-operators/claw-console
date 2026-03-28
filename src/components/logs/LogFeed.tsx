import { useEffect, useRef, useState } from 'react'
import { createWS } from '@/lib/ws'
import { GroupPicker } from '@/components/watch/GroupPicker'
import { TransportBadge } from '@/components/common/TransportBadge'
import { cn } from '@/lib/utils'

interface LogLine {
  text: string
  timestamp: string
  stream: string
}

export function LogFeed() {
  const [group, setGroup] = useState('')
  const [arch, setArch] = useState('')
  const [jid, setJid] = useState('')
  const [lines, setLines] = useState<LogLine[]>([])
  const [connected, setConnected] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!group) return
    setLines([]) // eslint-disable-line react-hooks/set-state-in-effect -- intentional reset on group change
    setConnected(true)
    const ws = createWS(`/ws/logs/${group}?arch=${arch}`, (msg) => {
      if (msg.type === 'log_line') {
        setLines((prev) => {
          const next = [...prev, msg as unknown as LogLine]
          return next.length > 2000 ? next.slice(-2000) : next
        })
      } else if (msg.type === 'error') {
        setLines((prev) => [...prev, {
          text: `[error] ${msg.message ?? msg.code ?? 'unknown'}`,
          timestamp: new Date().toISOString(),
          stream: 'error',
        }])
      }
    }, () => setConnected(false))
    return () => ws.close()
  }, [group, arch])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <GroupPicker value={group} onChange={(g, a, j) => { setGroup(g); setArch(a); setJid(j) }} />
        <TransportBadge jid={jid} />
        {group && (
          <span className={cn('text-xs', connected ? 'text-pass' : 'text-muted-foreground')}>
            {connected ? 'streaming' : 'disconnected'}
          </span>
        )}
      </div>
      {!group && <p className="text-sm text-muted-foreground">Select a group to stream container logs.</p>}
      {group && lines.length === 0 && (
        <p className="text-sm text-muted-foreground">Waiting for new log output...</p>
      )}
      <div className="flex-1 overflow-auto font-mono text-xs leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="py-px">
            <span className="text-muted-foreground mr-2">
              {new Date(line.timestamp).toLocaleTimeString()}
            </span>
            <span className={cn(
              line.stream === 'stderr' ? 'text-warn' :
              line.stream === 'error' ? 'text-fail' :
              'text-muted-foreground',
            )}>
              {line.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

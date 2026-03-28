import { useEffect, useRef, useState } from 'react'
import { createWS } from '@/lib/ws'
import { GroupPicker } from '@/components/watch/GroupPicker'
import { ReplMessage } from './ReplMessage'
import { ReplInput } from './ReplInput'
import { SessionBadge } from './SessionBadge'
import { LogDrawer } from './LogDrawer'

interface Turn {
  role: 'user' | 'assistant'
  text: string
}

export function Repl() {
  const [group, setGroup] = useState('')
  const [arch, setArch] = useState('')
  const [turns, setTurns] = useState<Turn[]>([])
  const [streaming, setStreaming] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [logsOpen, setLogsOpen] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!group) return
    setTurns([]) // eslint-disable-line react-hooks/set-state-in-effect -- intentional reset on group change
    setSessionId('')

    const ws = createWS(`/ws/agent/${group}?arch=${arch}`, (msg) => {
      if (msg.type === 'agent_output') {
        setTurns((prev) => {
          const last = prev[prev.length - 1]
          if (last?.role === 'assistant') {
            return [...prev.slice(0, -1), { ...last, text: last.text + (msg.text as string ?? '') }]
          }
          return [...prev, { role: 'assistant', text: (msg.text as string) ?? '' }]
        })
      } else if (msg.type === 'agent_complete') {
        setStreaming(false)
        if (msg.session_id) setSessionId(msg.session_id as string)
      }
    })
    wsRef.current = ws
    return () => ws.close()
  }, [group, arch])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [turns])

  const send = (text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    setTurns((prev) => [...prev, { role: 'user', text }])
    wsRef.current.send(JSON.stringify({ prompt: text }))
    setStreaming(true)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <GroupPicker value={group} onChange={(g, a, _j) => { setGroup(g); setArch(a) }} />
        <SessionBadge sessionId={sessionId} />
      </div>
      {!group && <p className="text-sm text-muted-foreground">Select a group to start a REPL session.</p>}
      <div className="flex-1 overflow-auto mb-3 font-mono">
        {turns.map((t, i) => (
          <ReplMessage key={i} role={t.role} text={t.text} />
        ))}
        {streaming && <p className="text-xs text-muted-foreground animate-pulse">...</p>}
        <div ref={bottomRef} />
      </div>
      {group && <ReplInput onSend={send} disabled={streaming} />}
      {group && (
        <LogDrawer
          group={group}
          arch={arch}
          open={logsOpen}
          onToggle={() => setLogsOpen((v) => !v)}
        />
      )}
    </div>
  )
}

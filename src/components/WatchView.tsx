import { useEffect, useRef, useState } from 'react'
import { openWS } from '../api'
import { GroupPicker } from './GroupPicker'

interface Message {
  timestamp: string
  sender: string
  content: string
  is_bot: boolean
}

export function WatchView() {
  const [group, setGroup] = useState('')
  const [arch, setArch] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!group) return
    setMessages([])
    const ws = openWS(`/ws/watch/${group}?arch=${arch}&lines=50`, (msg) => {
      if (msg.type === 'message') {
        setMessages((prev) => [...prev, msg as unknown as Message])
      }
    })
    wsRef.current = ws
    return () => ws.close()
  }, [group, arch])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Watch</h2>
        <GroupPicker value={group} onChange={(g, a) => { setGroup(g); setArch(a) }} />
      </div>
      {!group && <p style={{ color: '#888' }}>Select a group to watch.</p>}
      <div style={{ flex: 1, overflow: 'auto', fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.6 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '0.25rem' }}>
            <span style={{ color: '#666', marginRight: '0.5rem' }}>{new Date(m.timestamp).toLocaleTimeString()}</span>
            <span style={{ color: m.is_bot ? '#6cf' : '#ccc', fontWeight: 600, marginRight: '0.5rem' }}>{m.sender}</span>
            <span style={{ color: '#ddd' }}>{m.content}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

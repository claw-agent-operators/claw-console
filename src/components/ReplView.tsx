import { useEffect, useRef, useState } from 'react'
import { GroupPicker } from './GroupPicker'

interface Turn {
  role: 'user' | 'assistant'
  text: string
}

export function ReplView() {
  const [group, setGroup] = useState('')
  const [arch, setArch] = useState('')
  const [turns, setTurns] = useState<Turn[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!group) return
    setTurns([])

    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const base = import.meta.env.VITE_API_URL?.replace(/^http/, 'ws') ?? `${proto}//${window.location.host}`
    const url = new URL(`/ws/agent/${group}?arch=${arch}`, base)
    const token = new URLSearchParams(window.location.search).get('token')
    if (token) url.searchParams.set('token', token)

    const ws = new WebSocket(url.toString())
    wsRef.current = ws

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'agent_output') {
          setTurns((prev) => {
            const last = prev[prev.length - 1]
            if (last?.role === 'assistant') {
              return [...prev.slice(0, -1), { ...last, text: last.text + (msg.text ?? '') }]
            }
            return [...prev, { role: 'assistant', text: msg.text ?? '' }]
          })
        } else if (msg.type === 'agent_complete') {
          setStreaming(false)
        }
      } catch { /* ignore */ }
    }

    return () => ws.close()
  }, [group, arch])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [turns])

  const send = () => {
    const prompt = input.trim()
    if (!prompt || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    setTurns((prev) => [...prev, { role: 'user', text: prompt }])
    wsRef.current.send(JSON.stringify({ prompt }))
    setInput('')
    setStreaming(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>REPL</h2>
        <GroupPicker value={group} onChange={(g, a) => { setGroup(g); setArch(a) }} />
      </div>
      {!group && <p style={{ color: '#888' }}>Select a group to start a REPL session.</p>}
      <div style={{ flex: 1, overflow: 'auto', fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
        {turns.map((t, i) => (
          <div key={i} style={{ marginBottom: '0.75rem' }}>
            <div style={{ color: t.role === 'user' ? '#ccc' : '#6cf', fontWeight: 600, marginBottom: '0.15rem' }}>
              {t.role === 'user' ? 'You' : 'Agent'}
            </div>
            <div style={{ color: '#ddd', whiteSpace: 'pre-wrap' }}>{t.text}</div>
          </div>
        ))}
        {streaming && <div style={{ color: '#666' }}>...</div>}
        <div ref={bottomRef} />
      </div>
      {group && (
        <form
          onSubmit={(e) => { e.preventDefault(); send() }}
          style={{ display: 'flex', gap: '0.5rem' }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a prompt..."
            disabled={streaming}
            style={{
              flex: 1, background: '#1a1a1a', color: '#eee', border: '1px solid #444',
              borderRadius: 4, padding: '0.5rem 0.75rem', fontSize: '0.85rem', fontFamily: 'monospace',
            }}
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            style={{
              background: '#333', color: '#eee', border: '1px solid #555',
              borderRadius: 4, padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem',
            }}
          >
            Send
          </button>
        </form>
      )}
    </div>
  )
}

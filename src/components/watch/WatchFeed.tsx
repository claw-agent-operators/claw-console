import { useEffect, useRef, useState } from 'react'
import { createWS } from '@/lib/ws'
import { GroupPicker } from './GroupPicker'
import { MessageBubble } from './MessageBubble'

interface Message {
  timestamp: string
  sender: string
  content: string
  is_bot: boolean
}

export function WatchFeed() {
  const [group, setGroup] = useState('')
  const [arch, setArch] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!group) return
    setMessages([])
    const ws = createWS(`/ws/watch/${group}?arch=${arch}&lines=50`, (msg) => {
      if (msg.type === 'message') {
        setMessages((prev) => [...prev, msg as unknown as Message])
      }
    })
    return () => ws.close()
  }, [group, arch])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <GroupPicker value={group} onChange={(g, a) => { setGroup(g); setArch(a) }} />
      </div>
      {!group && <p className="text-sm text-muted-foreground">Select a group to watch.</p>}
      <div className="flex-1 overflow-auto">
        {messages.map((m, i) => (
          <MessageBubble
            key={i}
            timestamp={m.timestamp}
            sender={m.sender}
            content={m.content}
            isBot={m.is_bot}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

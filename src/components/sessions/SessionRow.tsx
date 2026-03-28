import { useState } from 'react'
import type { Session } from '@/lib/api'
import { Badge } from '@/components/ui/badge'

export function SessionRow({ session }: { session: Session }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(session.session_id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const lastActive = /^\d+$/.test(session.last_active)
    ? new Date(parseInt(session.last_active) * 1000).toLocaleString()
    : session.last_active ? new Date(session.last_active).toLocaleString() : ''

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="p-3 font-mono text-xs">
        <span
          className="cursor-pointer hover:text-primary transition-colors"
          onClick={copy}
          title="Click to copy session ID"
        >
          {copied ? 'copied!' : session.session_id.length > 20 ? session.session_id.slice(0, 8) + '...' : session.session_id}
        </span>
        {session.resumable && <Badge variant="pass" className="ml-2 text-[9px]">resumable</Badge>}
      </td>
      <td className="p-3 text-sm text-muted-foreground">{lastActive}</td>
      <td className="p-3 text-sm">{session.message_count || ''}</td>
      <td className="p-3 text-sm text-muted-foreground max-w-md truncate">{session.summary}</td>
    </tr>
  )
}

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

export function SessionBadge({ sessionId }: { sessionId: string }) {
  const [copied, setCopied] = useState(false)

  if (!sessionId) return null

  const copy = () => {
    navigator.clipboard.writeText(sessionId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Badge
      variant="outline"
      className="font-mono text-[10px] cursor-pointer hover:bg-accent transition-colors"
      onClick={copy}
      title="Click to copy session ID"
    >
      {copied ? 'copied!' : `session: ${sessionId.slice(0, 12)}...`}
    </Badge>
  )
}

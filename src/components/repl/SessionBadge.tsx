import { Badge } from '@/components/ui/badge'

export function SessionBadge({ sessionId }: { sessionId: string }) {
  if (!sessionId) return null
  return (
    <Badge variant="outline" className="font-mono text-[10px]">
      session: {sessionId}
    </Badge>
  )
}

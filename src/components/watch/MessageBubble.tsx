import { cn } from '@/lib/utils'

interface Props {
  timestamp: string
  sender: string
  content: string
  isBot: boolean
}

export function MessageBubble({ timestamp, sender, content, isBot }: Props) {
  return (
    <div className="py-0.5 font-mono text-xs leading-relaxed">
      <span className="text-muted-foreground mr-2">
        {new Date(timestamp).toLocaleTimeString()}
      </span>
      <span className={cn('font-semibold mr-2', isBot ? 'text-primary' : 'text-foreground')}>
        {sender}
      </span>
      <span className="text-foreground/90">{content}</span>
    </div>
  )
}
